<#
.SYNOPSIS
  Compile a skill for a specific runtime.

.DESCRIPTION
  Reads a runtime adapter from shared/runtime-adapters/<runtime>.md, transforms
  the SKILL.md frontmatter based on the adapter rules, filters sections as
  specified by the adapter, and outputs the compiled version.

  Supports runtimes: codex, opencode, cursor, claude-code, gemini-cli,
  copilot, windsurf, cline, roo-code.

.PARAMETER SkillId
  The skill directory name (e.g. "architect", "ux-engineer").

.PARAMETER Runtime
  The target runtime (e.g. "codex", "opencode", "cursor").

.PARAMETER OutputDir
  Optional directory to write the compiled output. If not specified, output
  is written to the console.

.PARAMETER SkillsDir
  Path to the skills directory (default: ../skills relative to script).

.PARAMETER AdaptersDir
  Path to the runtime-adapters directory (default: ../shared/runtime-adapters).

.EXAMPLE
  .\compile-for-runtime.ps1 -SkillId architect -Runtime codex

.EXAMPLE
  .\compile-for-runtime.ps1 -SkillId ux-engineer -Runtime opencode -OutputDir .\compiled
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$SkillId,

    [Parameter(Mandatory = $true)]
    [ValidateSet('codex', 'opencode', 'cursor', 'claude-code', 'gemini-cli', 'copilot', 'windsurf', 'cline', 'roo-code')]
    [string]$Runtime,

    [string]$OutputDir = "",

    [string]$SkillsDir = "",

    [string]$AdaptersDir = ""
)

$scriptPath = Split-Path -Parent $PSCommandPath

if (-not $SkillsDir) { $SkillsDir = Resolve-Path (Join-Path $scriptPath "..\skills") }
if (-not $AdaptersDir) { $AdaptersDir = Resolve-Path (Join-Path $scriptPath "..\shared\runtime-adapters") }

$scriptName = "compile-for-runtime.ps1"

function Write-Help {
    Write-Host @"
$scriptName - Compile a skill for a specific runtime

USAGE:
    .\$scriptName -SkillId <string> -Runtime <string> [-OutputDir <string>]

PARAMETERS:
    -SkillId     (Required) The skill directory name (e.g. "architect", "ux-engineer")
    -Runtime     (Required) Target runtime: codex, opencode, cursor, claude-code,
                 gemini-cli, copilot, windsurf, cline, roo-code
    -OutputDir   Directory to write compiled output (default: console only)

EXAMPLES:
    .\$scriptName -SkillId architect -Runtime codex
    .\$scriptName -SkillId ux-engineer -Runtime opencode -OutputDir .\compiled
"@
}

foreach ($arg in $MyInvocation.UnboundArguments) {
    if ($arg -eq "-?" -or $arg -eq "/?" -or $arg -eq "-h" -or $arg -eq "-Help") {
        Write-Help
        exit 0
    }
}

# Locate skill
$skillPath = Join-Path $SkillsDir $SkillId
$skillMdPath = Join-Path $skillPath "SKILL.md"

if (-not (Test-Path -LiteralPath $skillMdPath)) {
    Write-Error "Skill not found: $skillMdPath"
    exit 1
}

# Locate runtime adapter
$adapterPath = Join-Path $AdaptersDir "$Runtime.md"
if (-not (Test-Path -LiteralPath $adapterPath)) {
    Write-Error "Runtime adapter not found: $adapterPath"
    exit 1
}

# Read source files
try {
    $sourceContent = Get-Content -LiteralPath $skillMdPath -Raw -ErrorAction Stop
    $adapterContent = Get-Content -LiteralPath $adapterPath -Raw -ErrorAction Stop
} catch {
    Write-Error "Failed to read files: $($_.Exception.Message)"
    exit 1
}

# Parse adapter frontmatter for rules
$adapterFmMatch = [regex]::Match($adapterContent, '(?s)^---\r?\n(.+?)\r?\n---')
$adapterFm = ""
if ($adapterFmMatch.Success) {
    $adapterFm = $adapterFmMatch.Groups[1].Value
}

# Parse adapter body for compilation rules
$adapterBody = $adapterContent
if ($adapterFmMatch.Success) {
    $adapterBody = $adapterContent.Substring($adapterFmMatch.Index + $adapterFmMatch.Length).Trim()
}

# Determine section filtering rules from adapter body
$adapterText = $adapterContent.ToLower()

# Parse include/skip rules
$includeSections = @()
$skipSections = @()

if ($adapterText -match 'include:(.+?)(?=\n#{1,5}\s|\z)') {
    $includeBlock = $Matches[1]
    $includeSections = ($includeBlock -split ',') | ForEach-Object { $_.Trim() -replace '^- ','' } | Where-Object { $_ }
}

if ($adapterText -match 'skip:(.+?)(?=\n#{1,5}\s|\z)') {
    $skipBlock = $Matches[1]
    $skipSections = ($skipBlock -split ',') | ForEach-Object { $_.Trim() -replace '^- ','' } | Where-Object { $_ }
}

# For simpler approach, also look at list items
$includeMatches = [regex]::Matches($adapterContent, '(?m)^-\s*INCLUDE:\s*(.+)')
foreach ($m in $includeMatches) {
    $includeSections += $m.Groups[1].Value.Trim()
}

$skipMatches = [regex]::Matches($adapterContent, '(?m)^-\s*SKIP:\s*(.+)')
foreach ($m in $skipMatches) {
    $skipSections += $m.Groups[1].Value.Trim()
}

$adaptMatches = [regex]::Matches($adapterContent, '(?m)^-\s*ADAPT:\s*(.+)')
$adaptRules = @()
foreach ($m in $adaptMatches) {
    $adaptRules += $m.Groups[1].Value.Trim()
}

# Parse frontmatter of source skill
$sourceFmMatch = [regex]::Match($sourceContent, '(?s)^---\r?\n(.+?)\r?\n---')
if (-not $sourceFmMatch.Success) {
    Write-Error "Source SKILL.md has no valid frontmatter"
    exit 1
}
$sourceFm = $sourceFmMatch.Groups[1].Value
$sourceBody = $sourceContent.Substring($sourceFmMatch.Index + $sourceFmMatch.Length).Trim()

# Parse frontmatter into hash
$fmData = @{}
$currentKey = ""
$currentList = @()
$inList = $false
$inBlock = $false
$blockKey = ""

foreach ($line in ($sourceFm -split '\r?\n')) {
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
            } else {
                $fmData[$currentKey] = $val
            }
        }
    } elseif ($inBlock -and $line -match '^\s+') {
        $fmData[$blockKey] += $line.Trim()
    } elseif ($inBlock -and $line -match '^\S') {
        $inBlock = $false
    }
}
if ($inList) { $fmData[$currentKey] = $currentList }

# Build compiled frontmatter (runtime adapter may restrict fields)
$compiledFm = @()

$name = if ($fmData.ContainsKey('name')) { $fmData['name'] } else { $SkillId }
$description = if ($fmData.ContainsKey('description')) { $fmData['description'] } else { "" }
$version = if ($fmData.ContainsKey('version')) { $fmData['version'] } else { "0.0.0" }

$compiledFm += "---"
$compiledFm += "runtime: $Runtime"
$compiledFm += "name: $name"
if ($description -is [array]) {
    $compiledFm += "description: >"
    foreach ($d in $description) { $compiledFm += "  $d" }
} else {
    $compiledFm += "description: $description"
}
$compiledFm += "source_version: $version"
$compiledFm += "---"

# Process body - filter sections based on adapter rules
$bodyLines = $sourceBody -split '\r?\n'
$compiledBody = @()
$inSection = $false
$currentSection = ""
$sectionBuffer = @()
$sectionName = ""
$skipSection = $false

function Get-SectionName {
    param([string]$line)
    if ($line -match '^#{1,6}\s+(.+)$') {
        return $Matches[1].Trim()
    }
    return ""
}

foreach ($line in $bodyLines) {
    $sn = Get-SectionName $line
    if ($sn) {
        # Flush previous section buffer
        if ($sectionBuffer.Count -gt 0 -and -not $skipSection) {
            $compiledBody += $sectionBuffer
            $sectionBuffer = @()
        } elseif ($skipSection) {
            $sectionBuffer = @()
            $skipSection = $false
        }

        $sectionName = $sn
        $sectionBuffer = @($line)

        # Determine if this section should be skipped
        $skipSection = $false
        $secLower = $sectionName.ToLower()

        # If include list is specified, only include those sections
        if ($includeSections.Count -gt 0) {
            $matched = $false
            foreach ($inc in $includeSections) {
                if ($secLower -match [regex]::Escape($inc.ToLower())) {
                    $matched = $true
                    break
                }
            }
            if (-not $matched) {
                $skipSection = $true
            }
        }

        # Check skip list
        if (-not $skipSection -and $skipSections.Count -gt 0) {
            foreach ($sk in $skipSections) {
                if ($secLower -match [regex]::Escape($sk.ToLower())) {
                    $skipSection = $true
                    break
                }
            }
        }
    } else {
        $sectionBuffer += $line
    }
}

# Flush last section
if ($sectionBuffer.Count -gt 0 -and -not $skipSection) {
    $compiledBody += $sectionBuffer
}

# Apply adaptation rules
$compiledBodyStr = $compiledBody -join "`r`n"
foreach ($rule in $adaptRules) {
    if ($rule -match 'Replace (.+) references with (.+)') {
        $search = $Matches[1].Trim()
        $replace = $Matches[2].Trim()
        $compiledBodyStr = $compiledBodyStr -replace [regex]::Escape($search), $replace
    }
    if ($rule -match 'Replace\s+"([^"]+)"\s+with\s+"([^"]+)"') {
        $compiledBodyStr = $compiledBodyStr -replace [regex]::Escape($Matches[1]), $Matches[2]
    }
    # Generic: "Replace X with Y"
    if ($rule -match 'Replace\s+(.+?)\s+with\s+(.+)') {
        $search = $Matches[1].Trim()
        $replace = $Matches[2].Trim()
        $compiledBodyStr = $compiledBodyStr -replace [regex]::Escape($search), $replace
    }
}

# Assemble compiled output
$compiledOutput = @($compiledFm -join "`r`n")
$compiledOutput += ""
$compiledOutput += $compiledBodyStr
$compiledOutput = $compiledOutput -join "`r`n"

# Write output
if ($OutputDir) {
    if (-not (Test-Path -LiteralPath $OutputDir)) {
        try {
            New-Item -ItemType Directory -Path $OutputDir -Force -ErrorAction Stop | Out-Null
        } catch {
            Write-Error "Cannot create output directory: $OutputDir"
            exit 1
        }
    }
    $outputFileName = "${SkillId}-${Runtime}.md"
    $outputPath = Join-Path $OutputDir $outputFileName
    try {
        $compiledOutput | Set-Content -LiteralPath $outputPath -NoNewline -Encoding UTF8 -ErrorAction Stop
        Write-Host "Compiled skill written to: $outputPath"
    } catch {
        Write-Error "Failed to write output: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host $compiledOutput
}

Write-Host "Compilation complete for '$SkillId' targeting '$Runtime'."
exit 0
