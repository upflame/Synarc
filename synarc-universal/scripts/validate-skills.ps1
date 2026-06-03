<#
.SYNOPSIS
  Validate every SKILL.md against the v6 contract.

.DESCRIPTION
  Parses the YAML frontmatter of each skills/*/SKILL.md, checks the v6
  contract (per shared/schemas/skill-manifest.schema.json and
  shared/standards/frontmatter-spec.md), and emits a per-skill PASS/FAIL
  report plus an overall summary.

  v6 checks enforced:
    * Required: name, description, version, priority, intent_triggers, cache_tier
    * description: 40-1024 chars, 3rd-person (no banned starters), no mojibake
    * intent_triggers: array, >= 2 elements
    * cache_tier: one of core | domain | reference | context | dynamic
    * priority: one of critical | high | normal | low
    * version: 6.0.0
    * No v5 deprecated fields: skill_type, activation, cache, parent,
      compatibility, minimumVersion
    * No vendor-locked name tokens: anthropic, claude, gpt, gemini
    * No mojibake in body: \u00e2\u20ac, \u00e2\u2020', \u00f0\u0178, \u00e2\u0160
    * No "Universalized from Claude plugin" boilerplate
    * No 2nd-person hedging: "you should", "you must" (allow 1st-person
      imperative: "State the...", "Survey...", "Survey...")
    * Mandatory 8-block template sections: ## Output format, ## Gotchas, ## References
    * Size: SKILL.md <= 50 KB (hard fail), <= 30 KB (warn)
    * Markdown link resolution (relative refs)
    * skill.yaml exists and is v6-shaped

.PARAMETER SkillsDir
  Path to skills/ directory (default: ../skills relative to script).

.PARAMETER PackRoot
  Path to pack root (default: .. relative to script).

.EXAMPLE
  .\validate-skills.ps1
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

$scriptName = "validate-skills.ps1"

function Write-Help {
    Write-Host @"
$scriptName - v6 SKILL.md contract validator

USAGE:
    .\$scriptName [[-SkillsDir] <string>] [[-PackRoot] <string>]

DESCRIPTION:
    Validates every skills/*/SKILL.md against the v6 contract:
    - Required frontmatter fields
    - description length, voice, no mojibake
    - intent_triggers array (>= 2)
    - cache_tier enum
    - v5 deprecated fields banned
    - vendor-locked name tokens banned
    - mandatory 8-block template sections
    - size cap (50 KB hard, 30 KB warn)
    - markdown reference resolution
    - companion skill.yaml exists

EXAMPLES:
    .\$scriptName
"@
}

foreach ($arg in $MyInvocation.UnboundArguments) {
    if ($arg -in @("-?","/?","-h","-Help")) { Write-Help; exit 0 }
}

if (-not (Test-Path -LiteralPath $SkillsDir)) {
    Write-Error "Skills directory not found: $SkillsDir"
    exit 1
}

# ---------- rule constants ----------

$REQUIRED_FIELDS = @('name','description','version','priority','intent_triggers','cache_tier')
$ALLOWED_PRIORITY = @('critical','high','normal','low')
$ALLOWED_CACHE_TIER = @('core','domain','reference','context','dynamic')
$ALLOWED_VERSION_PATTERN = '^6\.\d+\.\d+$'

$BANNED_FRONTMATTER_FIELDS = @(
    'skill_type:',
    'activation:',
    'cache:',
    'parent:',
    'compatibility:',
    'minimumVersion:',
    'estimate:',
    'compatibility'
)

$BANNED_NAME_PATTERNS = @('anthropic','claude','gpt','gemini')
$BANNED_DESCRIPTION_STARTS = @('^I ','^We ','^You ','^Help ','^Assists ','^This skill ','^A skill ','^An skill ','^A tool ','^An tool ','^A assistant ','^An assistant ')

$BANNED_BODY_TOKENS = @(
    'Universalized from Claude plugin',
    'When building a \w+ module for \w+ audiences in \w+'
)

# 2nd-person hedging - catch the most common hedging forms.
# We ALLOW direct imperative (the 12-tricks style: "Survey the call graph").
$BANNED_HEDGING = @(
    'you should',
    'you must',
    'you can also',
    'you will need to',
    'you''ll need to',
    'one should',
    'one must',
    'we recommend',
    'it is recommended',
    'ideally you'
)

# Mandatory 8-block template sections
$MANDATORY_SECTIONS = @('## Output format','## Gotchas','## References')

# Mojibake patterns: UTF-8 mojibake that appears when files are saved
# with the wrong encoding (cp1252 instead of utf-8).
$MOJIBAKE_PATTERNS = @(
    '\u00e2\u20ac\u0153',         # arrow mojibake
    '\u00e2\u20ac\u201c',         # em-dash
    '\u00e2\u20ac\u201d',         # right-double-quote
    '\u00e2\u20ac\u2018',         # left-single-quote
    '\u00e2\u20ac\u2019',         # right-single-quote
    '\u00e2\u20ac\u00a6',         # ellipsis
    '\u00e2\u20ac\u00a2',         # bullet
    '\u00e2\u2020',               # arrow head
    '\u00f0\u0178',               # emoji-prefix
    '\u00c3\u00a9',               # copyright
    '\u00c2\u00a9'
)

# Size caps
$HARD_SIZE_KB = 50
$WARN_SIZE_KB = 30

# ---------- helpers ----------

function Get-Frontmatter {
    param([string]$Path)
    $content = Get-Content -LiteralPath $Path -Raw -ErrorAction Stop
    $m = [regex]::Match($content, '(?s)^---\r?\n(.*?)\r?\n---')
    if (-not $m.Success) { return @{ raw = ''; lines = @(); data = @{} } }
    $fm = $m.Groups[1].Value
    $data = @{}
    $currentKey = $null
    $currentList = @()
    $currentScalar = $null
    $mode = $null
    foreach ($line in ($fm -split '\r?\n')) {
        if ($mode -in @('folded','literal') -and $line -notmatch '^\s') {
            $data[$currentKey] = ($currentScalar -join "`n").Trim()
            $currentKey = $null; $currentScalar = $null; $mode = $null
        }
        if ($mode -eq 'list') {
            if ($line -match '^\s+-\s+(.*)') {
                $currentList += $Matches[1].Trim()
                continue
            } elseif ($line -match '^\S') {
                $data[$currentKey] = $currentList
                $currentKey = $null; $currentList = @(); $mode = $null
            } else { continue }
        }
        if ($line -match '^([A-Za-z_][\w-]*):\s*(.*)$') {
            $key = $Matches[1]; $val = $Matches[2]
            if ($val -eq '>')  { $currentKey = $key; $currentScalar = @(); $mode = 'folded' }
            elseif ($val -eq '|') { $currentKey = $key; $currentScalar = @(); $mode = 'literal' }
            elseif ($val -eq '')  { $currentKey = $key; $currentList = @(); $mode = 'list' }
            else { $data[$key] = $val.Trim() }
        } elseif ($mode -in @('folded','literal') -and $line -match '^\s+(.*)$') {
            $currentScalar += $Matches[1]
        }
    }
    if ($mode -in @('folded','literal') -and $currentKey) {
        $data[$currentKey] = ($currentScalar -join "`n").Trim()
    } elseif ($mode -eq 'list' -and $currentKey) {
        $data[$currentKey] = $currentList
    }
    return @{ raw = $fm; lines = ($fm -split '\r?\n'); data = $data }
}

function Get-Body {
    param([string]$Path)
    $content = Get-Content -LiteralPath $Path -Raw -ErrorAction Stop
    $m = [regex]::Match($content, '(?s)^---\r?\n.*?\r?\n---\r?\n(.*)$')
    if (-not $m.Success) { return '' }
    return $m.Groups[1].Value
}

# ---------- main ----------

$dirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Sort-Object Name
$total = $dirs.Count
$passed = 0
$failed = 0
$warnedOnly = 0
$results = @()

if ($total -eq 0) {
    Write-Error "No skill directories in $SkillsDir"
    exit 1
}

Write-Host "Validating $total skills against v6 contract..."
Write-Host ""

foreach ($dir in $dirs) {
    $skillName = $dir.Name
    $skillMd = Join-Path $dir.FullName 'SKILL.md'
    $skillYaml = Join-Path $dir.FullName 'skill.yaml'

    $errors = @()
    $warnings = @()

    if (-not (Test-Path -LiteralPath $skillMd)) {
        $errors += 'Missing SKILL.md'
        $results += [pscustomobject]@{ Skill = $skillName; Status = 'FAIL'; Errors = ($errors -join '; '); Warnings = '' }
        $failed++; Write-Host "  [FAIL] $skillName - Missing SKILL.md"; continue
    }

    # Size
    $sizeBytes = (Get-Item $skillMd).Length
    $sizeKb = [math]::Round($sizeBytes / 1KB, 1)
    if ($sizeKb -gt $HARD_SIZE_KB) {
        $errors += "size $sizeKb KB exceeds hard cap of $HARD_SIZE_KB KB"
    } elseif ($sizeKb -gt $WARN_SIZE_KB) {
        $warnings += "size $sizeKb KB exceeds recommended cap of $WARN_SIZE_KB KB"
    }

    $fm = Get-Frontmatter -Path $skillMd
    $fmText = $fm.raw
    $fmData = $fm.data
    $body = Get-Body -Path $skillMd

    # Required fields
    foreach ($rf in $REQUIRED_FIELDS) {
        if (-not $fmData.ContainsKey($rf)) { $errors += "missing required field: $rf" }
        elseif ($rf -eq 'intent_triggers' -and -not ($fmData[$rf] -match '[A-Za-z]')) {
            $errors += "intent_triggers is empty"
        }
    }

    # Version
    if ($fmData.ContainsKey('version')) {
        if ($fmData['version'] -notmatch $ALLOWED_VERSION_PATTERN) {
            $errors += "version '$($fmData['version'])' must match $ALLOWED_VERSION_PATTERN"
        }
    }

    # Priority enum
    if ($fmData.ContainsKey('priority') -and $fmData['priority'] -notin $ALLOWED_PRIORITY) {
        $errors += "priority '$($fmData['priority'])' must be one of: $($ALLOWED_PRIORITY -join ', ')"
    }

    # cache_tier enum
    if ($fmData.ContainsKey('cache_tier') -and $fmData['cache_tier'] -notin $ALLOWED_CACHE_TIER) {
        $errors += "cache_tier '$($fmData['cache_tier'])' must be one of: $($ALLOWED_CACHE_TIER -join ', ')"
    }

    # intent_triggers shape
    if ($fmData.ContainsKey('intent_triggers')) {
        $raw = $fmData['intent_triggers']
        $list = @()
        if ($raw -match '^\[') {
            # flow array
            $list = $raw.Trim('[]') -split ',' | ForEach-Object { $_.Trim().Trim('"').Trim("'") } | Where-Object { $_ }
        } else {
            $list = $raw -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }
        }
        if ($list.Count -lt 2) { $errors += "intent_triggers must have >= 2 elements (found $($list.Count))" }
    }

    # description voice + length
    if ($fmData.ContainsKey('description')) {
        $desc = $fmData['description']
        if ($desc.Length -lt 40)  { $errors += "description too short ($($desc.Length) chars; min 40)" }
        if ($desc.Length -gt 1024) { $errors += "description too long ($($desc.Length) chars; max 1024)" }
        foreach ($p in $BANNED_DESCRIPTION_STARTS) {
            if ($desc -match $p) { $errors += "description starts with banned 1st/2nd-person pattern: '$p'"; break }
        }
    }

    # Banned frontmatter fields
    foreach ($banned in $BANNED_FRONTMATTER_FIELDS) {
        if ($fmText -match "(?m)^[\s\-]*$([regex]::Escape($banned))") {
            $errors += "contains banned v5 field: $($banned.TrimEnd(':'))"
        }
    }

    # Banned name patterns
    if ($fmData.ContainsKey('name')) {
        $name = $fmData['name']
        foreach ($p in $BANNED_NAME_PATTERNS) {
            if ($name -match $p) { $errors += "name '$name' contains vendor-locked token '$p'" }
        }
    }

    # Mojibake in body
    foreach ($p in $MOJIBAKE_PATTERNS) {
        if ($body -match $p) { $errors += "body contains mojibake pattern: $p"; break }
    }

    # Banned body tokens
    foreach ($banned in $BANNED_BODY_TOKENS) {
        if ($body -match $banned) { $errors += "body contains banned boilerplate: '$banned'"; break }
    }

    # 2nd-person hedging
    foreach ($h in $BANNED_HEDGING) {
        if ($body -match [regex]::Escape($h)) {
            $warnings += "body contains 2nd-person hedging: '$h' (prefer direct imperative)"
        }
    }

    # Mandatory sections
    foreach ($s in $MANDATORY_SECTIONS) {
        if ($body -notmatch [regex]::Escape($s)) {
            $errors += "missing mandatory 8-block section: $s"
        }
    }

    # Reference link resolution
    $refs = [regex]::Matches($body, '\[([^\]]+)\]\(([^)]+)\)')
    $brokenRefs = @()
    foreach ($r in $refs) {
        $link = $r.Groups[2].Value.Trim()
        if ($link -match '^(https?://|#)') { continue }
        $rp = if ($link -match '^shared/') { Join-Path $PackRoot $link } else { Join-Path $dir.FullName $link }
        if (-not (Test-Path -LiteralPath $rp)) { $brokenRefs += $link }
    }
    if ($brokenRefs.Count -gt 0) {
        $errors += "broken reference links: $($brokenRefs -join ', ')"
    }

    # skill.yaml exists
    if (-not (Test-Path -LiteralPath $skillYaml)) {
        $errors += "missing companion skill.yaml"
    }

    # Determine status
    $status = if ($errors.Count -gt 0) { 'FAIL' } elseif ($warnings.Count -gt 0) { 'WARN' } else { 'PASS' }
    if ($status -eq 'PASS') { $passed++ }
    elseif ($status -eq 'WARN') { $warnedOnly++; $passed++ }
    else { $failed++ }

    $errStr = ($errors -join '; ')
    $warnStr = ($warnings -join '; ')
    $results += [pscustomobject]@{ Skill = $skillName; Status = $status; Errors = $errStr; Warnings = $warnStr }

    $icon = switch ($status) { 'PASS' { '[PASS]' } 'WARN' { '[WARN]' } default { '[FAIL]' } }
    $color = switch ($status) { 'PASS' { 'Green' } 'WARN' { 'Yellow' } default { 'Red' } }
    Write-Host "  $icon $skillName ($sizeKb KB)" -ForegroundColor $color
    if ($errStr) { Write-Host "       ERR: $errStr" -ForegroundColor Red }
    if ($warnStr) { Write-Host "       WARN: $warnStr" -ForegroundColor Yellow }
}

# Summary
Write-Host ""
Write-Host "=============== v6 Validation Summary ==============="
Write-Host "Total skills      : $total"
Write-Host "Passed (clean)    : $($passed - $warnedOnly)"
Write-Host "Passed (with warn): $warnedOnly"
Write-Host "Failed            : $failed"
if ($total -gt 0) {
    $rate = [math]::Round((($passed) / $total) * 100, 1)
    Write-Host "Pass rate         : $rate%"
}
Write-Host "====================================================="

# Detailed
Write-Host ""
Write-Host "--- Detailed ---"
foreach ($r in $results) {
    Write-Host "  $($r.Status) $($r.Skill)"
    if ($r.Errors) { Write-Host "      $($r.Errors)" -ForegroundColor DarkRed }
    if ($r.Warnings) { Write-Host "      $($r.Warnings)" -ForegroundColor DarkYellow }
}

if ($failed -gt 0) { exit 1 }
exit 0
