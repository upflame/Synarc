<#
.SYNOPSIS
  Auto-generate manifest.yaml from skills directory.

.DESCRIPTION
  Scans all skills subdirectories, reads each skill.yaml, computes SHA-256
  hash of each SKILL.md, and generates a complete manifest.yaml with skill
  listings and integrity hashes.

.PARAMETER SkillsDir
  Path to the skills directory (default: ../skills relative to script).

.PARAMETER OutputFile
  Path to write the generated manifest (default: ../manifest.yaml).

.PARAMETER PackRoot
  Path to the skill pack root (default: .. relative to script).

.EXAMPLE
  .\generate-manifest.ps1

.EXAMPLE
  .\generate-manifest.ps1 -SkillsDir "C:\skills" -OutputFile "C:\manifest.yaml"
#>

param(
    [string]$SkillsDir = "",
    [string]$OutputFile = "",
    [string]$PackRoot = ""
)

$scriptPath = Split-Path -Parent $PSCommandPath

if (-not $SkillsDir) { $SkillsDir = Resolve-Path (Join-Path $scriptPath "..\skills") }
if (-not $OutputFile) { $OutputFile = Resolve-Path (Join-Path $scriptPath "..\manifest.yaml") }
if (-not $PackRoot) { $PackRoot = Resolve-Path (Join-Path $scriptPath "..") }

$scriptName = "generate-manifest.ps1"

function Write-Help {
    Write-Host @"
$scriptName - Auto-generate manifest.yaml from skills directory

USAGE:
    .\$scriptName [[-SkillsDir] <string>] [[-OutputFile] <string>] [[-PackRoot] <string>]

PARAMETERS:
    -SkillsDir   Path to skills/ directory (default: ../skills)
    -OutputFile  Path for generated manifest.yaml (default: ../manifest.yaml)
    -PackRoot    Path to skill pack root (default: ../)

DESCRIPTION:
    Scans all skill directories, reads skill.yaml for metadata, computes
    SHA-256 hashes of each SKILL.md, and generates a complete manifest.yaml
    with full skill listing and integrity section.

EXAMPLES:
    .\$scriptName
    .\$scriptName -OutputFile "C:\output\manifest.yaml"
"@
}

foreach ($arg in $MyInvocation.UnboundArguments) {
    if ($arg -eq "-?" -or $arg -eq "/?" -or $arg -eq "-h" -or $arg -eq "-Help") {
        Write-Help
        exit 0
    }
}

if (-not (Test-Path -LiteralPath $SkillsDir)) {
    Write-Error "Skills directory not found: $SkillsDir"
    exit 1
}

# Also read pack-level AGENTS.md for metadata
$agentsFile = Join-Path $PackRoot "AGENTS.md"
$packName = "Synarc Universal - Engineering Intelligence Runtime"
$packVersion = "5.0.0"
$packDescription = "Autonomous engineering cognition for architecture reasoning, change propagation analysis, deployment risk intelligence, and cross-platform code-state awareness across all modern AI coding environments."
$packAuthor = "Universal Skill Pack"

if (Test-Path -LiteralPath $agentsFile) {
    try {
        $agentsContent = Get-Content -LiteralPath $agentsFile -Raw -ErrorAction Stop
        $fmMatch = [regex]::Match($agentsContent, '(?s)^---\r?\n(.+?)\r?\n---')
        if ($fmMatch.Success) {
            $fm = $fmMatch.Groups[1].Value
            $titleMatch = [regex]::Match($fm, '(?m)^title:\s*(.+)')
            if ($titleMatch.Success) { $packName = $titleMatch.Groups[1].Value.Trim() }
            $verMatch = [regex]::Match($fm, '(?m)^version:\s*(\S+)')
            if ($verMatch.Success) { $packVersion = $verMatch.Groups[1].Value.Trim() }
            $descMatch = [regex]::Match($fm, '(?m)^description:\s*(.+)')
            if ($descMatch.Success) { $packDescription = $descMatch.Groups[1].Value.Trim() -replace '^>\s*', '' }
        }
    } catch {
        Write-Warning "Could not parse AGENTS.md metadata, using defaults"
    }
}

$knownAgents = @('codex', 'opencode', 'cursor', 'gemini-cli', 'claude-code', 'copilot', 'windsurf', 'cline', 'roo-code')
$allCategories = @('engineering-intelligence', 'architecture', 'development', 'security', 'devops', 'data', 'mobile', 'ml', 'leadership')
$allTags = @('engineering-intelligence', 'autonomous-cognition', 'architecture-analysis', 'change-intelligence', 'deployment-safety', 'risk-management', 'quality-gates', 'session-tracking', 'cross-platform')

$skillDirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Sort-Object -Property Name
$total = $skillDirs.Count

if ($total -eq 0) {
    Write-Error "No skill directories found in $SkillsDir"
    exit 1
}

Write-Host "Scanning $total skill directories..."

$manifestSkills = @()
$combinedHash = [System.Text.StringBuilder]::new()

foreach ($dir in $skillDirs) {
    $skillName = $dir.Name
    $skillMdPath = Join-Path $dir.FullName "SKILL.md"
    $skillYamlPath = Join-Path $dir.FullName "skill.yaml"

    Write-Host "  Processing: $skillName"

    if (-not (Test-Path -LiteralPath $skillMdPath)) {
        Write-Warning "  SKILL.md not found for $skillName , skipping"
        continue
    }

    # Compute SHA-256 hash of SKILL.md
    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($skillMdPath)
        $sha256 = [System.Security.Cryptography.SHA256]::Create()
        $hashBytes = $sha256.ComputeHash($fileBytes)
        $hashString = [System.BitConverter]::ToString($hashBytes).Replace('-', '').ToLower()
        $combinedHash.Append($hashString) | Out-Null
    } catch {
        Write-Warning "  Failed to hash SKILL.md for ${skillName}: $($_.Exception.Message)"
        $hashString = "ERROR"
    }

    # Read skill.yaml for metadata
    $skillData = @{}
    if (Test-Path -LiteralPath $skillYamlPath) {
        try {
            $yamlContent = Get-Content -LiteralPath $skillYamlPath -Raw -ErrorAction Stop
            $fmMatch = [regex]::Match($yamlContent, '(?s)^(.*)')
            $currentKey = ""
            $currentList = @()
            $inList = $false
            foreach ($line in ($yamlContent -split '\r?\n')) {
                if ($line -match '^(\S[\w-]*):\s*(.*)') {
                    if ($inList) { $skillData[$currentKey] = $currentList; $currentList = @(); $inList = $false }
                    $currentKey = $Matches[1]
                    $val = $Matches[2].Trim()
                    if ($val -eq '') { $inList = $true; $currentList = @() }
                    elseif ($val -eq '>') { $skillData[$currentKey] = @() }
                    elseif ($val -eq '|') { $skillData[$currentKey] = @() }
                    else { $skillData[$currentKey] = $val }
                } elseif ($inList -and $line -match '^\s+-\s+(.*)') {
                    $currentList += $Matches[1].Trim()
                } elseif ($inList -and $line -match '^\S') {
                    $skillData[$currentKey] = $currentList; $currentList = @(); $inList = $false
                }
            }
            if ($inList) { $skillData[$currentKey] = $currentList }
        } catch {
            Write-Warning "  Could not parse skill.yaml for $skillName"
        }
    }

    $id = if ($skillData.ContainsKey('id')) { $skillData['id'] } else { $skillName }

    # Determine version from skill.yaml or SKILL.md frontmatter
    $version = "1.0.0"
    if ($skillData.ContainsKey('version')) { $version = $skillData['version'] }
    else {
        try {
            $mdContent = Get-Content -LiteralPath $skillMdPath -Raw -ErrorAction SilentlyContinue
            if ($mdContent) {
                $vm = [regex]::Match($mdContent, '(?m)^version:\s*(\S+)')
                if ($vm.Success) { $version = $vm.Groups[1].Value.Trim() }
            }
        } catch {}
    }

    $description = ""
    if ($skillData.ContainsKey('description')) {
        $desc = $skillData['description']
        if ($desc -is [array]) { $description = ($desc -join ' ').Trim() }
        else { $description = $desc.Trim() }
    }

    $category = if ($skillData.ContainsKey('category')) { $skillData['category'] } else { "engineering-intelligence" }

    $tags = @()
    if ($skillData.ContainsKey('tags') -and $skillData['tags'] -is [array]) { $tags = $skillData['tags'] }

    $activation = "intent-based"
    if ($skillData.ContainsKey('activation')) {
        $act = $skillData['activation']
        if ($act -is [hashtable] -or $act -is [PSObject]) {
            $activation = if ($act.ContainsKey('type')) { $act['type'] } else { "intent-based" }
        } elseif ($act -is [string]) { $activation = $act }
    }

    $priority = "normal"
    if ($skillData.ContainsKey('priority')) { $priority = $skillData['priority'] }

    $dependencies = @{}
    if ($skillData.ContainsKey('dependencies')) {
        $dep = $skillData['dependencies']
        if ($dep -is [hashtable] -or $dep -is [PSObject]) { $dependencies = $dep }
    }

    $skillEntry = @"
  - id: $id
    path: skills/$id/SKILL.md
    version: $version
    description: $description
    category: $category
    tags: [$($tags -join ', ')]
    activation: $activation
    priority: $priority
    dependencies: {}
"@
    $manifestSkills += $skillEntry
}

# Compute combined integrity hash
$integrityHash = ""
if ($combinedHash.Length -gt 0) {
    $combinedBytes = [System.Text.Encoding]::UTF8.GetBytes($combinedHash.ToString())
    $sha256 = [System.Security.Cryptography.SHA256]::Create()
    $finalHashBytes = $sha256.ComputeHash($combinedBytes)
    $integrityHash = [System.BitConverter]::ToString($finalHashBytes).Replace('-', '').ToLower()
}

# Generate manifest.yaml
$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")

$manifestContent = @"
# Synarc Universal Skill Pack Manifest
# Schema: skill-pack/v1
# Generated: $(Get-Date -Format "yyyy-MM-dd")
# Integrity: SHA-256

pack:
  id: synarc-universal
  name: $packName
  description: >
    $packDescription
  version: $packVersion
  schema: skill-pack/v1
  author: $packAuthor

  compatible_agents:
$($knownAgents | ForEach-Object { "    - $_" }) -join "`r`n"

  tags:
$($allTags | ForEach-Object { "    - $_" }) -join "`r`n"

  categories:
$($allCategories | ForEach-Object { "    - $_" }) -join "`r`n"

skills:
$($manifestSkills -join "`r`n")

integrity:
  algorithm: sha256
  hash: $integrityHash
  signed: false
  timestamp: "$timestamp"
"@

try {
    $manifestContent | Set-Content -LiteralPath $OutputFile -Encoding UTF8 -ErrorAction Stop
    Write-Host ""
    Write-Host "Manifest written to: $OutputFile"
    Write-Host "Skills listed: $($manifestSkills.Count)"
    Write-Host "Integrity hash: $integrityHash"
    Write-Host "Done."
} catch {
    Write-Error "Failed to write manifest: $($_.Exception.Message)"
    exit 1
}

exit 0
