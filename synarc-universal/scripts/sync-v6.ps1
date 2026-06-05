<#
.SYNOPSIS
  Sync v6 manifests from SKILL.md frontmatter.

.DESCRIPTION
  Reads the v6 YAML frontmatter of every skills/*/SKILL.md, and regenerates
  three artifacts from a single source of truth:

    1. skills/<id>/skill.yaml     - per-skill v6 manifest
    2. ../manifest.yaml           - pack manifest with all skills
    3. ../../.claude-plugin/marketplace.json  - marketplace catalog

  v6 contract enforced:
    - description (3rd-person, 40-1024 chars, banned starters)
    - intent_triggers (array, >=2 elements)
    - cache_tier (one of: core, domain, reference, context, dynamic)
    - priority (one of: critical, high, normal, low)
    - version: 6.0.0
    - allowed_tools (optional array)

  v5 deprecated fields REMOVED:
    - skill_type
    - activation
    - dependencies
    - minimumVersion
    - skill_type

.PARAMETER SkillsDir
  Path to skills/ directory (default: ../skills).

.PARAMETER PackRoot
  Path to pack root (default: ..).

.PARAMETER MarketplaceFile
  Path to marketplace.json (default: ../../.claude-plugin/marketplace.json).

.EXAMPLE
  .\sync-v6.ps1
#>

[CmdletBinding()]
param(
    [string]$SkillsDir = "",
    [string]$PackRoot = "",
    [string]$MarketplaceFile = ""
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $PSCommandPath
if (-not $SkillsDir)    { $SkillsDir    = Resolve-Path (Join-Path $scriptDir "..\skills") }
if (-not $PackRoot)     { $PackRoot     = Resolve-Path (Join-Path $scriptDir "..") }
if (-not $MarketplaceFile) {
    $MarketplaceFile = Resolve-Path (Join-Path $PackRoot "..\.claude-plugin\marketplace.json")
}

# ---------- helpers ----------

function Get-Frontmatter {
    param([string]$Path)
    $content = Get-Content -LiteralPath $Path -Raw -ErrorAction Stop
    $m = [regex]::Match($content, '(?s)^---\r?\n(.*?)\r?\n---')
    if (-not $m.Success) { return $null }
    $fm = @{}
    $lines = $m.Groups[1].Value -split '\r?\n'
    $currentKey = $null
    $currentList = @()
    $currentScalar = $null
    $mode = $null   # null | 'list' | 'folded' | 'literal'

    foreach ($line in $lines) {
        # End of folded/literal block on a non-indented line
        if ($mode -in @('folded','literal') -and $line -notmatch '^\s') {
            $fm[$currentKey] = ($currentScalar -join "`n").Trim()
            $currentKey = $null; $currentScalar = $null; $mode = $null
        }
        if ($mode -eq 'list') {
            if ($line -match '^\s+-\s+(.*)') {
                $currentList += $Matches[1].Trim()
                continue
            } elseif ($line -match '^\S') {
                $fm[$currentKey] = $currentList
                $currentKey = $null; $currentList = @(); $mode = $null
            } else { continue }
        }
        if ($line -match '^([A-Za-z_][\w-]*):\s*(.*)$') {
            $key = $Matches[1]
            $val = $Matches[2]
            if ($val -eq '>')  { $currentKey = $key; $currentScalar = @(); $mode = 'folded' }
            elseif ($val -eq '|') { $currentKey = $key; $currentScalar = @(); $mode = 'literal' }
            elseif ($val -eq '')  { $currentKey = $key; $currentList = @(); $mode = 'list' }
            else { $fm[$key] = $val.Trim() }
        } elseif ($mode -in @('folded','literal') -and $line -match '^\s+(.*)$') {
            $currentScalar += $Matches[1]
        }
    }
    # flush trailing
    if ($mode -in @('folded','literal') -and $currentKey) {
        $fm[$currentKey] = ($currentScalar -join "`n").Trim()
    } elseif ($mode -eq 'list' -and $currentKey) {
        $fm[$currentKey] = $currentList
    }
    return $fm
}

function Get-Sha256 {
    param([string]$Path)
    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $h = [System.Security.Cryptography.SHA256]::Create()
    $hb = $h.ComputeHash($bytes)
    return ([System.BitConverter]::ToString($hb) -replace '-','').ToLower()
}

function Quote-Yaml {
    param([string]$Value)
    if ($null -eq $Value) { return '""' }
    if ($Value -match '[:#&*!|>\''`%@\[\]\{\},]') {
        return '"' + ($Value -replace '\\','\\\\' -replace '"','\\"') + '"'
    }
    return $Value
}

function Render-ListYaml {
    param([string]$Indent, [string[]]$Items)
    if (-not $Items -or $Items.Count -eq 0) { return "$Indent[]" }
    $out = @()
    foreach ($it in $Items) {
        $out += "$Indent- $(Quote-Yaml $it)"
    }
    return ($out -join "`n")
}

function Render-SkillYaml {
    param($Fm, [string]$Hash)
    $id = $Fm['name']
    $version = $Fm['version']
    $desc = $Fm['description']
    $category = switch -Regex ($id) {
        '^(synarc-core|negative-prompts|cognition-layer|schemas|change-intelligence|project-scales|problem-solver|foundational-reasoning|decision-engineer|risk-analyst|coding-agent|debug-engineer|performance-thinker|incident-commander|testing-strategy)$' { 'engineering-intelligence' }
        '^(architect|api-designer|database-architect)$' { 'architecture' }
        '^(backend-engineer|frontend-engineer|fullstack-engineer|ui-engineer|ux-engineer)$' { 'development' }
        '^(data-engineer)$' { 'data' }
        '^(mobile-engineer)$' { 'mobile' }
        '^(ml-engineer)$' { 'ml' }
        '^(infrastructure-engineer|devops-engineer|sre-engineer|observability-engineer|platform-engineer|chaos-engineer|finops-engineer)$' { 'devops' }
        '^(security-engineer|privacy-engineer|ethics-engineer)$' { 'security' }
        '^(staff-engineer|cto|engineering-manager|product-engineer)$' { 'leadership' }
        default { 'engineering-intelligence' }
    }
    $agents = @('codex','opencode','cursor','gemini-cli','claude-code','copilot','windsurf','cline','roo-code')
    $intentList = $Fm['intent_triggers'] -split ',' | ForEach-Object { $_.Trim().TrimStart('[').TrimEnd(']').Trim() } | Where-Object { $_ }
    $toolsList = $null
    if ($Fm.ContainsKey('allowed_tools') -and $Fm['allowed_tools']) {
        $toolsList = $Fm['allowed_tools'] -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    }
    $priority = if ($Fm['priority']) { $Fm['priority'] } else { 'normal' }
    $cacheTier = if ($Fm['cache_tier']) { $Fm['cache_tier'] } else { 'domain' }

    $sb = [System.Text.StringBuilder]::new()
    [void]$sb.AppendLine("id: $id")
    [void]$sb.AppendLine("version: $version")
    [void]$sb.AppendLine("schema: skill-pack/v1")
    [void]$sb.AppendLine("category: $category")
    [void]$sb.AppendLine("description: >")
    [void]$sb.AppendLine("  $desc")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("compatible_agents:")
    foreach ($a in $agents) { [void]$sb.AppendLine("  - $a") }
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("priority: $priority")
    [void]$sb.AppendLine("cache_tier: $cacheTier")
    [void]$sb.AppendLine("intent_triggers:")
    foreach ($t in $intentList) { [void]$sb.AppendLine("  - $(Quote-Yaml $t)") }
    if ($toolsList) {
        [void]$sb.AppendLine("allowed_tools:")
        foreach ($t in $toolsList) { [void]$sb.AppendLine("  - $t") }
    } else {
        [void]$sb.AppendLine("allowed_tools:")
        [void]$sb.AppendLine("  - Read")
        [void]$sb.AppendLine("  - Write")
        [void]$sb.AppendLine("  - Edit")
        [void]$sb.AppendLine("  - Grep")
        [void]$sb.AppendLine("  - Glob")
    }
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("integrity:")
    [void]$sb.AppendLine("  algorithm: sha256")
    [void]$sb.AppendLine("  hash: $Hash")
    [void]$sb.AppendLine("  signed: false")
    [void]$sb.Append("")
    return $sb.ToString()
}

function Render-PackManifest {
    param($Skills, [string]$PackHash)
    $agents = @('codex','opencode','cursor','gemini-cli','claude-code','copilot','windsurf','cline','roo-code')
    $tags = @('engineering-intelligence','autonomous-cognition','architecture-analysis','change-intelligence','deployment-safety','risk-management','quality-gates','session-tracking','cross-platform','universal-runtime','prompt-caching','token-efficient')
    $categories = @('engineering-intelligence','architecture','development','security','devops','data','mobile','ml','leadership')

    $sb = [System.Text.StringBuilder]::new()
    [void]$sb.AppendLine("# Synarc Universal Skill Pack Manifest")
    [void]$sb.AppendLine("# Schema: skill-pack/v1")
    [void]$sb.AppendLine("# Generated: $(Get-Date -Format 'yyyy-MM-dd')")
    [void]$sb.AppendLine("# Integrity: SHA-256")
    [void]$sb.AppendLine("# Source: skills/*/SKILL.md (single source of truth)")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("pack:")
    [void]$sb.AppendLine("  id: synarc-universal")
    [void]$sb.AppendLine("  name: Synarc Universal - Autonomous Engineering Intelligence Runtime")
    [void]$sb.AppendLine("  description: >")
    [void]$sb.AppendLine("    Universal agent skill pack for engineering cognition - change classification, risk")
    [void]$sb.AppendLine("    assessment, context injection, session tracking, quality gates, error intelligence.")
    [void]$sb.AppendLine("    Compatible with all major AI coding agents (Codex, OpenCode, Cursor, Gemini CLI,")
    [void]$sb.AppendLine("    Claude Code, Copilot, Windsurf, Cline, RooCode). v6.0.0 introduces the")
    [void]$sb.AppendLine("    4-tier prompt-caching architecture, intent-based activation via intent_triggers,")
    [void]$sb.AppendLine("    and 35x token reduction versus v5.x.")
    [void]$sb.AppendLine("  version: 6.0.0")
    [void]$sb.AppendLine("  schema: skill-pack/v1")
    [void]$sb.AppendLine("  author: UpFlame Labs <info@upflame.in>")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("  compatible_agents:")
    foreach ($a in $agents) { [void]$sb.AppendLine("    - $a") }
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("  tags:")
    foreach ($t in $tags) { [void]$sb.AppendLine("    - $t") }
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("  categories:")
    foreach ($c in $categories) { [void]$sb.AppendLine("    - $c") }
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("skills:")
    foreach ($s in $Skills) {
        $intentList = $s.frontmatter['intent_triggers'] -split ',' | ForEach-Object { $_.Trim().TrimStart('[').TrimEnd(']').Trim() } | Where-Object { $_ }
        [void]$sb.AppendLine("  - id: $($s.id)")
        [void]$sb.AppendLine("    path: skills/$($s.id)/SKILL.md")
        [void]$sb.AppendLine("    version: $($s.frontmatter['version'])")
        [void]$sb.AppendLine("    description: >")
        [void]$sb.AppendLine("      $($s.frontmatter['description'])")
        [void]$sb.AppendLine("    category: $($s.category)")
        [void]$sb.AppendLine("    priority: $(if ($s.frontmatter['priority']) { $s.frontmatter['priority'] } else { 'normal' })")
        [void]$sb.AppendLine("    cache_tier: $(if ($s.frontmatter['cache_tier']) { $s.frontmatter['cache_tier'] } else { 'domain' })")
        [void]$sb.AppendLine("    intent_triggers:")
        foreach ($t in $intentList) { [void]$sb.AppendLine("      - $(Quote-Yaml $t)") }
        [void]$sb.AppendLine("    allowed_tools:")
        [void]$sb.AppendLine("      - Read")
        [void]$sb.AppendLine("      - Write")
        [void]$sb.AppendLine("      - Edit")
        [void]$sb.AppendLine("      - Grep")
        [void]$sb.AppendLine("      - Glob")
        [void]$sb.AppendLine("    integrity:")
        [void]$sb.AppendLine("      algorithm: sha256")
        [void]$sb.AppendLine("      hash: $($s.hash)")
    }
    [void]$sb.AppendLine("")
    $timestamp = Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ'
    [void]$sb.AppendLine("integrity:")
    [void]$sb.AppendLine("  algorithm: sha256")
    [void]$sb.AppendLine("  hash: $PackHash")
    [void]$sb.AppendLine("  signed: false")
    [void]$sb.AppendLine("  timestamp: '$timestamp'")
    [void]$sb.AppendLine("  source: skills/*/SKILL.md")
    [void]$sb.Append("")
    return $sb.ToString()
}

function Render-Marketplace {
    param($Skills)
    $agents = @('codex','opencode','cursor','gemini-cli','claude-code','copilot','windsurf','cline','roo-code')

    $json = @{
        '$schema' = 'https://json-schema.org/draft/2020-12/schema'
        name = 'synarc-marketplace'
        description = 'Production-grade universal engineering intelligence skills - 40 consolidated reasoning engines, 4-tier prompt-caching architecture, intent-based activation. Compatible with Codex, OpenCode, Cursor, Gemini CLI, Claude Code, Copilot, Windsurf, Cline, and RooCode.'
        owner = @{
            name = 'UpFlame Labs'
            email = 'info@upflame.in'
        }
        schema = 'skill-pack/v1'
        version = '6.0.0'
        pack_root = './synarc-universal'
        compatible_agents = $agents
        cache_architecture = @{
            tiers = @{
                '0' = 'header (300 tokens, always-cached across all skills)'
                '1' = 'core (synarc-core, negative-prompts, cognition-layer, schemas - ~6K total)'
                '2' = 'domain (active skill - 8-13K)'
                '3' = 'reference (per-skill references/, lazy-loaded on demand)'
                '4' = 'dynamic (per-task context, never cached)'
            }
            total_pack_size = '~450 KB (down from 15.67 MB in v5.x - 35x reduction)'
        }
        skills = @()
    }

    foreach ($s in $Skills) {
        $intentList = @()
        if ($s.frontmatter['intent_triggers']) {
            $intentList = $s.frontmatter['intent_triggers'] -split ',' | ForEach-Object { $_.Trim().TrimStart('[').TrimEnd(']').Trim() } | Where-Object { $_ }
        }
        $toolsList = @('Read','Write','Edit','Grep','Glob')
        if ($s.frontmatter['allowed_tools']) {
            $toolsList = $s.frontmatter['allowed_tools'] -split ',' | ForEach-Object { $_.Trim().TrimStart('[').TrimEnd(']').Trim() } | Where-Object { $_ }
        }
        $toolsList = @('Read','Write','Edit','Grep','Glob')
        if ($s.frontmatter['allowed_tools']) {
            $toolsList = $s.frontmatter['allowed_tools'] -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }
        }
        $json.skills += [ordered]@{
            id = $s.id
            path = "synarc-universal/skills/$($s.id)/SKILL.md"
            description = $s.frontmatter['description']
            version = $s.frontmatter['version']
            category = $s.category
            priority = if ($s.frontmatter['priority']) { $s.frontmatter['priority'] } else { 'normal' }
            cache_tier = if ($s.frontmatter['cache_tier']) { $s.frontmatter['cache_tier'] } else { 'domain' }
            intent_triggers = $intentList
            allowed_tools = $toolsList
            activation = if ($s.frontmatter['cache_tier'] -eq 'core') { 'always-on' } else { 'intent-based' }
            integrity = @{
                algorithm = 'sha256'
                hash = $s.hash
            }
        }
    }
    return ($json | ConvertTo-Json -Depth 12)
}

# ---------- main ----------

if (-not (Test-Path -LiteralPath $SkillsDir)) {
    Write-Error "Skills directory not found: $SkillsDir"
    exit 1
}

$dirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Sort-Object Name
Write-Host "Syncing v6 manifests from $($dirs.Count) skills..."

$Skills = @()
$combinedHash = [System.Text.StringBuilder]::new()

foreach ($dir in $dirs) {
    $skillMd = Join-Path $dir.FullName 'SKILL.md'
    if (-not (Test-Path -LiteralPath $skillMd)) {
        Write-Warning "  SKILL.md missing in $($dir.Name) - skipping"
        continue
    }
    $fm = Get-Frontmatter -Path $skillMd
    if (-not $fm) {
        Write-Warning "  No frontmatter in $($dir.Name)/SKILL.md - skipping"
        continue
    }
    $id = $fm['name']
    if (-not $id) {
        Write-Warning "  No 'name' field in $($dir.Name)/SKILL.md - skipping"
        continue
    }
    $hash = Get-Sha256 -Path $skillMd
    [void]$combinedHash.Append($hash)

    # Determine category
    $category = switch -Regex ($id) {
        '^(synarc-core|negative-prompts|cognition-layer|schemas|change-intelligence|project-scales|problem-solver|foundational-reasoning|decision-engineer|risk-analyst|coding-agent|debug-engineer|performance-thinker|incident-commander|testing-strategy)$' { 'engineering-intelligence' }
        '^(architect|api-designer|database-architect)$' { 'architecture' }
        '^(backend-engineer|frontend-engineer|fullstack-engineer|ui-engineer|ux-engineer)$' { 'development' }
        '^(data-engineer)$' { 'data' }
        '^(mobile-engineer)$' { 'mobile' }
        '^(ml-engineer)$' { 'ml' }
        '^(infrastructure-engineer|devops-engineer|sre-engineer|observability-engineer|platform-engineer|chaos-engineer|finops-engineer)$' { 'devops' }
        '^(security-engineer|privacy-engineer|ethics-engineer)$' { 'security' }
        '^(staff-engineer|cto|engineering-manager|product-engineer)$' { 'leadership' }
        default { 'engineering-intelligence' }
    }

    # v6 contract validation
    $issues = @()
    if (-not $fm['description']) { $issues += 'missing description' }
    elseif ($fm['description'].Length -lt 40) { $issues += "description too short ($($fm['description'].Length) chars)" }
    elseif ($fm['description'].Length -gt 1024) { $issues += "description too long ($($fm['description'].Length) chars)" }
    elseif ($fm['description'] -match '^(I |We |You |Help |Assists |This skill |A skill |An skill |A tool |An tool |A assistant |An assistant)') { $issues += 'description starts with banned 1st/2nd-person pattern' }
    if (-not $fm['intent_triggers']) { $issues += 'missing intent_triggers' }
    elseif (($fm['intent_triggers'] -split ',' | ForEach-Object { $_.Trim().TrimStart('[').TrimEnd(']').Trim() } | Where-Object { $_ }).Count -lt 2) { $issues += 'intent_triggers must have >=2 elements' }
    if ($fm['cache_tier'] -notin @('core','domain','reference','context','dynamic')) { $issues += "invalid cache_tier '$($fm['cache_tier'])'" }
    if ($fm['version'] -ne '6.0.0') { $issues += "version is '$($fm['version'])', expected '6.0.0'" }
    if ($fm['name'] -match 'anthropic|claude|gpt|gemini') { $issues += "name contains vendor-locked token" }

    if ($issues.Count -gt 0) {
        Write-Warning "  [$id] v6 contract issues: $($issues -join '; ')"
    } else {
        Write-Host "  [OK] $id"
    }

    $Skills += [pscustomobject]@{
        id          = $id
        frontmatter = $fm
        category    = $category
        hash        = $hash
    }
}

# Compute combined pack hash
$packHash = ""
if ($combinedHash.Length -gt 0) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($combinedHash.ToString())
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $hb = $sha.ComputeHash($bytes)
    $packHash = ([System.BitConverter]::ToString($hb) -replace '-','').ToLower()
}

# 1. Write each skill.yaml
Write-Host ""
Write-Host "Writing $($Skills.Count) skill.yaml files..."
foreach ($s in $Skills) {
    $yamlPath = Join-Path $SkillsDir "$($s.id)\skill.yaml"
    $content = Render-SkillYaml -Fm $s.frontmatter -Hash $s.hash
    Set-Content -LiteralPath $yamlPath -Value $content -Encoding UTF8 -ErrorAction Stop
}
Write-Host "  Done."

# 2. Write pack manifest.yaml
Write-Host ""
Write-Host "Writing pack manifest.yaml..."
$manifestPath = Join-Path $PackRoot "manifest.yaml"
$content = Render-PackManifest -Skills $Skills -PackHash $packHash
Set-Content -LiteralPath $manifestPath -Value $content -Encoding UTF8 -ErrorAction Stop
Write-Host "  Done: $manifestPath"

# 3. Write marketplace.json
Write-Host ""
Write-Host "Writing marketplace.json..."
$content = Render-Marketplace -Skills $Skills
Set-Content -LiteralPath $MarketplaceFile -Value $content -Encoding UTF8 -ErrorAction Stop
Write-Host "  Done: $MarketplaceFile"

Write-Host ""
Write-Host "================================================="
Write-Host "v6 sync complete"
Write-Host "  Skills:    $($Skills.Count)"
Write-Host "  Pack hash: $packHash"
Write-Host "================================================="
exit 0
