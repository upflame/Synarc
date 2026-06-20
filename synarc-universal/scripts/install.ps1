<#
.SYNOPSIS
    Synarc Universal Installer — detects editor and installs skill files.
.DESCRIPTION
    Copies AGENTS.md, skills/, and platform-specific config files into the target project.
    Supports: Claude Code, Codex CLI, OpenCode, Cursor, Windsurf, Copilot, Gemini CLI, Cline.
#>

$SynarcRoot = Split-Path -Parent $PSScriptRoot
$TargetDir = Get-Location

Write-Host "Synarc Universal v6.5.0 — Installer" -ForegroundColor Cyan
Write-Host "Target: $TargetDir"
Write-Host ""

$detected = $false

# Detect Claude Code
if (Test-Path "$TargetDir\.claude") {
    Write-Host "Detected: Claude Code" -ForegroundColor Green
    $pluginDir = "$TargetDir\.claude-plugin"
    $null = New-Item -ItemType Directory -Path $pluginDir -Force
    Copy-Item "$SynarcRoot\..\.claude-plugin\plugin.json" "$pluginDir\plugin.json" -Force
    Write-Host "  ✓ .claude-plugin/plugin.json installed"
    $detected = $true
}

# AGENTS.md + skills/ (always installed as fallback)
if (-not (Test-Path "$TargetDir\AGENTS.md")) {
    Copy-Item "$SynarcRoot\AGENTS.md" "$TargetDir\AGENTS.md"
    Write-Host "  ✓ AGENTS.md installed"
} else {
    Write-Host "  ∼ AGENTS.md already exists, skipping"
}

if (-not (Test-Path "$TargetDir\skills")) {
    Copy-Item "$SynarcRoot\skills" "$TargetDir\skills" -Recurse
    Write-Host "  ✓ skills/ directory installed"
} else {
    Write-Host "  ∼ skills/ already exists, skipping"
}

# Detect Cursor
if (Test-Path "$TargetDir\.cursor") {
    Write-Host "Detected: Cursor" -ForegroundColor Green
    $cursorRulesDir = "$TargetDir\.cursor\rules"
    $null = New-Item -ItemType Directory -Path $cursorRulesDir -Force
    $cursorSrc = "$SynarcRoot\..\.cursor\rules\synarc-core.mdc"
    if (Test-Path $cursorSrc -and -not (Test-Path "$cursorRulesDir\synarc-core.mdc")) {
        Copy-Item $cursorSrc "$cursorRulesDir\synarc-core.mdc"
        Write-Host "  ✓ .cursor/rules/synarc-core.mdc installed"
    }
    $detected = $true
}

# Detect Windsurf
if (Test-Path "$TargetDir\.windsurfrules") {
    Write-Host "Detected: Windsurf" -ForegroundColor Green
    $windsurfSrc = "$SynarcRoot\shared\runtime-adapters\windsurf.md"
    if (Test-Path $windsurfSrc -and -not (Test-Path "$TargetDir\.windsurfrules")) {
        Copy-Item $windsurfSrc "$TargetDir\.windsurfrules"
        Write-Host "  ✓ .windsurfrules installed"
    }
    $detected = $true
}

# Detect Copilot
if (Test-Path "$TargetDir\.github") {
    Write-Host "Detected: GitHub Copilot" -ForegroundColor Green
    $copilotSrc = "$SynarcRoot\shared\runtime-adapters\copilot.md"
    $copilotTarget = "$TargetDir\.github\copilot-instructions.md"
    if (Test-Path $copilotSrc) {
        Add-Content -Path $copilotTarget -Value "`n$(Get-Content $copilotSrc -Raw)" -NoNewLine
        Write-Host "  ✓ Appended to .github/copilot-instructions.md"
    }
    $detected = $true
}

# Detect Gemini CLI
if (Test-Path "$TargetDir\GEMINI.md") {
    Write-Host "Detected: Gemini CLI" -ForegroundColor Green
    $geminiSrc = "$SynarcRoot\..\GEMINI.md"
    if (Test-Path $geminiSrc -and -not (Test-Path "$TargetDir\GEMINI.md")) {
        Copy-Item $geminiSrc "$TargetDir\GEMINI.md"
        Write-Host "  ✓ GEMINI.md installed"
    }
    $detected = $true
}

# Detect Cline
if (Test-Path "$TargetDir\.cline") {
    Write-Host "Detected: Cline" -ForegroundColor Green
    $clineSkillsDir = "$TargetDir\.cline\skills"
    $null = New-Item -ItemType Directory -Path $clineSkillsDir -Force
    Get-ChildItem "$SynarcRoot\skills" -Directory | ForEach-Object {
        $target = "$clineSkillsDir\$($_.Name)"
        if (-not (Test-Path $target)) {
            Copy-Item $_.FullName $target -Recurse
        }
    }
    Write-Host "  ✓ .cline/skills/ installed/synced"
    $detected = $true
}

if (-not $detected) {
    Write-Host "Installed AGENTS.md + skills/ as default (works with OpenCode, Codex CLI, and most editors)."
}

Write-Host ""
Write-Host "Synarc installed. Start a new session and ask an engineering question." -ForegroundColor Cyan
Write-Host "Full docs: synarc-universal/docs/installation.md"
