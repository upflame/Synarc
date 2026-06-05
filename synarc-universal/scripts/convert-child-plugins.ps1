# Child Plugin Converter
# Reads each Claude plugin, converts to universal format

$pluginsPath = "C:\Users\Victo\Downloads\synarc-v4\synarc\plugins"
$universalPath = "C:\Users\Victo\Downloads\synarc-v4\synarc\synarc-universal\skills"
$sharedGuardrails = "C:\Users\Victo\Downloads\synarc-v4\synarc\synarc-universal\shared\guardrails\constitutional-rules.yaml"

$pluginDirs = Get-ChildItem -LiteralPath $pluginsPath -Directory | Where-Object {         $_.Name -ne "synarc" }
$totalPlugins = $pluginDirs.Count
$converted = 0
$errList = @()

foreach ($dir in $pluginDirs) {
    $pluginName = $dir.Name
    $sourceSkill = Join-Path (Join-Path $dir.FullName "skills") "SKILL.md"
    $targetDir = Join-Path $universalPath $pluginName
    $targetSkill = Join-Path $targetDir "SKILL.md"
    
    $counter = $converted + 1
    Write-Host "[${counter}/${totalPlugins}] Converting ${pluginName}..."
    
    if (-not (Test-Path -LiteralPath $sourceSkill)) {
        $errList += "${pluginName}: No SKILL.md found"
        continue
    }
    
    try {
        $content = Get-Content -LiteralPath $sourceSkill -Raw -ErrorAction Stop
        
        # FRONTMATTER TRANSFORMATIONS
        # 1. Change compatibility: to compatible_agents:
        $content = $content -replace '(?m)^compatibility:', 'compatible_agents:'
        
        # 2. Remove activation:, parent:, minimumVersion: lines
        $content = $content -replace '(?m)^activation:.*\r?\n?', ''
        $content = $content -replace '(?m)^parent:.*\r?\n?', ''
        $content = $content -replace '(?m)^minimumVersion:.*\r?\n?', ''
        
        # 3. Add schema and skill_type after version line
        $content = $content -replace '(?m)^(version:\s*\S+)', "`$1`nschema: skill-pack/v1`nskill_type:`n  - capability"
        
        # 4. Add dependencies after skill_type
        $content = $content -replace '(?m)^(skill_type:\r?\n  - capability)', "`$1`ndependencies:`n  synarc-core: "">=5.0.0"""
        
        # BODY TRANSFORMATIONS
        # 5. Replace "Inherits synarc core..." with nothing
        $content = $content -replace '(?m)Inherits synarc core \([^)]+\)\.?\s*', ''
        $content = $content -replace '(?m)Inherits synarc core[^.]*\.\s*', ''
        $content = $content -replace '(?m)All synarc prohibitions apply\.?\s*', ''
        
        # 6. Add universal note after the title line
        $titleMatch = [regex]::Match($content, '(?m)^# .+\r?\n')
        if ($titleMatch.Success) {
            $titleEnd = $titleMatch.Index + $titleMatch.Length
            $note = "`nUniversalized from Claude plugin. Compatible with all major AI coding agents.`nDependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.`n"
            $content = $content.Substring(0, $titleEnd) + $note + $content.Substring($titleEnd)
        }
        
        # Write converted SKILL.md
        $content | Set-Content -LiteralPath $targetSkill -NoNewline -Encoding UTF8 -ErrorAction Stop
        
        # Extract description from frontmatter
        $description = ""
        $fmMatch = [regex]::Match($content, '(?s)^---\r?\n(.+?)\r?\n---')
        if ($fmMatch.Success) {
            $fm = $fmMatch.Groups[1].Value
            $descMatch = [regex]::Match($fm, '(?m)^description: >\s*\r?\n(.+?)(?=\r?\n\S|\Z)')
            if (-not $descMatch.Success) {
                $descMatch = [regex]::Match($fm, '(?m)^description:\s*(.+)')
            }
            if ($descMatch.Success) {
                $description = $descMatch.Groups[1].Value.Trim()
            }
        }
        
        # Get version
        $verMatch = [regex]::Match($content, '(?m)^version:\s*(\S+)')
        $version = "1.0.0"
        if ($verMatch.Success) { $version = $verMatch.Groups[1].Value }
        
        # Write skill.yaml
        $skillYaml = @"
id: ${pluginName}
version: ${version}
schema: skill-pack/v1
category: engineering-intelligence
description: >
  ${description}

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

activation:
  type: intent-based
  description: Activates when user requests domain-specific engineering guidance

dependencies:
  synarc-core: ">=5.0.0"

integrity:
  algorithm: sha256
  hash: PENDING_VALIDATION
  signed: false
"@
        $skillYaml | Set-Content -LiteralPath (Join-Path $targetDir "skill.yaml") -Encoding UTF8
        
        # Copy shared guardrails
        Copy-Item -LiteralPath $sharedGuardrails -Destination (Join-Path $targetDir "guardrails.yaml") -Force
        
        # Create CHANGELOG.md
        $changelog = @"
---
title: ${pluginName} Changelog
---

# Changelog — ${pluginName}

## ${version} — 2026-06-02

### Universalized Release

- Converted from Claude plugin format to universal SKILL.md format
- Removed Claude-specific frontmatter fields
- Added shared workflow dependencies
- Added constitutional guardrails
- All content preserved, only platform-specific references modified
"@
        $changelog | Set-Content -LiteralPath (Join-Path $targetDir "CHANGELOG.md") -Encoding UTF8
        
        $converted++
        Write-Host "  OK"
    }
    catch {
        $errList += "${pluginName}: $($_.Exception.Message)"
        Write-Host "  ERROR: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "=== Conversion Complete ==="
Write-Host "Converted: ${converted} of ${totalPlugins}"
if ($errList.Count -gt 0) {
    Write-Host ""
    Write-Host "Errors:"
    foreach ($e in $errList) {
        Write-Host "  - ${e}"
    }
}
