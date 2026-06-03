<#
.SYNOPSIS
  Scan all SKILL.md for vendor-locked tokens and patterns.

.DESCRIPTION
  Walks every skills/*/SKILL.md and reports:
    * Skill names containing vendor tokens (anthropic, claude, gpt, gemini, openai, etc.)
    * Body content referencing vendor-specific runtime concepts
      (cache_control: { type: ... }, /commands/..., <system-reminder> tags,
       anthropic-ai/sdk imports, claude/gpt/gemini version tags)
    * Banned v5.x fields still present (skill_type, activation, parent, etc.)

  Exits 1 if any violation is found.

.PARAMETER SkillsDir
  Path to skills/ directory (default: ../skills relative to script).

.EXAMPLE
  .\check-vendor-lockin.ps1
#>

[CmdletBinding()]
param(
    [string]$SkillsDir = "",
    [string[]]$Skip = @('negative-prompts')
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $PSCommandPath
if (-not $SkillsDir) { $SkillsDir = Resolve-Path (Join-Path $scriptDir "..\skills") }

$VENDOR_NAME_PATTERNS = @('anthropic','claude','gpt[ -]?[0-9]','gemini','openai','mistral','llama')

$VENDOR_BODY_PATTERNS = @(
    @{ Pattern = 'cache_control:\s*\{'; Description = 'Anthropic-specific cache control' },
    @{ Pattern = '<system-reminder>'; Description = 'Anthropic-specific system-reminder tag' },
    @{ Pattern = '@anthropic-ai/sdk'; Description = 'Anthropic SDK import' },
    @{ Pattern = 'apply_patch|MultiEdit|run_in_terminal|code_search'; Description = 'Anthropic-specific tool names' },
    @{ Pattern = '/commands/[a-z]'; Description = 'Anthropic-specific commands path' },
    @{ Pattern = '<!--\s*runtime:\s*claude'; Description = 'Anthropic-specific runtime hint' },
    @{ Pattern = 'claude-(opus|sonnet|haiku)|gpt-[0-9](\.[0-9])?|gemini-pro'; Description = 'Vendor-specific model names' }
)

$V5_DEPRECATED_FIELDS = @('skill_type', 'activation', 'cache', 'parent', 'compatibility', 'minimumVersion')

if (-not (Test-Path -LiteralPath $SkillsDir)) {
    Write-Error "Skills directory not found: $SkillsDir"
    exit 1
}

$dirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Sort-Object Name
$totalViolations = 0
$report = @()

foreach ($dir in $dirs) {
    $skillMd = Join-Path $dir.FullName 'SKILL.md'
    if (-not (Test-Path $skillMd)) { continue }
    if ($dir.Name -in $Skip) {
        $report += [pscustomobject]@{ Skill = $dir.Name; Violations = '' }
        continue
    }

    $content = Get-Content $skillMd -Raw
    $violations = @()

    # Frontmatter
    $fm = @{}
    $m = [regex]::Match($content, '(?s)^---\r?\n(.*?)\r?\n---')
    if ($m.Success) {
        foreach ($line in ($m.Groups[1].Value -split '\r?\n')) {
            if ($line -match '^([A-Za-z_][\w-]*):\s*(.*)$') {
                $fm[$Matches[1]] = $Matches[2]
            }
        }
    }

    # Vendor-locked name
    if ($fm.ContainsKey('name')) {
        foreach ($p in $VENDOR_NAME_PATTERNS) {
            if ($fm['name'] -match $p) { $violations += "name '$($fm['name'])' contains vendor token '$p'" }
        }
    }

    # v5 deprecated frontmatter fields
    foreach ($f in $V5_DEPRECATED_FIELDS) {
        if ($fm.ContainsKey($f)) { $violations += "contains deprecated v5 field: $f" }
    }

    # Vendor-locked body patterns
    foreach ($rule in $VENDOR_BODY_PATTERNS) {
        if ($content -match $rule.Pattern) {
            $violations += "body contains $($rule.Description) (pattern: $($rule.Pattern))"
        }
    }

    $report += [pscustomobject]@{
        Skill      = $dir.Name
        Violations = ($violations -join ' | ')
    }
    if ($violations.Count -gt 0) { $totalViolations += $violations.Count }
}

# Report
Write-Host ""
Write-Host "================ Vendor Lock-in Check ================" -ForegroundColor Cyan
foreach ($r in $report) {
    $icon = if ($r.Violations) { '[FAIL]' } else { '[PASS]' }
    $color = if ($r.Violations) { 'Red' } else { 'Green' }
    Write-Host ("  {0} {1}" -f $icon, $r.Skill) -ForegroundColor $color
    if ($r.Violations) { Write-Host ("       $($r.Violations)") -ForegroundColor DarkRed }
}
Write-Host ""
Write-Host ("Total violations: $totalViolations") -ForegroundColor $(if ($totalViolations -gt 0) { 'Red' } else { 'Green' })
Write-Host "======================================================" -ForegroundColor Cyan

if ($totalViolations -gt 0) { exit 1 }
exit 0
