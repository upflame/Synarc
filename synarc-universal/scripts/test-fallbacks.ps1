<#
.SYNOPSIS
  Test that every capability has complete 4-tier fallback chains.

.DESCRIPTION
  Scans each SKILL.md for capability blocks and verifies that each block
  has all 4 tier sections (Tier 1 — Native Execution, Tier 2 — External
  Integration, Tier 3 — Manual Workflow, Tier 4 — Human-Assisted).

  Reports missing tiers per skill and total coverage statistics.

.PARAMETER SkillsDir
  Path to the skills directory (default: ../skills relative to script).

.PARAMETER Verbose
  Show detailed per-capability results.

.EXAMPLE
  .\test-fallbacks.ps1

.EXAMPLE
  .\test-fallbacks.ps1 -Verbose
#>

param(
    [string]$SkillsDir = "",
    [switch]$Verbose = $false
)

$scriptPath = Split-Path -LiteralPath $MyInvocation.MyCommand.Path -Parent

if (-not $SkillsDir) { $SkillsDir = Resolve-Path (Join-Path $scriptPath "..\skills") }

$scriptName = "test-fallbacks.ps1"

function Write-Help {
    Write-Host @"
$scriptName - Test that every capability has complete fallback chains

USAGE:
    .\$scriptName [[-SkillsDir] <string>] [-Verbose]

PARAMETERS:
    -SkillsDir   Path to skills/ directory (default: ../skills)
    -Verbose     Show detailed per-capability results

DESCRIPTION:
    Scans each SKILL.md for capability blocks and verifies each has
    all 4 tier sections (Tier 1-4). Reports missing tiers per skill
    and total coverage statistics.

EXAMPLES:
    .\$scriptName
    .\$scriptName -Verbose
    .\$scriptName -SkillsDir "C:\synarc\skills" -Verbose
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

$skillDirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Sort-Object -Property Name
$totalSkills = $skillDirs.Count

Write-Host "Testing fallback coverage across $totalSkills skills..."
Write-Host ""

$tierPatterns = @(
    @{ Number = 1; Names = @('Native Execution', 'Hard Gates', 'Automatic', 'Native') }
    @{ Number = 2; Names = @('External Integration', 'Standard Gates', 'Semi-Automatic', 'External') }
    @{ Number = 3; Names = @('Manual Workflow', 'Manual', 'Guided') }
    @{ Number = 4; Names = @('Human-Assisted', 'Human', 'Manual Escalation') }
)

function Test-Tier {
    param([string]$Content, [int]$TierNumber, [string[]]$TierNames)
    $lines = $Content -split '\r?\n'
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -match "^####\s+Tier\s+$TierNumber") {
            return $true
        }
        foreach ($tName in $TierNames) {
            if ($trimmed -match "^####\s+$tName") {
                return $true
            }
        }
    }
    return $false
}

function Get-CapabilityNames {
    param([string]$Content)
    $names = @()
    $lines = $Content -split '\r?\n'
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        # Match various capability heading patterns
        if ($trimmed -match '^###\s+(?:Capability:\s*)?(.+?)(?:\s*—\s*|\s*–\s*|\s*-\s*|\s*$)' -or
            $trimmed -match '^#{3,4}\s+(?:Capability:\s*)?(.+)') {
            $capName = $Matches[1].Trim()
            # Filter out non-capability sections
            if ($capName -notmatch '^(P\d|Table of Contents|Overview|Introduction|Notes)') {
                $names += $capName
            }
        }
    }
    return $names
}

$totalCapabilities = 0
$completeCapabilities = 0
$incompleteCapabilities = 0
$skillResults = @()

foreach ($dir in $skillDirs) {
    $skillName = $dir.Name
    $skillMdPath = Join-Path $dir.FullName "SKILL.md"

    if (-not (Test-Path -LiteralPath $skillMdPath)) {
        Write-Host "  [SKIP] $skillName — SKILL.md not found" -ForegroundColor DarkGray
        continue
    }

    try {
        $content = Get-Content -LiteralPath $skillMdPath -Raw -ErrorAction Stop
    } catch {
        Write-Host "  [ERR]  $skillName — Cannot read SKILL.md" -ForegroundColor Red
        continue
    }

    # Find all sections that could be capability blocks
    $capabilities = @()
    $lines = $content -split '\r?\n'
    $currentCap = $null
    $currentLines = @()
    $inCap = $false

    foreach ($line in $lines) {
        if ($line -match '^###\s+(.+?)(?:\s*—|\s*–|\s*-|\s*$)') {
            # Flush previous
            if ($inCap -and $currentCap) {
                $capabilities += [PSCustomObject]@{ Name = $currentCap; Content = $currentLines -join "`r`n" }
            }
            $capName = $Matches[1].Trim()
            # Heuristic: only treat ### sections that look like capabilities
            if ($capName -match '^(Capability|P\d|Cap)') {
                $currentCap = $capName
                $currentLines = @($line)
                $inCap = $true
            } elseif ($capName -match '^(Purpose|Activation|Required Inputs|Validation|Failure|Output|Quality|Security|Performance)') {
                if ($inCap -and $currentCap) {
                    $capabilities += [PSCustomObject]@{ Name = $currentCap; Content = $currentLines -join "`r`n" }
                }
                $inCap = $false
                $currentCap = $null
            } else {
                # Generic ### heading - might be a capability or a regular section
                # Treat as potential capability
                if ($inCap -and $currentCap) {
                    $capabilities += [PSCustomObject]@{ Name = $currentCap; Content = $currentLines -join "`r`n" }
                }
                $currentCap = $capName
                $currentLines = @($line)
                $inCap = $true
            }
        } else {
            if ($inCap) { $currentLines += $line }
        }
    }
    if ($inCap -and $currentCap) {
        $capabilities += [PSCustomObject]@{ Name = $currentCap; Content = $currentLines -join "`r`n" }
    }

    # Check each capability block for tiers
    $missingTiers = @()
    $skillCapCount = 0
    $skillCompleteCount = 0

    if ($capabilities.Count -eq 0) {
        # No ###-level capabilities found; try ####-level tier check on whole file
        $hasTier1 = Test-Tier -Content $content -TierNumber 1 -TierNames @('Native Execution', 'Hard Gates', 'Automatic', 'Native')
        $hasTier2 = Test-Tier -Content $content -TierNumber 2 -TierNames @('External Integration', 'Standard Gates', 'Semi-Automatic', 'External')
        $hasTier3 = Test-Tier -Content $content -TierNumber 3 -TierNames @('Manual Workflow', 'Manual', 'Guided')
        $hasTier4 = Test-Tier -Content $content -TierNumber 4 -TierNames @('Human-Assisted', 'Human', 'Manual Escalation')

        $tiersFound = @()
        if ($hasTier1) { $tiersFound += 1 }
        if ($hasTier2) { $tiersFound += 2 }
        if ($hasTier3) { $tiersFound += 3 }
        if ($hasTier4) { $tiersFound += 4 }

        if ($tiersFound.Count -gt 0) {
            $skillCapCount = 1
            $totalCapabilities++
            if ($tiersFound.Count -eq 4) {
                $skillCompleteCount = 1
                $completeCapabilities++
            } else {
                $incompleteCapabilities++
                $missing = @()
                for ($i = 1; $i -le 4; $i++) { if ($i -notin $tiersFound) { $missing += $i } }
                $missingTiers += "[file-level] Missing Tier(s): $($missing -join ', ')"
            }
        }
    } else {
        foreach ($cap in $capabilities) {
            $capContent = $cap.Content
            $capName = $cap.Name

            $hasTier1 = Test-Tier -Content $capContent -TierNumber 1 -TierNames @('Native Execution', 'Hard Gates', 'Automatic', 'Native')
            $hasTier2 = Test-Tier -Content $capContent -TierNumber 2 -TierNames @('External Integration', 'Standard Gates', 'Semi-Automatic', 'External')
            $hasTier3 = Test-Tier -Content $capContent -TierNumber 3 -TierNames @('Manual Workflow', 'Manual', 'Guided')
            $hasTier4 = Test-Tier -Content $capContent -TierNumber 4 -TierNames @('Human-Assisted', 'Human', 'Manual Escalation')

            $tiersFound = @()
            if ($hasTier1) { $tiersFound += 1 }
            if ($hasTier2) { $tiersFound += 2 }
            if ($hasTier3) { $tiersFound += 3 }
            if ($hasTier4) { $tiersFound += 4 }

            $skillCapCount++
            $totalCapabilities++

            if ($tiersFound.Count -eq 4) {
                $skillCompleteCount++
                $completeCapabilities++
            } else {
                $incompleteCapabilities++
                $missing = @()
                for ($i = 1; $i -le 4; $i++) { if ($i -notin $tiersFound) { $missing += $i } }
                $missingTiers += "[$capName] Missing Tier(s): $($missing -join ', ')"
            }
        }
    }

    if ($missingTiers.Count -gt 0) {
        Write-Host "  [FAIL] $skillName — $($missingTiers.Count) incomplete capabilities" -ForegroundColor Red
        if ($Verbose) {
            foreach ($m in $missingTiers) {
                Write-Host "         $m" -ForegroundColor DarkRed
            }
        }
    } elseif ($skillCapCount -eq 0) {
        Write-Host "  [INFO] $skillName — No capability blocks detected" -ForegroundColor DarkYellow
    } else {
        Write-Host "  [PASS] $skillName — $skillCapCount capabilities, all 4 tiers present" -ForegroundColor Green
    }

    $skillResults += [PSCustomObject]@{
        Skill      = $skillName
        Status     = if ($missingTiers.Count -gt 0) { "FAIL" } elseif ($skillCapCount -eq 0) { "INFO" } else { "PASS" }
        CapCount   = $skillCapCount
        Complete   = $skillCompleteCount
        Issues     = $missingTiers -join "; "
    }
}

# Summary
Write-Host ""
Write-Host "=============== Fallback Coverage Summary ==============="
$totalChecked = $skillResults | Where-Object { $_.CapCount -gt 0 } | Measure-Object | Select-Object -ExpandProperty Count
$totalWithCaps = $skillResults | Where-Object { $_.CapCount -gt 0 } | Measure-Object | Select-Object -ExpandProperty Count
$passedSkills = $skillResults | Where-Object { $_.Status -eq "PASS" } | Measure-Object | Select-Object -ExpandProperty Count
$failedSkills = $skillResults | Where-Object { $_.Status -eq "FAIL" } | Measure-Object | Select-Object -ExpandProperty Count

Write-Host "Skills with capabilities : $totalWithCaps"
Write-Host "Capabilities total       : $totalCapabilities"
Write-Host "Complete (4/4 tiers)     : $completeCapabilities"
Write-Host "Incomplete               : $incompleteCapabilities"
if ($totalCapabilities -gt 0) {
    $coverage = [math]::Round(($completeCapabilities / $totalCapabilities) * 100, 1)
    Write-Host "Coverage rate            : $coverage%"
}
Write-Host "Skills passed            : $passedSkills"
Write-Host "Skills failed            : $failedSkills"
Write-Host "========================================================"
Write-Host ""

# Detailed report
Write-Host "--- Detailed Results ---"
foreach ($r in $skillResults) {
    Write-Host "$($r.Status) $($r.Skill) — $($r.Complete)/$($r.CapCount) complete"
    if ($r.Issues -and $Verbose) {
        Write-Host "     $($r.Issues)" -ForegroundColor DarkGray
    }
}

if ($incompleteCapabilities -gt 0) {
    Write-Host ""
    Write-Host "IMPORTANT: $incompleteCapabilities capability(s) have incomplete fallback chains." -ForegroundColor Yellow
    Write-Host "Every capability block MUST have all 4 tiers (Tier 1-4)." -ForegroundColor Yellow
    exit 1
}

Write-Host "All capabilities have complete fallback chains." -ForegroundColor Green
exit 0
