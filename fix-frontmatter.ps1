$ErrorActionPreference = 'Stop'

$skillsDir = "C:\Users\Victo\Downloads\synarc-v4\synarc\synarc-universal\skills"
$files = Get-ChildItem -Path $skillsDir -Recurse -Filter "SKILL.md"

$deprecatedAgents = @('claude-web', 'codex-cli', 'skillmd-runtime', 'agentsmd-runtime', 'glama', 'aider', 'windsurf')
$removeFields = @('activation:', 'cache:', 'parent:', 'minimumVersion:')

$changes = @()

foreach ($file in $files) {
    $dirName = $file.Directory.Name
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $originalContent = $content
    $changed = $false
    $changeLog = @()

    # Check frontmatter exists with --- delimiters
    if ($content -match '^---\s*\r?\n(.*?)\r?\n---') {
        $fmRaw = $matches[1]
        $fmLines = $fmRaw -split '\r?\n'
        $fmEndIndex = $matches[0].Length
    } else {
        # No frontmatter - generate one
        # Extract first # heading for description
        if ($content -match '#\s+(.+)') {
            $heading = $matches[1].Trim()
        } else {
            $heading = $dirName
        }
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
        $changed = $true
        $changeLog += "Generated frontmatter (was missing)"
        $changes += New-Object PSObject -Property @{ File = $file.FullName; Changes = $changeLog -join '; ' }
        Set-Content -LiteralPath $file.FullName -Value $content -Encoding UTF8 -NoNewline
        continue
    }

    # Find where frontmatter ends (after the closing ---)
    $fmEndMatch = [regex]::Match($content, '^---\s*\r?\n(.*?)\r?\n---', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $fmEnd = $fmEndMatch.Length
    $afterFm = $content.Substring($fmEnd)

    # 1. Check for required fields
    $hasName = $fmRaw -match '(?m)^name:'
    $hasDescription = $fmRaw -match '(?m)^description:'
    $hasVersion = $fmRaw -match '(?m)^version:'
    $hasSchema = $fmRaw -match '(?m)^schema:'
    $hasSkillType = $fmRaw -match '(?m)^skill_type:'
    $hasDependencies = $fmRaw -match '(?m)^dependencies:'

    $workingFm = $fmRaw

    # Add name: if missing
    if (-not $hasName) {
        $workingFm = "name: $dirName`r`n$workingFm"
        $changeLog += "Added name: $dirName"
        $changed = $true
    }

    # Add description: if missing
    if (-not $hasDescription) {
        # Extract first # heading
        if ($afterFm -match '#\s+(.+)') {
            $heading = $matches[1].Trim()
        } else {
            $heading = $dirName
        }
        $workingFm = "description: $heading`r`n$workingFm"
        $changeLog += "Added description (from heading)"
        $changed = $true
    }

    # Add version: if missing
    if (-not $hasVersion) {
        $workingFm = $workingFm -replace '(?m)^schema:', "version: `"2.0.0`"`r`n`$0"
        if ($workingFm -notmatch '(?m)^version:') {
            $workingFm = "version: `"2.0.0`"`r`n$workingFm"
        }
        $changeLog += 'Added version: "2.0.0"'
        $changed = $true
    }

    # Add schema: if missing
    if (-not $hasSchema) {
        $workingFm = "schema: skill-pack/v1`r`n$workingFm"
        $changeLog += 'Added schema: skill-pack/v1'
        $changed = $true
    }

    # Add skill_type: if missing
    if (-not $hasSkillType) {
        $workingFm = "skill_type:`r`n  - capability`r`n$workingFm"
        $changeLog += 'Added skill_type: capability'
        $changed = $true
    }

    # Add dependencies: if missing
    if (-not $hasDependencies) {
        $workingFm = "dependencies:`r`n  synarc-core: `">=5.0.0`"`r`n$workingFm"
        $changeLog += 'Added dependencies: synarc-core >=5.0.0'
        $changed = $true
    }

    # 2. Remove deprecated compatible_agents entries
    $fmLines2 = $workingFm -split '\r?\n'
    $inCompatibleAgents = $false
    $newLines = @()
    $agentsRemoved = @()
    foreach ($line in $fmLines2) {
        if ($line -match '^compatible_agents:') {
            $inCompatibleAgents = $true
            # Check if it's inline like `compatible_agents: [list, ...]`
            if ($line -match '\[(.*)\]') {
                $listStr = $matches[1]
                $items = $listStr -split ',\s*' | ForEach-Object { $_.Trim().Trim('"', "'") }
                $filtered = $items | Where-Object { $_ -notin $deprecatedAgents }
                if (($items | ForEach-Object { $_.Trim() }) -join ',' -ne ($filtered | ForEach-Object { if ($_ -match '\s') { "'$_'" } else { $_ } }) -join ',') {
                    $removed = $items | Where-Object { $_ -in $deprecatedAgents }
                    $agentsRemoved += $removed
                    $changed = $true
                }
                $newStr = ($filtered | ForEach-Object { if ($_ -match '\s') { "'$_'" } else { $_ } }) -join ', '
                $newLines += "compatible_agents: [$newStr]"
            } else {
                $newLines += $line
            }
        } elseif ($inCompatibleAgents) {
            if ($line -match '^\s+-\s+(.+)$') {
                $agent = $matches[1].Trim()
                if ($agent -in $deprecatedAgents) {
                    $agentsRemoved += $agent
                    $changed = $true
                    # Skip this line
                } else {
                    $newLines += $line
                }
            } else {
                $inCompatibleAgents = $false
                $newLines += $line
            }
        } else {
            $newLines += $line
        }
    }
    if ($agentsRemoved.Count -gt 0) {
        $changeLog += "Removed compatible_agents: $($agentsRemoved -join ', ')"
    }
    $workingFm = $newLines -join "`r`n"

    # 3. Remove activation:, cache:, parent:, minimumVersion: lines
    $tmpLines = $workingFm -split '\r?\n'
    $filteredLines = @()
    foreach ($line in $tmpLines) {
        $trimmed = $line.TrimStart()
        $remove = $false
        foreach ($rf in $removeFields) {
            if ($trimmed -match "^$rf") {
                $remove = $true
                break
            }
        }
        if (-not $remove) {
            $filteredLines += $line
        }
    }
    if ($filteredLines.Count -ne $tmpLines.Count) {
        $changeLog += "Removed deprecated fields (activation/cache/parent/minimumVersion)"
        $changed = $true
    }
    $workingFm = $filteredLines -join "`r`n"

    # Rebuild the file
    $newContent = "---`r`n" + $workingFm + "`r`n---" + $afterFm

    if ($changed) {
        Set-Content -LiteralPath $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        $changes += New-Object PSObject -Property @{ File = $file.FullName; Changes = $changeLog -join '; ' }
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
