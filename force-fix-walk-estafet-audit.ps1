param()

$ErrorActionPreference = "Stop"
Set-Location "$HOME\Desktop\MyPort"

Write-Host "=== FORCE FIX + AUDIT WALK ESTAFET DATA ONLY ===" -ForegroundColor Cyan

$journeyData = ".\src\data\journeySlides.ts"
$journeyCss  = ".\src\styles\journey-slider.css"

if (-not (Test-Path $journeyData)) { throw "File tidak ditemukan: $journeyData" }
if (-not (Test-Path $journeyCss))  { throw "File tidak ditemukan: $journeyCss" }

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = ".\backup-before-force-walk-estafet-$stamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Copy-Item $journeyData "$backupDir\journeySlides.ts" -Force
Copy-Item $journeyCss "$backupDir\journey-slider.css" -Force

Write-Host "Backup saved to: $backupDir" -ForegroundColor Green

function Show-WalkBlock {
  param([string]$Title, [string]$H1)
  Write-Host "`n--- $Title ---" -ForegroundColor Yellow
  Select-String -Path $journeyData -Pattern ('"h1": "' + $H1 + '"') -Context 0,34 | Select-Object -First 1
}

Write-Host "`n=== BEFORE ===" -ForegroundColor Cyan
Show-WalkBlock -Title "SD BEFORE" -H1 "1985"
Show-WalkBlock -Title "SMP BEFORE" -H1 "1991"
Show-WalkBlock -Title "SMA BEFORE" -H1 "1994"

$content = Get-Content $journeyData -Raw

function ReplaceWalkSlideByH1 {
  param(
    [string]$InputContent,
    [string]$H1,
    [string]$ExpectedH2,
    [string]$NewDuration,
    [string]$NewWalkStart,
    [string]$NewWalkEnd,
    [string]$NewSegments
  )

  $h1Pattern = '"h1":\s*"' + [regex]::Escape($H1) + '"'
  $h1Match = [regex]::Match($InputContent, $h1Pattern)

  if (-not $h1Match.Success) {
    throw "Tidak menemukan h1 $H1"
  }

  # Cari awal object slide: karakter { sebelum h1.
  $start = $InputContent.LastIndexOf("{", $h1Match.Index)
  if ($start -lt 0) {
    throw "Tidak menemukan awal object untuk slide $H1"
  }

  # Cari akhir object slide dengan anchor: baris penutup }, lalu object berikutnya.
  $afterH1 = $InputContent.Substring($h1Match.Index)
  $endRelMatch = [regex]::Match($afterH1, '(?s)\r?\n\},\s*\r?\n\s*\{')
  if (-not $endRelMatch.Success) {
    throw "Tidak menemukan akhir object untuk slide $H1"
  }

  $end = $h1Match.Index + $endRelMatch.Index
  $tailLen = $endRelMatch.Length

  $prefix = $InputContent.Substring(0, $start)
  $body = $InputContent.Substring($start, $end - $start)
  $tail = $InputContent.Substring($end, $tailLen)
  $suffix = $InputContent.Substring($end + $tailLen)

  if ($body -notmatch ('"h2":\s*"' + [regex]::Escape($ExpectedH2) + '"')) {
    throw "Slide $H1 ditemukan, tapi h2 bukan $ExpectedH2. Stop agar tidak salah target."
  }

  if ($body -notmatch '"mode":\s*"walk"') {
    throw "Slide $H1 bukan mode walk. Stop agar tidak salah target."
  }

  $body = [regex]::Replace($body, '"duration":\s*\d+', '"duration": ' + $NewDuration, 1)

  if ($body -match '"frameLoops":\s*\d+') {
    $body = [regex]::Replace($body, '"frameLoops":\s*\d+', '"frameLoops": 3', 1)
  } else {
    $body = [regex]::Replace($body, '("accentSoft":\s*"[^"]*",)', '$1' + "`r`n    `"frameLoops`": 3,", 1)
  }

  if ($body -match '"walkStart":\s*"[^"]+"') {
    $body = [regex]::Replace($body, '"walkStart":\s*"[^"]+"', '"walkStart": "' + $NewWalkStart + '"', 1)
  } else {
    $body = [regex]::Replace($body, '("frameLoops":\s*3,)', '$1' + "`r`n    `"walkStart`": `"$NewWalkStart`",", 1)
  }

  if ($body -match '"walkEnd":\s*"[^"]+"') {
    $body = [regex]::Replace($body, '"walkEnd":\s*"[^"]+"', '"walkEnd": "' + $NewWalkEnd + '"', 1)
  } else {
    $body = [regex]::Replace($body, '("walkStart":\s*"[^"]+",)', '$1' + "`r`n    `"walkEnd`": `"$NewWalkEnd`",", 1)
  }

  $segPattern = '(?s)\s*"walkSegments":\s*\[.*?\]\s*,\s*(?=\r?\n\s*"notes":)'
  if ($body -notmatch $segPattern) {
    throw "walkSegments sebelum notes tidak ditemukan pada slide $H1"
  }

  $body = [regex]::Replace($body, $segPattern, "`r`n" + $NewSegments.TrimEnd() + "`r`n", 1)

  return $prefix + $body + $tail + $suffix
}

$sdSegments = @'
    "walkSegments": [
        {
            "from": "0%",
            "to": "12%"
        },
        {
            "from": "12%",
            "to": "24%"
        },
        {
            "from": "24%",
            "to": "36%"
        }
    ],
'@

$smpSegments = @'
    "walkSegments": [
        {
            "from": "34%",
            "to": "46%"
        },
        {
            "from": "46%",
            "to": "58%"
        },
        {
            "from": "58%",
            "to": "70%"
        }
    ],
'@

$smaSegments = @'
    "walkSegments": [
        {
            "from": "68%",
            "to": "78%"
        },
        {
            "from": "78%",
            "to": "88%"
        },
        {
            "from": "88%",
            "to": "96%"
        }
    ],
'@

$content = ReplaceWalkSlideByH1 -InputContent $content -H1 "1985" -ExpectedH2 "SD Negeri Batee Shok" -NewDuration "6200" -NewWalkStart "0%" -NewWalkEnd "36%" -NewSegments $sdSegments
$content = ReplaceWalkSlideByH1 -InputContent $content -H1 "1991" -ExpectedH2 "SMP Negeri 1 Kota Sabang" -NewDuration "6200" -NewWalkStart "34%" -NewWalkEnd "70%" -NewSegments $smpSegments
$content = ReplaceWalkSlideByH1 -InputContent $content -H1 "1994" -ExpectedH2 "SMU Negeri 1 Kota Sabang" -NewDuration "6200" -NewWalkStart "68%" -NewWalkEnd "96%" -NewSegments $smaSegments

Set-Content -Path $journeyData -Value $content -Encoding UTF8

# Remove only the known bad left-lock patches; keep slide-1 and slide-2 patches intact.
$css = Get-Content $journeyCss -Raw
$patchPairs = @(
  @("/* === WALK ESTAFET ANIMATION FIX START === */", "/* === WALK ESTAFET ANIMATION FIX END === */"),
  @("/* === FULL WALK ESTAFET LOGIC START === */", "/* === FULL WALK ESTAFET LOGIC END === */"),
  @("/* === REPAIRED WALK ESTAFET CSS START === */", "/* === REPAIRED WALK ESTAFET CSS END === */"),
  @("/* === FINAL WALK ESTAFET SEQUENCE START === */", "/* === FINAL WALK ESTAFET SEQUENCE END === */"),
  @("/* === CLEAN WALK ESTAFET CSS START === */", "/* === CLEAN WALK ESTAFET CSS END === */")
)
foreach ($pair in $patchPairs) {
  $p = [regex]::Escape($pair[0]) + ".*?" + [regex]::Escape($pair[1])
  $css = [regex]::Replace($css, $p, "", [System.Text.RegularExpressions.RegexOptions]::Singleline)
}

$cleanPatch = @'

/* === CLEAN WALK ESTAFET CSS START === */

/*
  Clean rule:
  - Tidak ada left: ... !important per slide.
  - Keyframe dari JourneySlider.tsx / CSS variable yang menggerakkan karakter.
  - Khusus slide walk saja.
*/

#journey .journey-panel.walk .journey-visual-item {
  left: var(--journey-walk-start);
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  animation:
    var(--journey-walk-animation, journeyWalkAcross) var(--journey-duration) linear forwards,
    journeyBodyBounce .58s ease-in-out infinite !important;
}

#journey .journey-panel.walk.walk-done .journey-visual-item {
  animation: none !important;
  left: var(--journey-walk-end) !important;
}

/* === CLEAN WALK ESTAFET CSS END === */
'@

Set-Content -Path $journeyCss -Value ($css.TrimEnd() + [Environment]::NewLine + $cleanPatch + [Environment]::NewLine) -Encoding UTF8

Write-Host "`n=== AFTER ===" -ForegroundColor Cyan
Show-WalkBlock -Title "SD AFTER should be 0 -> 36" -H1 "1985"
Show-WalkBlock -Title "SMP AFTER should be 34 -> 70" -H1 "1991"
Show-WalkBlock -Title "SMA AFTER should be 68 -> 96" -H1 "1994"

Write-Host "`n=== BAD LEFT LOCK CHECK: should return nothing ===" -ForegroundColor Yellow
Select-String -Path $journeyCss -Pattern 'data-slide-index="2".*left:|data-slide-index="3".*left:|data-slide-index="4".*left:|left:\s*(-22%|-14%|-8%|28%|60%|70%)\s*!important' | Select-Object -First 20

Write-Host "`n=== BUILD CHECK ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  throw "Build gagal. Backup tersedia di: $backupDir"
}

Write-Host "`n=== START DEV SERVER ===" -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
npm run dev
