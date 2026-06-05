# Fix script: patch known issues in converted SKILL.md files
$universalPath = "C:\Users\Victo\Downloads\synarc-v4\synarc\synarc-universal\skills"

$fixes = 0
$files = Get-ChildItem -LiteralPath $universalPath -Recurse -Filter "SKILL.md"

function Add-MissingField($fmBody, $fieldName, $fieldValue) {
    $pattern = "(?m)^${fieldName}:"
    if ($fmBody -notmatch $pattern) {
        return "${fieldName}: ${fieldValue}`r`n${fmBody}"
    }
    return $fmBody
}

function Remove-Line($fmBody, $pattern) {
    $result = $fmBody -replace "(?m)^${pattern}\r?\n?", ''
    if ($result -ne $fmBody) { return $result }
    return $fmBody -replace "(?m)^${pattern}\r?\n?", ''
}

foreach ($file in $files) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $skillName = $file.Directory.Name
    $changed = $false

    # Extract frontmatter
    $fmMatch = [regex]::Match($content, '(?s)^---[\r\n]+(.+?)[\r\n]+---')
    
    if (-not $fmMatch.Success) {
        # No frontmatter at all
        $titleMatch = [regex]::Match($content, '(?m)^# (.+)')
        $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value.Trim() } else { $skillName }
        
        $newFm = @"
---
name: ${skillName}
description: >
  ${title}
version: 2.0.0
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
---

"@
        $content = $newFm + $content
        $changed = $true
    } else {
        $fmBody = $fmMatch.Groups[1].Value
        
        # Remove deprecated compatible_agents
        $fmBody = Remove-Line $fmBody '  - (claude-web|codex-cli|skillmd-runtime|agentsmd-runtime|glama|aider|windsorf)'
        if ($fmBody -ne $fmMatch.Groups[1].Value) { $changed = $true }
        
        # Restore: keep $fmMatch for comparison
        $originalFmBody = $fmMatch.Groups[1].Value
        
        # Add name if missing
        $newBody = Add-MissingField $fmBody "name" $skillName
        if ($newBody -ne $fmBody) { $changed = $true; $fmBody = $newBody }
        
        # Add version if missing
        $newBody = Add-MissingField $fmBody "version" "2.0.0"
        if ($newBody -ne $fmBody) { $changed = $true; $fmBody = $newBody }
        
        # Add description if missing
        $newBody = Add-MissingField $fmBody "description" ">"
        if ($newBody -ne $fmBody) { $changed = $true; $fmBody = $newBody }
        # Fix description with > continuation
        if ($fmBody -match '(?m)^description: >\r?\n$') {
            $fmBody = $fmBody -replace '(?m)^description: >\r?\n$', "description: >`r`n  ${skillName} engineering skill`r`n"
            $changed = $true
        }
        
        # Add skill_type if missing
        $newBody = Add-MissingField $fmBody "skill_type" ""
        if ($newBody -ne $fmBody) { $changed = $true; $fmBody = $newBody }
        # Fix empty skill_type
        if ($fmBody -match '(?m)^skill_type: (?:\r?\n)?$') {
            $fmBody = $fmBody -replace '(?m)^skill_type: \r?\n?$', "skill_type:`r`n  - capability`r`n"
            $changed = $true
        }
        
        # Add dependencies if missing
        $newBody = Add-MissingField $fmBody "dependencies" ""
        if ($newBody -ne $fmBody) { $changed = $true; $fmBody = $newBody }
        if ($fmBody -match '(?m)^dependencies: (?:\r?\n)?$') {
            $fmBody = $fmBody -replace '(?m)^dependencies: \r?\n?$', "dependencies:`r`n  synarc-core: "">=5.0.0""" + "`r`n"
            $changed = $true
        }
        
        if ($changed) {
            $content = $content.Substring(0, $fmMatch.Index) + "---`r`n" + $fmBody + "---`r`n" + $content.Substring($fmMatch.Index + $fmMatch.Length)
        }
    }
    
    if ($changed) {
        $content | Set-Content -LiteralPath $file.FullName -NoNewline -Encoding UTF8
        $fixes++
    }
}

Write-Host "Fixed ${fixes} files with frontmatter issues"
