$ErrorActionPreference = 'Stop'

$baseDirs = @(
    "C:\Users\Victo\Downloads\synarc-v4\synarc\synarc-universal\skills",
    "C:\Users\Victo\Downloads\synarc-v4\synarc\plugins"
)

$deprecatedAgents = @('claude-web', 'codex-cli', 'skillmd-runtime', 'agentsmd-runtime', 'glama', 'aider', 'windsurf')
$removeFieldNames = @('activation', 'cache', 'parent', 'minimumVersion')

$changes = @()

foreach ($baseDir in $baseDirs) {
    $files = Get-ChildItem -Path $baseDir -Recurse -Filter "SKILL.md"
    foreach ($file in $files) {
        $dirName = $file.Directory.Name
        $content = Get-Content -LiteralPath $file.FullName -Raw
        $originalContent = $content
        $changeLog = @()

        # Find frontmatter boundaries using IndexOf
        $firstIdx = $content.IndexOf('---')
        if ($firstIdx -ne 0) {
            # No frontmatter at start - generate one
            $heading = if ($content -match '#\s+(.+)') { $matches[1].Trim() } else { $dirName }
            $newFm = "---`r`n"
            $newFm += "name: $dirName`r`n"
            $newFm += "description: $heading`r`n"
            $newFm += 'version: "2.0.0"' + "`r`n"
            $newFm += 'schema: skill-pack/v1' + "`r`n"
            $newFm += 'skill_type:' + "`r`n"
            $newFm += '  - capability' + "`r`n"
            $newFm += 'dependencies:' + "`r`n"
            $newFm += '  synarc-core: ">=5.0.0"' + "`r`n"
            $newFm += "---`r`n"
            $content = $newFm + $content
            $changeLog += "Generated frontmatter (was missing)"
            $changes += New-Object PSObject -Property @{ File = $file.FullName; Changes = $changeLog -join '; ' }
            Set-Content -LiteralPath $file.FullName -Value $content -Encoding UTF8 -NoNewline
            continue
        }

        # Find closing --- after position 3
        $secondIdx = $content.IndexOf('---', 4)
        if ($secondIdx -eq -1) {
            # Cannot find closing ---
            continue
        }

        # Extract frontmatter: between first ---\n and \n---
        # The closing --- may have content before it on the same line
        # Find the actual start: after first --- and its newline
        $fmStart = 3  # after "---"
        # Skip the newline after first ---
        if ($content[$fmStart] -eq "`r") { $fmStart++ }
        if ($content[$fmStart] -eq "`n") { $fmStart++ }

        # Find the real start of the closing ---
        # It might be on its own line (preceded by \n) or at the start of content
        $closingStart = $secondIdx
        # Back up to find if there's a newline before ---
        $precedingNewline = $content.LastIndexOfAny(@("`r", "`n"), $secondIdx - 1)
        if ($precedingNewline -ge $fmStart) {
            # The --- is on its own line - the frontmatter content ends at the newline before ---
            $fmEnd = $precedingNewline
        } else {
            $fmEnd = $secondIdx
        }

        $fmRaw = $content.Substring($fmStart, $fmEnd - $fmStart)
        $fmLines = $fmRaw -split '\r?\n'

        # ---- Build list of required field additions ----
        # Check which top-level fields exist (non-indented, key:value at start of line)
        function Get-TopLevelKey($line) {
            if ($line -match '^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:') { return $matches[1] }
            return $null
        }

        $existingKeys = @()
        foreach ($line in $fmLines) {
            $key = Get-TopLevelKey $line
            if ($key) {
                if (-not $existingKeys.Contains($key)) { $existingKeys += $key }
            }
        }

        $needsName = -not $existingKeys.Contains('name')
        $needsDescription = -not $existingKeys.Contains('description')
        $needsVersion = -not $existingKeys.Contains('version')
        $needsSchema = -not $existingKeys.Contains('schema')
        $needsSkillType = -not $existingKeys.Contains('skill_type')
        $needsDependencies = -not $existingKeys.Contains('dependencies')

        # ---- Build new frontmatter lines preserving existing content ----
        $newFmLines = @()
        $inCompatibleAgents = $false
        $compatLines = @()
        $skipField = $false

        foreach ($line in $fmLines) {
            $key = Get-TopLevelKey $line
            $trimmedLine = $line.TrimStart()

            # Handle compatible_agents block
            if ($key -eq 'compatible_agents') {
                $inCompatibleAgents = $true
                if ($line -match '\[(.*)\]') {
                    # Inline list format: compatible_agents: [item1, item2]
                    $items = $matches[1] -split ',\s*' | ForEach-Object { $_.Trim().Trim('"', "'") }
                    $filtered = $items | Where-Object { $_ -notin $deprecatedAgents }
                    $removed = $items | Where-Object { $_ -in $deprecatedAgents }
                    if ($removed.Count -gt 0) {
                        $changeLog += "Removed from compatible_agents: $($removed -join ', ')"
                    }
                    $newLine = if ($filtered.Count -gt 0) {
                        $quoted = $filtered | ForEach-Object { if ($_ -match '\s') { "'$_'" } else { $_ } }
                        @($line -replace '\[.*\]', "[$($quoted -join ', ')]")[0]
                    } else {
                        $null  # Remove the field entirely if no entries left
                    }
                    if ($newLine) { $newFmLines += $newLine }
                    $inCompatibleAgents = $false
                }
                continue
            }
            if ($inCompatibleAgents) {
                if ($line -match '^\s+-\s+(.+)$') {
                    $agent = $matches[1].Trim()
                    if ($agent -in $deprecatedAgents) {
                        $changeLog += "Removed from compatible_agents: $agent"
                    } else {
                        $compatLines += $line
                    }
                } else {
                    # End of compatible_agents block
                    if ($compatLines.Count -gt 0) { $newFmLines += "compatible_agents:"; $newFmLines += $compatLines }
                    $inCompatibleAgents = $false
                    $compatLines = @()
                    $newFmLines += $line
                }
                continue
            }

            # Skip deprecated fields
            if ($removeFieldNames -contains $key) {
                $changeLog += "Removed field: $key"
                continue
            }

            $newFmLines += $line
        }

        # If compatible_agents block was at the end of frontmatter
        if ($inCompatibleAgents -and $compatLines.Count -gt 0) {
            $newFmLines += "compatible_agents:"
            $newFmLines += $compatLines
        } elseif ($inCompatibleAgents) {
            # Was tracking but no valid entries - field dropped
        }

        # Now add missing required fields at the top (after name if exists, or at the very start)
        $additions = @()
        if ($needsName) { $additions += "name: $dirName" }
        if ($needsDescription) {
            # Try to get first heading from content after frontmatter
            $afterFm = $content.Substring($secondIdx + 3)
            $heading = if ($afterFm -match '#\s+(.+)') { $matches[1].Trim() } else { $dirName }
            $additions += "description: $heading"
        }
        if ($needsVersion) { $additions += 'version: "2.0.0"' }
        if ($needsSchema) { $additions += 'schema: skill-pack/v1' }
        if ($needsSkillType) { $additions += "skill_type:"; $additions += "  - capability" }
        if ($needsDependencies) { $additions += "dependencies:"; $additions += '  synarc-core: ">=5.0.0"' }

        if ($additions.Count -gt 0) {
            # Prepend to newFmLines, after existing name if present
            $nameIdx = -1
            for ($i = 0; $i -lt $newFmLines.Count; $i++) {
                if ($newFmLines[$i] -match '^name:') { $nameIdx = $i; break }
            }
            if ($nameIdx -ge 0) {
                $newFmLines = @($newFmLines[0..$nameIdx]) + $additions + @($newFmLines[($nameIdx+1)..($newFmLines.Count-1)])
            } else {
                $newFmLines = $additions + $newFmLines
            }
            $changeLog += "Added missing fields: $($additions -join ', ')"
        }

        $newFmStr = $newFmLines -join "`r`n"
        $afterFmContent = $content.Substring($secondIdx + 3)
        $newContent = "---`r`n" + $newFmStr + "`r`n---" + $afterFmContent

        if ($newContent -ne $originalContent) {
            $changes += New-Object PSObject -Property @{ File = $file.FullName; Changes = $changeLog -join '; ' }
            Set-Content -LiteralPath $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        }
    }
}

if ($changes.Count -eq 0) {
    Write-Host "No files needed changes."
} else {
    Write-Host "`n=== FILES FIXED ==="
    foreach ($c in $changes) {
        Write-Host "`nFILE: $($c.File)"
        Write-Host "  $($c.Changes)"
    }
}
Write-Host "`nTotal: $($changes.Count) files modified."
