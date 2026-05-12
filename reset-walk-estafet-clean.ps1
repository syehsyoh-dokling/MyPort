param()

$ErrorActionPreference = "Stop"

Set-Location "$HOME\Desktop\MyPort"

Write-Host "=== CLEAN RESET WALKING ESTAFET ONLY - FILE VERSION ===" -ForegroundColor Cyan

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = ".\backup-before-clean-reset-walking-estafet-file-$stamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$journeyData = ".\src\data\journeySlides.ts"
$journeyCss  = ".\src\styles\journey-slider.css"

if (-not (Test-Path $journeyData)) { throw "journeySlides.ts tidak ditemukan." }
if (-not (Test-Path $journeyCss))  { throw "journey-slider.css tidak ditemukan." }

if ((Get-Item $journeyData).Length -lt 1000) {
  throw "journeySlides.ts tampaknya terlalu kecil/rusak. Rollback dulu dari backup terakhir."
}

Copy-Item $journeyData "$backupDir\journeySlides.ts" -Force
Copy-Item $journeyCss  "$backupDir\journey-slider.css" -Force

Write-Host "Backup saved to: $backupDir" -ForegroundColor Green


function ReplaceWalkSlide {
  param(
    [string]$Content,
    [string]$H1,
    [string]$H2,
    [string]$Duration,
    [string]$WalkStart,
    [string]$WalkEnd,
    [string]$SegmentsText
  )

  $slidePattern = '(?s)(\{\s*"mode":\s*"walk".*?"h1":\s*"' + [regex]::Escape($H1) + '".*?"h2":\s*"' + [regex]::Escape($H2) + '".*?)(\r?\n\},\s*\r?\n\s*\{)'
  $m = [regex]::Match($Content, $slidePattern)

  if (-not $m.Success) {
    throw "Slide $H1 - $H2 tidak ditemukan."
  }

  $body = $m.Groups[1].Value
  $tail = $m.Groups[2].Value

  $body = [regex]::Replace($body, '"duration":\s*\d+', '"duration": ' + $Duration, 1)

  if ($body -match '"frameLoops":\s*\d+') {
    $body = [regex]::Replace($body, '"frameLoops":\s*\d+', '"frameLoops": 3', 1)
  } else {
    $body = [regex]::Replace($body, '("accentSoft":\s*"[^"]*",)', '$1' + "`r`n    `"frameLoops`": 3,", 1)
  }

  if ($body -match '"walkStart":\s*"[^"]+"') {
    $body = [regex]::Replace($body, '"walkStart":\s*"[^"]+"', '"walkStart": "' + $WalkStart + '"', 1)
  } else {
    $body = [regex]::Replace($body, '("frameLoops":\s*3,)', '$1' + "`r`n    `"walkStart`": `"$WalkStart`",", 1)
  }

  if ($body -match '"walkEnd":\s*"[^"]+"') {
    $body = [regex]::Replace($body, '"walkEnd":\s*"[^"]+"', '"walkEnd": "' + $WalkEnd + '"', 1)
  } else {
    $body = [regex]::Replace($body, '("walkStart":\s*"[^"]+",)', '$1' + "`r`n    `"walkEnd`": `"$WalkEnd`",", 1)
  }

  $segPattern = '(?s)\s*"walkSegments":\s*\[.*?\]\s*,\s*(?=\r?\n\s*"notes":)'
  if ($body -notmatch $segPattern) {
    throw "walkSegments sebelum notes tidak ditemukan pada slide $H1 - $H2."
  }

  $body = [regex]::Replace($body, $segPattern, "`r`n" + $SegmentsText.TrimEnd() + "`r`n", 1)

  return $Content.Substring(0, $m.Index) + $body + $tail + $Content.Substring($m.Index + $m.Length)
}


Write-Host "=== PATCH SD / SMP / SMA WALK DATA ===" -ForegroundColor Cyan

$content = Get-Content $journeyData -Raw

$sdSegments = @'
    "walkSegments": [
        {
            "from": "6%",
            "to": "14%"
        },
        {
            "from": "14%",
            "to": "22%"
        },
        {
            "from": "22%",
            "to": "32%"
        }
    ],
'@

$smpSegments = @'
    "walkSegments": [
        {
            "from": "30%",
            "to": "40%"
        },
        {
            "from": "40%",
            "to": "52%"
        },
        {
            "from": "52%",
            "to": "64%"
        }
    ],
'@

$smaSegments = @'
    "walkSegments": [
        {
            "from": "62%",
            "to": "72%"
        },
        {
            "from": "72%",
            "to": "82%"
        },
        {
            "from": "82%",
            "to": "92%"
        }
    ],
'@

$content = ReplaceWalkSlide -Content $content -H1 "1985" -H2 "SD Negeri Batee Shok" -Duration "6200" -WalkStart "6%" -WalkEnd "32%" -SegmentsText $sdSegments
$content = ReplaceWalkSlide -Content $content -H1 "1991" -H2 "SMP Negeri 1 Kota Sabang" -Duration "6200" -WalkStart "30%" -WalkEnd "64%" -SegmentsText $smpSegments
$content = ReplaceWalkSlide -Content $content -H1 "1994" -H2 "SMU Negeri 1 Kota Sabang" -Duration "6200" -WalkStart "62%" -WalkEnd "92%" -SegmentsText $smaSegments

Set-Content -Path $journeyData -Value $content -Encoding UTF8


Write-Host "=== CLEAN WALK CSS PATCHES ===" -ForegroundColor Cyan

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
  Clean estafet rule:
  - Tidak ada left: ... !important per slide.
  - Posisi awal/akhir dikendalikan oleh data walkStart/walkEnd dan walkSegments.
  - Karakter muncul sejak awal slide, bukan dari luar layar.
*/

#journey .journey-panel.walk .journey-visual-track {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  overflow: visible !important;
}

#journey .journey-panel.walk .journey-visual-item {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  left: var(--journey-walk-start);
  animation:
    var(--journey-walk-animation) var(--journey-duration) linear forwards,
    journeyBodyBounce .58s ease-in-out infinite !important;
}

#journey .journey-panel.walk.walk-done .journey-visual-item {
  animation: none !important;
  left: var(--journey-walk-end) !important;
}

#journey .journey-panel[data-slide-index="2"] .journey-visual-item,
#journey .journey-panel[data-slide-index="3"] .journey-visual-item,
#journey .journey-panel[data-slide-index="4"] .journey-visual-item {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}

/* === CLEAN WALK ESTAFET CSS END === */
'@

Set-Content -Path $journeyCss -Value ($css.TrimEnd() + [Environment]::NewLine + $cleanPatch + [Environment]::NewLine) -Encoding UTF8


Write-Host "=== VERIFY ===" -ForegroundColor Cyan

Write-Host "`n--- SD ---" -ForegroundColor Yellow
Select-String -Path $journeyData -Pattern '"h1": "1985"' -Context 0,34

Write-Host "`n--- SMP ---" -ForegroundColor Yellow
Select-String -Path $journeyData -Pattern '"h1": "1991"' -Context 0,34

Write-Host "`n--- SMA ---" -ForegroundColor Yellow
Select-String -Path $journeyData -Pattern '"h1": "1994"' -Context 0,34 | Select-Object -First 1

Write-Host "`n--- BAD LEFT LOCK CHECK: should return nothing ---" -ForegroundColor Yellow
Select-String -Path $journeyCss -Pattern 'data-slide-index="2".*left:|data-slide-index="3".*left:|data-slide-index="4".*left:|left:\s*(-22%|-14%|-8%|28%|60%)\s*!important' | Select-Object -First 20

Write-Host "=== BUILD CHECK ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  throw "Build gagal. Backup tersedia di: $backupDir"
}

Write-Host "=== START DEV SERVER ===" -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
npm run dev
