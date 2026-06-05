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
        # Determine the correct skill name based on path
        # synarc-universal/skills/<name>/SKILL.md  → <name>
        # plugins/<name>/skills/SKILL.md           → <name>
        $parentDir = $file.Directory
        if ($parentDir.Name -eq 'skills') {
            $skillName = $parentDir.Parent.Name
        } else {
            $skillName = $parentDir.Name
        }

        $content = Get-Content -LiteralPath $file.FullName -Raw
        $originalContent = $content
        $changeLog = @()

        # Use regex with Singleline to extract frontmatter
        $regex = [regex]::new('^---\s*\r?\n(.*?)\r?\n---', 'Singleline')
        $match = $regex.Match($content)

        if (-not $match.Success) {
            # No valid frontmatter — generate one
            $heading = if ($content -match '#\s+(.+?)($|\r?\n)') { $matches[1].Trim() } else { $skillName }
            $newFm = "---`r`n"
            $newFm += "name: $skillName`r`n"
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

        $fmRaw = $match.Groups[1].Value
        $fmLines = $fmRaw -split '\r?\n'
        $oldFmEnd = $match.Length  # end position of full frontmatter including delimiters

        # ---- Identify top-level keys ----
        function Get-TopLevelKey($line) {
            if ($line -match '^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:') { return $matches[1] }
            return $null
        }

        $existingKeys = @()
        foreach ($line in $fmLines) {
            $key = Get-TopLevelKey $line
            if ($key -and (-not $existingKeys.Contains($key))) { $existingKeys += $key }
        }

        $needsName = -not $existingKeys.Contains('name')
        $needsDescription = -not $existingKeys.Contains('description')
        $needsVersion = -not $existingKeys.Contains('version')
        $needsSchema = -not $existingKeys.Contains('schema')
        $needsSkillType = -not $existingKeys.Contains('skill_type')
        $needsDependencies = -not $existingKeys.Contains('dependencies')

        # ---- Build new frontmatter lines ----
        $newFmLines = @()
        $inCompatibleAgents = $false
        $compatLines = @()

        foreach ($line in $fmLines) {
            $key = Get-TopLevelKey $line

            # Handle compatible_agents block
            if ($key -eq 'compatible_agents') {
                $inCompatibleAgents = $true
                if ($line -match '\[(.*)\]') {
                    $items = $matches[1] -split ',\s*' | ForEach-Object { $_.Trim().Trim('"', "'") }
                    $filtered = $items | Where-Object { $_ -notin $deprecatedAgents }
                    $removed = $items | Where-Object { $_ -in $deprecatedAgents }
                    if ($removed.Count -gt 0) {
                        $changeLog += "Removed compat entries: $($removed -join ', ')"
                    }
                    if ($filtered.Count -gt 0) {
                        $quoted = $filtered | ForEach-Object { if ($_ -match '\s') { "'$_'" } else { $_ } }
                        $newFmLines += "compatible_agents: [$($quoted -join ', ')]"
                    }
                    $inCompatibleAgents = $false
                }
                continue
            }
            if ($inCompatibleAgents) {
                if ($line -match '^\s+-\s+(.+)$') {
                    $agent = $matches[1].Trim()
                    if ($agent -in $deprecatedAgents) {
                        $changeLog += "Removed compat entry: $agent"
                    } else {
                        $compatLines += $line
                    }
                } else {
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

        if ($inCompatibleAgents -and $compatLines.Count -gt 0) {
            $newFmLines += "compatible_agents:"
            $newFmLines += $compatLines
        }

        # ---- Add missing required fields after any existing name: line ----
        $additions = @()
        if ($needsName) { $additions += "name: $skillName" }
        if ($needsDescription) {
            $afterFm = $content.Substring($oldFmEnd)
            $heading = if ($afterFm -match '#\s+(.+?)($|\r?\n)') { $matches[1].Trim() } else { $skillName }
            $additions += "description: $heading"
        }
        if ($needsVersion) { $additions += 'version: "2.0.0"' }
        if ($needsSchema) { $additions += 'schema: skill-pack/v1' }
        if ($needsSkillType) { $additions += "skill_type:"; $additions += "  - capability" }
        if ($needsDependencies) { $additions += "dependencies:"; $additions += '  synarc-core: ">=5.0.0"' }

        if ($additions.Count -gt 0) {
            $nameIdx = -1
            for ($i = 0; $i -lt $newFmLines.Count; $i++) {
                if ($newFmLines[$i] -match '^name:') { $nameIdx = $i; break }
            }
            if ($nameIdx -ge 0) {
                $newFmLines = @($newFmLines[0..$nameIdx]) + $additions + @($newFmLines[($nameIdx+1)..($newFmLines.Count-1)])
            } else {
                $newFmLines = $additions + $newFmLines
            }
            $changeLog += "Added: $($additions -join '; ')"
        }

        # ---- Rebuild file ----
        $newFmStr = $newFmLines -join "`r`n"
        $afterFmContent = $content.Substring($oldFmEnd)
        $newContent = "---`r`n" + $newFmStr + "`r`n---" + $afterFmContent

        if ($newContent -ne $originalContent) {
            $changes += New-Object PSObject -Property @{ File = $file.FullName; Changes = $changeLog -join '; ' }
            Set-Content -LiteralPath $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        }
    }
}

Write-Host "`n=== FILES FIXED ==="
foreach ($c in $changes) {
    Write-Host "`nFILE: $($c.File)"
    Write-Host "  $($c.Changes)"
}
Write-Host "`nTotal: $($changes.Count) files modified."

if ($changes.Count -eq 0) {
    Write-Host "No files needed changes."
}
