<#
.SYNOPSIS
  Verify every markdown reference link in SKILL.md resolves to an existing file.

.DESCRIPTION
  For each skills/*/SKILL.md, extracts every Markdown link `[text](target)`.
  Skips http(s):// and #-anchors. Resolves each remaining relative path:
    * If the path starts with `shared/`, resolves against the pack root.
    * Otherwise, resolves against the skill's own directory.

  Reports broken references per skill. Exits 1 if any are broken.

.PARAMETER SkillsDir
  Path to skills/ directory (default: ../skills).

.PARAMETER PackRoot
  Path to pack root (default: ..).

.EXAMPLE
  .\check-refs.ps1
#>

[CmdletBinding()]
param(
    [string]$SkillsDir = "",
    [string]$PackRoot = ""
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $PSCommandPath
if (-not $SkillsDir) { $SkillsDir = Resolve-Path (Join-Path $scriptDir "..\skills") }
if (-not $PackRoot)  { $PackRoot  = Resolve-Path (Join-Path $scriptDir "..") }

if (-not (Test-Path -LiteralPath $SkillsDir)) {
    Write-Error "Skills directory not found: $SkillsDir"
    exit 1
}

$dirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Sort-Object Name
$totalBroken = 0
$report = @()

foreach ($dir in $dirs) {
    $skillMd = Join-Path $dir.FullName 'SKILL.md'
    if (-not (Test-Path $skillMd)) { continue }

    $content = Get-Content $skillMd -Raw
    $body = ([regex]::Match($content, '(?s)^---\r?\n.*?\r?\n---\r?\n?(.*)$')).Groups[1].Value
    $refs = [regex]::Matches($body, '\[([^\]]+)\]\(([^)]+)\)')
    $broken = @()
    foreach ($r in $refs) {
        $link = $r.Groups[2].Value.Trim()
        if ($link -match '^(https?://|#|mailto:)') { continue }
        $rp = if ($link -match '^shared/') { Join-Path $PackRoot $link } else { Join-Path $dir.FullName $link }
        if (-not (Test-Path -LiteralPath $rp)) { $broken += $link }
    }
    $report += [pscustomobject]@{
        Skill = $dir.Name
        Refs  = $refs.Count
        Broken = ($broken -join ', ')
    }
    $totalBroken += $broken.Count
}

Write-Host ""
Write-Host "================ Reference Resolution Check ================" -ForegroundColor Cyan
foreach ($r in $report) {
    if ($r.Broken) {
        Write-Host ("  [FAIL] {0,-26} {1} refs, broken: {2}" -f $r.Skill, $r.Refs, $r.Broken) -ForegroundColor Red
    } else {
        Write-Host ("  [PASS] {0,-26} {1} refs" -f $r.Skill, $r.Refs) -ForegroundColor Green
    }
}
Write-Host ""
Write-Host ("Total broken: $totalBroken") -ForegroundColor $(if ($totalBroken -gt 0) { 'Red' } else { 'Green' })
Write-Host "===========================================================" -ForegroundColor Cyan

if ($totalBroken -gt 0) { exit 1 }
exit 0
