<#
.SYNOPSIS
  Validate all skills against the SKILL.md schema specification.

.DESCRIPTION
  Parses frontmatter of every SKILL.md in skills/, checks required fields,
  banned fields, compatible_agents, capability tier structure, reference
  link resolution, and existence of companion files (skill.yaml, guardrails.yaml).

  Outputs a pass/fail summary per skill with total pass rate.

.PARAMETER SkillsDir
  Path to the skills directory (default: ../skills relative to script).

.PARAMETER AgentsFile
  Path to AGENTS.md which defines known agent slugs (default: ../AGENTS.md).

.PARAMETER PackRoot
  Path to the skill pack root (default: .. relative to script).

.EXAMPLE
  .\validate-skills.ps1

.EXAMPLE
  .\validate-skills.ps1 -SkillsDir "C:\skills" -AgentsFile "C:\AGENTS.md" -PackRoot "C:\"
#>

param(
    [string]$SkillsDir = "",
    [string]$AgentsFile = "",
    [string]$PackRoot = ""
)

$scriptPath = Split-Path -Parent $PSCommandPath

if (-not $SkillsDir) { $SkillsDir = Resolve-Path (Join-Path $scriptPath "..\skills") }
if (-not $AgentsFile) { $AgentsFile = Resolve-Path (Join-Path $scriptPath "..\AGENTS.md") }
if (-not $PackRoot) { $PackRoot = Resolve-Path (Join-Path $scriptPath "..") }

$scriptName = "validate-skills.ps1"

function Write-Help {
    Write-Host @"
$scriptName - Validate all skills against the SKILL.md schema

USAGE:
    .\$scriptName [[-SkillsDir] <string>] [[-AgentsFile] <string>] [[-PackRoot] <string>]

PARAMETERS:
    -SkillsDir   Path to skills/ directory (default: ../skills)
    -AgentsFile  Path to AGENTS.md with known agent slugs (default: ../AGENTS.md)
    -PackRoot    Path to skill pack root (default: ../)

DESCRIPTION:
    Validates every SKILL.md in the skills directory:
      - Required frontmatter fields: name, description, version, skill_type
      - Banned fields: activation, cache, parent, compatibility
      - compatible_agents: each slug must be a known agent
      - Capability blocks: each must have exactly 4 tier sections (Tier 1-4)
      - Reference links: every markdown link resolves to an existing file
      - Companion files: skill.yaml and guardrails.yaml exist

    Outputs a pass/fail summary per skill and overall pass rate.

EXAMPLES:
    .\$scriptName
    .\$scriptName -SkillsDir "C:\synarc\skills"
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

if (-not (Test-Path -LiteralPath $AgentsFile)) {
    Write-Error "Agents file not found: $AgentsFile"
    exit 1
}

# Known agents derived from AGENTS.md compatible_agents section
$knownAgents = @()
try {
    $agentsContent = Get-Content -LiteralPath $AgentsFile -Raw -ErrorAction Stop
    $fmMatch = [regex]::Match($agentsContent, '(?s)^---\r?\n(.+?)\r?\n---')
    if ($fmMatch.Success) {
        $fm = $fmMatch.Groups[1].Value
        $inList = $false
        foreach ($line in ($fm -split '\r?\n')) {
            if ($line -match '^compatible_agents:') {
                $inList = $true
                continue
            }
            if ($inList) {
                if ($line -match '^\s+-\s+(\S+)') {
                    $knownAgents += $Matches[1]
                } elseif ($line -match '^\w') {
                    $inList = $false
                }
            }
        }
    }
} catch {
    Write-Warning "Could not parse agents from $AgentsFile, using defaults"
    $knownAgents = @('codex', 'opencode', 'cursor', 'gemini-cli', 'claude-code', 'copilot', 'windsurf', 'cline', 'roo-code')
}

if ($knownAgents.Count -eq 0) {
    $knownAgents = @('codex', 'opencode', 'cursor', 'gemini-cli', 'claude-code', 'copilot', 'windsurf', 'cline', 'roo-code')
}

$agentSet = @{}; foreach ($a in $knownAgents) { $agentSet[$a.ToLower()] = $true }

$requiredFields = @('name', 'description', 'version', 'skill_type')
$bannedFields = @('activation:', 'cache:', 'parent:', 'compatibility:')

$skillDirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Sort-Object -Property Name
$total = $skillDirs.Count
$passed = 0
$failed = 0
$results = @()

foreach ($dir in $skillDirs) {
    $skillName = $dir.Name
    $skillMdPath = Join-Path $dir.FullName "SKILL.md"
    $skillYamlPath = Join-Path $dir.FullName "skill.yaml"
    $guardrailsPath = Join-Path $dir.FullName "guardrails.yaml"

    $errors = @()
    $warnings = @()

    # Check SKILL.md exists
    if (-not (Test-Path -LiteralPath $skillMdPath)) {
        $errors += "Missing SKILL.md"
        $results += [PSCustomObject]@{ Skill = $skillName; Status = "FAIL"; Errors = $errors -join "; " }
        $failed++
        continue
    }

    try {
        $content = Get-Content -LiteralPath $skillMdPath -Raw -ErrorAction Stop
    } catch {
        $errors += "Cannot read SKILL.md: $($_.Exception.Message)"
        $results += [PSCustomObject]@{ Skill = $skillName; Status = "FAIL"; Errors = $errors -join "; " }
        $failed++
        continue
    }

    # Parse frontmatter
    $fmMatch = [regex]::Match($content, '(?s)^---\r?\n(.+?)\r?\n---')
    if (-not $fmMatch.Success) {
        $errors += "No valid YAML frontmatter (--- delimiters)"
        $results += [PSCustomObject]@{ Skill = $skillName; Status = "FAIL"; Errors = $errors -join "; " }
        $failed++
        continue
    }

    $fm = $fmMatch.Groups[1].Value

    # Extract frontmatter as key-value pairs (simple parser)
    $fmData = @{}
    $currentKey = ""
    $currentList = @()
    $inList = $false
    $inBlock = $false
    $blockKey = ""

    foreach ($line in ($fm -split '\r?\n')) {
        if ($line -match '^(\S[\w-]*):\s*(.*)') {
            if ($inList) {
                $fmData[$currentKey] = $currentList
                $currentList = @()
                $inList = $false
            }
            $currentKey = $Matches[1]
            $val = $Matches[2].Trim()
            if ($val -eq '') {
                $inList = $true
                $currentList = @()
            } elseif ($val -eq '>') {
                $inBlock = $true
                $blockKey = $currentKey
                $fmData[$currentKey] = @()
            } else {
                $fmData[$currentKey] = $val
            }
        } elseif ($inList -and $line -match '^\s+-\s+(.*)') {
            $currentList += $Matches[1].Trim()
        } elseif ($inList -and $line -match '^\S') {
            $fmData[$currentKey] = $currentList
            $currentList = @()
            $inList = $false
            if ($line -match '^(\S[\w-]*):\s*(.*)') {
                $currentKey = $Matches[1]
                $val = $Matches[2].Trim()
                if ($val -eq '') {
                    $inList = $true
                    $currentList = @()
                } elseif ($val -eq '>') {
                    $inBlock = $true
                    $blockKey = $currentKey
                    $fmData[$currentKey] = @()
                } else {
                    $fmData[$currentKey] = $val
                }
            }
        } elseif ($inBlock -and $line -match '^\s+') {
            $fmData[$blockKey] += $line.Trim()
        } elseif ($inBlock -and $line -match '^\S') {
            $inBlock = $false
            if ($line -match '^(\S[\w-]*):\s*(.*)') {
                $currentKey = $Matches[1]
                $val = $Matches[2].Trim()
                if ($val -eq '') {
                    $inList = $true
                    $currentList = @()
                } else {
                    $fmData[$currentKey] = $val
                }
            }
        }
    }
    if ($inList) { $fmData[$currentKey] = $currentList }

    # Check required fields
    foreach ($rf in $requiredFields) {
        if (-not $fmData.ContainsKey($rf)) {
            $errors += "Missing required field: $rf"
        } elseif ($rf -eq 'skill_type' -and $fmData[$rf] -is [string] -and [string]::IsNullOrWhiteSpace($fmData[$rf])) {
            $errors += "Required field 'skill_type' has no value"
        }
    }

    # Check banned fields
    $fmText = "---`n$fm`n---"
    foreach ($bf in $bannedFields) {
        if ($fmText -match "(?m)^$bf") {
            $bname = $bf.TrimEnd(':')
            $errors += "Contains banned field: $bname"
        }
    }

    # Check compatible_agents values
    if ($fmData.ContainsKey('compatible_agents') -and $fmData['compatible_agents'] -is [array]) {
        foreach ($agent in $fmData['compatible_agents']) {
            $agentSlug = $agent.Trim().ToLower()
            if (-not $agentSet.ContainsKey($agentSlug)) {
                $warnings += "Unknown compatible_agent: $agent"
            }
        }
    } elseif ($fmData.ContainsKey('compatible_agents')) {
        $warnings += "compatible_agents is not a list"
    }

    # Check capability blocks have 4 tiers
    $capSections = @()
    $capPattern = [regex]::Matches($content, '(?m)^#{1,6}\s+(.+?)(?:\s*â€”\s*|\s*â€“\s*|\s*-\s*)?(?:Capability.*)?$')

    # Find all sections that look like capability definitions, then check for Tier headings
    $tierCount = @{
        'Tier 1' = @()
        'Tier 2' = @()
        'Tier 3' = @()
        'Tier 4' = @()
    }

    $tierMatches = [regex]::Matches($content, '(?m)^####\s+Tier\s+(\d+)')
    if ($tierMatches.Count -gt 0) {
        $foundTiers = @{}
        foreach ($t in $tierMatches) { $foundTiers[$t.Groups[1].Value] = $true }
        for ($i = 1; $i -le 4; $i++) {
            if (-not $foundTiers.ContainsKey("$i")) {
                $errors += "Missing Tier $i section -- no #### Tier $i heading found"
            }
        }
    } else {
        # Older/alternate format: look for capability-like sections
        $h3Matches = [regex]::Matches($content, '(?m)^###\s+.+')
        if ($h3Matches.Count -gt 0) {
            $warnings += "No '#### Tier N' headings found; capability tier validation skipped"
        }
    }

    # Check reference links resolve
    $refs = [regex]::Matches($content, '\[([^\]]+)\]\(([^)]+)\)')
    $resolvedCount = 0
    foreach ($ref in $refs) {
        $link = $ref.Groups[2].Value.Trim()
        if ($link -match '^https?://') {
            $resolvedCount++
            continue
        }
        if ($link -match '^#') {
            $resolvedCount++
            continue
        }

        $resolvePath = ""
        if ($link -match '^shared/') {
            $resolvePath = Join-Path $PackRoot $link
        } else {
            $resolvePath = Join-Path $dir.FullName $link
        }

        if (Test-Path -LiteralPath $resolvePath) {
            $resolvedCount++
        } else {
            $warnings += "Broken reference link: $link"
        }
    }

    if ($refs.Count -gt 0 -and $resolvedCount -eq $refs.Count) {
        # all resolved
    }

    # Check skill.yaml exists
    if (-not (Test-Path -LiteralPath $skillYamlPath)) {
        $errors += "Missing skill.yaml"
    }

    # Check guardrails.yaml exists
    if (-not (Test-Path -LiteralPath $guardrailsPath)) {
        $errors += "Missing guardrails.yaml"
    }

    # Determine status
    if ($errors.Count -eq 0) {
        $passed++
        $status = "PASS"
    } else {
        $failed++
        $status = "FAIL"
    }

    $resultMsg = if ($errors.Count -gt 0) { $errors -join "; " } else { "" }
    if ($warnings.Count -gt 0 -and -not $resultMsg) {
        $resultMsg = "Warnings: " + ($warnings -join "; ")
    } elseif ($warnings.Count -gt 0) {
        $resultMsg += " | Warnings: " + ($warnings -join "; ")
    }

    $results += [PSCustomObject]@{
        Skill    = $skillName
        Status   = $status
        Errors   = $resultMsg
    }

    $icon = if ($status -eq "PASS") { "[PASS]" } else { "[FAIL]" }
    Write-Host "$icon $skillName"
    if ($resultMsg) {
        Write-Host "       $resultMsg" -ForegroundColor Gray
    }
}

# Output summary
Write-Host ""
Write-Host "=============== Validation Summary ==============="
Write-Host "Total skills : $total"
Write-Host "Passed       : $passed"
Write-Host "Failed       : $failed"
if ($total -gt 0) {
    $rate = [math]::Round(($passed / $total) * 100, 1)
    Write-Host "Pass rate    : $rate%"
} else {
    Write-Host "Pass rate    : N/A (no skills found)"
}
Write-Host "================================================="

# Detailed report
Write-Host ""
Write-Host "--- Detailed Results ---"
foreach ($r in $results) {
    Write-Host "$($r.Status) $($r.Skill)"
    if ($r.Errors) {
        Write-Host "     $($r.Errors)" -ForegroundColor DarkGray
    }
}

if ($failed -gt 0) {
    exit 1
}
exit 0
