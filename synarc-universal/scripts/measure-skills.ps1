<#
.SYNOPSIS
  Measure every SKILL.md: size, token estimate, cache-tier breakdown.

.DESCRIPTION
  Walks skills/*/SKILL.md, computes:
    * file size in KB and bytes
    * estimated tokens (chars/4 approximation; configurable)
    * line count
    * cache_tier (from frontmatter)
    * intent_triggers count
    * whether body meets the 8-block template
    * whether companion skill.yaml exists
    * whether references/ subdir exists and its size
    * SHA-256 of SKILL.md

  Emits a per-skill table, a tier-by-tier summary, and a pack-level summary
  with totals, means, percentiles, and the 50 KB / 30 KB cap checks.

.PARAMETER SkillsDir
  Path to skills/ directory (default: ../skills relative to script).

.PARAMETER PackRoot
  Path to pack root (default: .. relative to script).

.PARAMETER TokensPerChar
  Token estimate divisor (default: 4 — heuristic for English prose).

.PARAMETER Json
  Emit machine-readable JSON output in addition to the human table.

.EXAMPLE
  .\measure-skills.ps1

.EXAMPLE
  .\measure-skills.ps1 -Json
#>

[CmdletBinding()]
param(
    [string]$SkillsDir = "",
    [string]$PackRoot = "",
    [double]$TokensPerChar = 4.0,
    [switch]$Json
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $PSCommandPath
if (-not $SkillsDir) { $SkillsDir = Resolve-Path (Join-Path $scriptDir "..\skills") }
if (-not $PackRoot)  { $PackRoot  = Resolve-Path (Join-Path $scriptDir "..") }

$HARD_SIZE_KB = 50
$WARN_SIZE_KB = 30
$MANDATORY_SECTIONS = @('## Output format','## Gotchas','## References')

# ---------- helpers ----------

function Get-Frontmatter {
    param([string]$Path)
    $content = Get-Content -LiteralPath $Path -Raw -ErrorAction Stop
    $m = [regex]::Match($content, '(?s)^---\r?\n(.*?)\r?\n---')
    if (-not $m.Success) { return @{} }
    $fm = $m.Groups[1].Value
    $data = @{}
    $currentKey = $null; $currentList = @(); $currentScalar = $null; $mode = $null
    foreach ($line in ($fm -split '\r?\n')) {
        if ($mode -in @('folded','literal') -and $line -notmatch '^\s') {
            $data[$currentKey] = ($currentScalar -join "`n").Trim()
            $currentKey = $null; $currentScalar = $null; $mode = $null
        }
        if ($mode -eq 'list') {
            if ($line -match '^\s+-\s+(.*)') { $currentList += $Matches[1].Trim(); continue }
            elseif ($line -match '^\S') { $data[$currentKey] = $currentList; $currentKey = $null; $currentList = @(); $mode = $null }
            else { continue }
        }
        if ($line -match '^([A-Za-z_][\w-]*):\s*(.*)$') {
            $key = $Matches[1]; $val = $Matches[2]
            if ($val -eq '>')       { $currentKey = $key; $currentScalar = @(); $mode = 'folded' }
            elseif ($val -eq '|')   { $currentKey = $key; $currentScalar = @(); $mode = 'literal' }
            elseif ($val -eq '')    { $currentKey = $key; $currentList  = @(); $mode = 'list' }
            else                    { $data[$key] = $val.Trim() }
        } elseif ($mode -in @('folded','literal') -and $line -match '^\s+(.*)$') {
            $currentScalar += $Matches[1]
        }
    }
    if ($mode -in @('folded','literal') -and $currentKey) { $data[$currentKey] = ($currentScalar -join "`n").Trim() }
    elseif ($mode -eq 'list' -and $currentKey)             { $data[$currentKey] = $currentList }
    return $data
}

function Get-Body {
    param([string]$Path)
    $content = Get-Content -LiteralPath $Path -Raw -ErrorAction Stop
    $m = [regex]::Match($content, '(?s)^---\r?\n.*?\r?\n---\r?\n?(.*)$')
    if (-not $m.Success) { return '' }
    return $m.Groups[1].Value
}

function Get-Sha256 {
    param([string]$Path)
    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $h = [System.Security.Cryptography.SHA256]::Create()
    $hb = $h.ComputeHash($bytes)
    return ([System.BitConverter]::ToString($hb) -replace '-','').ToLower()
}

function Get-DirSizeKb {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return 0.0 }
    $total = (Get-ChildItem -LiteralPath $Path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    if ($null -eq $total) { $total = 0 }
    return [math]::Round($total / 1KB, 1)
}

# ---------- main ----------

$dirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Sort-Object Name
$measurements = @()
$totalBytes = 0L
$totalTokens = 0L

foreach ($dir in $dirs) {
    $skillMd = Join-Path $dir.FullName 'SKILL.md'
    $skillYaml = Join-Path $dir.FullName 'skill.yaml'
    $refsDir = Join-Path $dir.FullName 'references'

    $size = if (Test-Path $skillMd) { (Get-Item $skillMd).Length } else { 0 }
    $sizeKb = [math]::Round($size / 1KB, 1)
    $lines = if (Test-Path $skillMd) { (Get-Content $skillMd).Count } else { 0 }
    $tokens = [int][math]::Ceiling($size / $TokensPerChar)
    $fm = Get-Frontmatter -Path $skillMd
    $body = Get-Body -Path $skillMd

    $cacheTier = if ($fm.ContainsKey('cache_tier')) { $fm['cache_tier'] } else { 'unset' }
    $priority = if ($fm.ContainsKey('priority')) { $fm['priority'] } else { 'unset' }

    $intentCount = 0
    if ($fm.ContainsKey('intent_triggers')) {
        $raw = $fm['intent_triggers']
        $intentCount = if ($raw -match '^\[') {
            ($raw.Trim('[]') -split ',' | ForEach-Object { $_.Trim().Trim('"').Trim("'") } | Where-Object { $_ }).Count
        } else {
            ($raw -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }).Count
        }
    }

    $hasYaml = Test-Path $skillYaml
    $refsKb = Get-DirSizeKb -Path $refsDir
    $refsCount = if (Test-Path $refsDir) { (Get-ChildItem $refsDir -Filter '*.md' -ErrorAction SilentlyContinue).Count } else { 0 }
    $missingSections = @()
    foreach ($s in $MANDATORY_SECTIONS) { if ($body -notmatch [regex]::Escape($s)) { $missingSections += $s } }

    $hash = Get-Sha256 -Path $skillMd
    $capStatus = if ($sizeKb -gt $HARD_SIZE_KB) { 'OVER' } elseif ($sizeKb -gt $WARN_SIZE_KB) { 'WARN' } else { 'OK' }

    $totalBytes += $size
    $totalTokens += $tokens

    $measurements += [pscustomobject]@{
        id            = $dir.Name
        size_bytes    = $size
        size_kb       = $sizeKb
        tokens        = $tokens
        lines         = $lines
        cache_tier    = $cacheTier
        priority      = $priority
        intent_count  = $intentCount
        has_yaml      = $hasYaml
        refs_kb       = $refsKb
        refs_count    = $refsCount
        missing_sects = ($missingSections -join ',')
        cap_status    = $capStatus
        sha256        = $hash
    }
}

# ---------- output ----------

Write-Host ""
Write-Host "================ Skill Pack Measurement ================" -ForegroundColor Cyan
Write-Host ("Total skills : {0}" -f $measurements.Count)
Write-Host ("Pack size    : {0:N1} KB ({1:N0} bytes)" -f ($totalBytes / 1KB), $totalBytes)
Write-Host ("Pack tokens  : {0:N0} (chars/{1} heuristic)" -f $totalTokens, $TokensPerChar)

# Per-skill table
Write-Host ""
Write-Host "--- Per-skill ---" -ForegroundColor Yellow
$fmt = "{0,-26} {1,8} {2,7} {3,5} {4,-8} {5,-8} {6,3} {7,3} {8,-4} {9,-64}"
Write-Host ($fmt -f 'Skill','KB','Tokens','Lines','Tier','Priority','IR','RC','Cap','SHA-256 (short)')
Write-Host ("-" * 140)
foreach ($m in $measurements) {
    $short = $m.sha256.Substring(0, [Math]::Min(12, $m.sha256.Length))
    $color = switch ($m.cap_status) { 'OVER' { 'Red' } 'WARN' { 'Yellow' } default { 'Gray' } }
    Write-Host ($fmt -f $m.id, $m.size_kb, $m.tokens, $m.lines, $m.cache_tier, $m.priority, $m.intent_count, $m.refs_count, $m.cap_status, $short) -ForegroundColor $color
}

# Tier summary
Write-Host ""
Write-Host "--- By cache tier ---" -ForegroundColor Yellow
$tierGroups = $measurements | Group-Object cache_tier | Sort-Object Name
foreach ($g in $tierGroups) {
    $sum = ($g.Group | Measure-Object -Property size_bytes -Sum).Sum
    $sumKb = [math]::Round($sum / 1KB, 1)
    $count = $g.Count
    $avg = if ($count -gt 0) { [math]::Round($sumKb / $count, 1) } else { 0 }
    Write-Host ("  {0,-10} : {1,3} skills, {2,8:N1} KB total, {3,6:N1} KB avg" -f $g.Name, $count, $sumKb, $avg)
}

# Distribution
Write-Host ""
Write-Host "--- Size distribution ---" -ForegroundColor Yellow
$buckets = @{
    '<= 5 KB'   = ($measurements | Where-Object { $_.size_kb -le 5 }).Count
    '5-10 KB'   = ($measurements | Where-Object { $_.size_kb -gt 5  -and $_.size_kb -le 10 }).Count
    '10-15 KB'  = ($measurements | Where-Object { $_.size_kb -gt 10 -and $_.size_kb -le 15 }).Count
    '15-20 KB'  = ($measurements | Where-Object { $_.size_kb -gt 15 -and $_.size_kb -le 20 }).Count
    '20-30 KB'  = ($measurements | Where-Object { $_.size_kb -gt 20 -and $_.size_kb -le 30 }).Count
    '> 30 KB (WARN cap)' = ($measurements | Where-Object { $_.size_kb -gt 30 -and $_.size_kb -le 50 }).Count
    '> 50 KB (HARD cap)' = ($measurements | Where-Object { $_.size_kb -gt 50 }).Count
}
foreach ($k in @('<= 5 KB','5-10 KB','10-15 KB','15-20 KB','20-30 KB','> 30 KB (WARN cap)','> 50 KB (HARD cap)')) {
    $c = $buckets[$k]
    $bar = "#" * [Math]::Min(60, $c)
    Write-Host ("  {0,-22} {1,3} {2}" -f $k, $c, $bar)
}

# Stats
$mean = if ($measurements.Count -gt 0) { [math]::Round(($totalBytes / 1KB) / $measurements.Count, 1) } else { 0 }
$sizes = $measurements | ForEach-Object { $_.size_kb } | Sort-Object
$p50 = if ($sizes.Count -gt 0) { $sizes[[int][math]::Floor($sizes.Count * 0.5)] } else { 0 }
$p90 = if ($sizes.Count -gt 0) { $sizes[[int][math]::Floor($sizes.Count * 0.9)] } else { 0 }
$minSize = ($measurements | Measure-Object -Property size_kb -Minimum).Minimum
$maxSize = ($measurements | Measure-Object -Property size_kb -Maximum).Maximum

Write-Host ""
Write-Host "--- Stats ---" -ForegroundColor Yellow
Write-Host ("  Min   : {0,6:N1} KB" -f $minSize)
Write-Host ("  p50   : {0,6:N1} KB" -f $p50)
Write-Host ("  p90   : {0,6:N1} KB" -f $p90)
Write-Host ("  Max   : {0,6:N1} KB" -f $maxSize)
Write-Host ("  Mean  : {0,6:N1} KB" -f $mean)

# Cap violations
$hardViolations = $measurements | Where-Object { $_.size_kb -gt $HARD_SIZE_KB }
$warnViolations = $measurements | Where-Object { $_.size_kb -gt $WARN_SIZE_KB -and $_.size_kb -le $HARD_SIZE_KB }

Write-Host ""
Write-Host "--- Cap enforcement ---" -ForegroundColor Yellow
$hardMsg = if ($hardViolations.Count -eq 0) { 'PASS - 0 violations' } else { "FAIL - $($hardViolations.Count) violation(s): $($hardViolations.id -join ', ')" }
$warnMsg = if ($warnViolations.Count -eq 0) { 'PASS - 0 violations' } else { "WARN - $($warnViolations.Count) over recommended: $($warnViolations.id -join ', ')" }
Write-Host ("  Hard cap ({0} KB): {1}" -f $HARD_SIZE_KB, $hardMsg)
Write-Host ("  Warn cap ({0} KB): {1}" -f $WARN_SIZE_KB, $warnMsg)

# Missing sections
$missingAny = $measurements | Where-Object { $_.missing_sects }
if ($missingAny.Count -gt 0) {
    Write-Host ""
    Write-Host "--- Missing 8-block template sections ---" -ForegroundColor Yellow
    foreach ($m in $missingAny) {
        Write-Host ("  {0,-26} : {1}" -f $m.id, $m.missing_sects)
    }
}

# v5.x baseline comparison
Write-Host ""
Write-Host "--- v5.x -> v6.0.0 comparison ---" -ForegroundColor Yellow
Write-Host "  v5.x total (per release notes) : 15,670 KB (15.67 MB)"
Write-Host ("  v6.0.0 total                   : {0:N1} KB" -f ($totalBytes / 1KB))
$reduction = [math]::Round(15670 / ($totalBytes / 1KB), 1)
Write-Host ("  Reduction                      : {0}x" -f $reduction)
$hardPct = if ($hardViolations.Count -eq 0) { '100%' } else { 'FAIL' }
$warnPct = if ($warnViolations.Count -eq 0) { '100%' } else { "$((($measurements.Count - $warnViolations.Count) / $measurements.Count) * 100)% ($($warnViolations.Count) over)" }
Write-Host "  Hard-cap compliance            : $hardPct"
Write-Host "  Warn-cap compliance (<= 30 KB) : $warnPct"

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan

# JSON output
if ($Json) {
    $json = @{
        pack = @{
            skill_count = $measurements.Count
            total_bytes = $totalBytes
            total_kb    = [math]::Round($totalBytes / 1KB, 1)
            total_tokens = $totalTokens
            mean_kb     = $mean
            min_kb      = $minSize
            max_kb      = $maxSize
            p50_kb      = $p50
            p90_kb      = $p90
            hard_cap_kb = $HARD_SIZE_KB
            warn_cap_kb = $WARN_SIZE_KB
            hard_cap_violations = $hardViolations.Count
            warn_cap_violations = $warnViolations.Count
        }
        by_tier = @{}
        skills  = @()
    }
    foreach ($g in $tierGroups) {
        $sum = ($g.Group | Measure-Object -Property size_bytes -Sum).Sum
        $json.by_tier[$g.Name] = @{
            count = $g.Count
            total_kb = [math]::Round($sum / 1KB, 1)
            avg_kb   = if ($g.Count -gt 0) { [math]::Round(($sum / 1KB) / $g.Count, 1) } else { 0 }
        }
    }
    foreach ($m in $measurements) {
        $json.skills += @{
            id            = $m.id
            size_bytes    = $m.size_bytes
            size_kb       = $m.size_kb
            tokens        = $m.tokens
            lines         = $m.lines
            cache_tier    = $m.cache_tier
            priority      = $m.priority
            intent_count  = $m.intent_count
            has_yaml      = $m.has_yaml
            refs_kb       = $m.refs_kb
            refs_count    = $m.refs_count
            missing_sects = $m.missing_sects
            cap_status    = $m.cap_status
            sha256        = $m.sha256
        }
    }
    Write-Host ""
    Write-Host "--- JSON ---"
    $json | ConvertTo-Json -Depth 8
}

if ($hardViolations.Count -gt 0) { exit 1 }
exit 0
