# ==========================================================
# FINAL SAFE PATCH - REVISED MAPPING - Journey Slider Slide 1-11 Only
# Run from project root:
#   C:\Users\Saifuddin\Desktop\MyPort
#
# Guarantees:
# - Backup is created OUTSIDE src/
# - journeySlides.ts: only the first 11 slide objects are replaced
# - Slide 12 and after are preserved from the current restored file
# - JourneySlider.tsx is patched minimally, not fully rewritten
# - CSS is appended with targeted rules only, using data-slide-index 0-10
# - ASCII only marker to avoid Windows PowerShell encoding errors
# ==========================================================

$ErrorActionPreference = "Stop"

Write-Host "=== CHECK PROJECT ROOT ===" -ForegroundColor Cyan

if (!(Test-Path ".\src\components\JourneySlider.tsx")) {
  throw "File .\src\components\JourneySlider.tsx tidak ditemukan. Jalankan script dari root project MyPort."
}

if (!(Test-Path ".\src\data\journeySlides.ts")) {
  throw "File .\src\data\journeySlides.ts tidak ditemukan."
}

if (!(Test-Path ".\src\styles\journey-slider.css")) {
  throw "File .\src\styles\journey-slider.css tidak ditemukan."
}

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = ".\SAFE_BACKUP_BEFORE_REVISED_MAPPING_SLIDE_1_11_PATCH_$stamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Copy-Item ".\src\components\JourneySlider.tsx" "$backupDir\JourneySlider.tsx.bak" -Force
Copy-Item ".\src\data\journeySlides.ts" "$backupDir\journeySlides.ts.bak" -Force
Copy-Item ".\src\styles\journey-slider.css" "$backupDir\journey-slider.css.bak" -Force

Write-Host "Backup dibuat di: $backupDir" -ForegroundColor Green

Write-Host "=== CLEAN BAD TS BACKUPS INSIDE SRC ===" -ForegroundColor Cyan
$badBackupDir = ".\MOVED_BAD_TS_BACKUPS_$stamp"
New-Item -ItemType Directory -Path $badBackupDir -Force | Out-Null

Get-ChildItem ".\src" -Recurse -Include "*backup*.ts","*before*.ts","*.bak.ts" -ErrorAction SilentlyContinue | ForEach-Object {
  Move-Item $_.FullName (Join-Path $badBackupDir ($_.Name + ".bak")) -Force
  Write-Host "Moved out of src:" $_.FullName -ForegroundColor Yellow
}



Write-Host "=== VERIFIED ASSET REFERENCES FROM REVISED MAPPING ===" -ForegroundColor Cyan
$expectedAssets = @(
  ".\public\assets\slide-0\background.png",
  ".\public\assets\slide-0\contact.png",
  ".\public\assets\slide-1\frame-1.png",
  ".\public\assets\slide-1\frame-3.png",
  ".\public\assets\slide-2\frame-1.png",
  ".\public\assets\slide-3\frame-1.png",
  ".\public\assets\slide-3b\frame-1.png",
  ".\public\assets\slide-3c\standing.png",
  ".\public\assets\slide-4a\frame-1.png",
  ".\public\assets\slide-4b\frame-1.png",
  ".\public\assets\slide-5\frame-1.png",
  ".\public\assets\slide-6\frame-1.png",
  ".\public\assets\slide-7\frame-1.png"
)
foreach ($asset in $expectedAssets) {
  if (Test-Path $asset) {
    Write-Host "OK   $asset" -ForegroundColor Green
  } else {
    Write-Host "MISS $asset" -ForegroundColor Yellow
  }
}

Write-Host "NOTE: Revised mapping used:" -ForegroundColor Cyan
Write-Host "  Slide 1 -> slide-0" -ForegroundColor Gray
Write-Host "  Slide 2 -> slide-1" -ForegroundColor Gray
Write-Host "  Slide 3 -> slide-2" -ForegroundColor Gray
Write-Host "  Slide 4 -> slide-3" -ForegroundColor Gray
Write-Host "  Slide 5 -> slide-3b" -ForegroundColor Gray
Write-Host "  Slide 6 -> slide-3c" -ForegroundColor Gray
Write-Host "  Slide 7 -> slide-4a" -ForegroundColor Gray
Write-Host "  Slide 8 -> slide-4b" -ForegroundColor Gray
Write-Host "  Slide 9 -> slide-5" -ForegroundColor Gray
Write-Host "  Slide 10 -> slide-6" -ForegroundColor Gray
Write-Host "  Slide 11 -> slide-7 (visual fallback), custom plane animation" -ForegroundColor Gray

Write-Host "=== PATCH journeySlides.ts - FIRST 11 OBJECTS ONLY ===" -ForegroundColor Cyan

$nodeSlidesPatch = @'
const fs = require("fs");

const path = "src/data/journeySlides.ts";
let text = fs.readFileSync(path, "utf8");

function publicAssetUrl(candidates, fallback) {
  for (const url of candidates) {
    const diskPath = "public" + url;
    if (fs.existsSync(diskPath)) return url;
  }
  return fallback || candidates[0];
}

function frameSet(folder, count, fallbackFolder) {
  const arr = [];
  for (let i = 1; i <= count; i++) {
    arr.push(publicAssetUrl([
      `/assets/${folder}/frame-${i}.png`,
      `/assets/${folder}/frame-${i}.jpg`,
      `/assets/${folder}/frame-${i}.webp`
    ], `/assets/${fallbackFolder || folder}/frame-${i}.png`));
  }
  return arr;
}

function existingFrameSet(folder, maxCount, fallbackFolder) {
  const arr = [];
  for (let i = 1; i <= maxCount; i++) {
    const url = publicAssetUrl([
      `/assets/${folder}/frame-${i}.png`,
      `/assets/${folder}/frame-${i}.jpg`,
      `/assets/${folder}/frame-${i}.webp`
    ], "");
    if (url) arr.push(url);
  }
  if (arr.length > 0) return arr;
  return frameSet(fallbackFolder || folder, Math.min(maxCount, 4), fallbackFolder || folder);
}

function jsonStringify(obj) {
  return JSON.stringify(obj, null, 4)
    .replace(/"([^"]+)":/g, '"$1":');
}

function findArrayStart(s) {
  const marker = "export const journeySlides";
  const markerIndex = s.indexOf(marker);
  if (markerIndex < 0) throw new Error("Marker export const journeySlides tidak ditemukan.");
  const eqIndex = s.indexOf("=", markerIndex);
  const arrIndex = s.indexOf("[", eqIndex);
  if (arrIndex < 0) throw new Error("Pembuka array journeySlides tidak ditemukan.");
  return arrIndex;
}

function findFirstNObjectsRange(s, arrStart, count) {
  let i = arrStart + 1;
  let inString = false;
  let quote = "";
  let escaped = false;
  let depth = 0;
  let objStart = -1;
  let found = 0;

  for (; i < s.length; i++) {
    const ch = s[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === "{") {
      if (depth === 0 && objStart < 0) objStart = i;
      depth++;
      continue;
    }

    if (ch === "}") {
      depth--;
      if (depth === 0 && objStart >= 0) {
        found++;
        if (found === count) {
          let end = i + 1;
          while (end < s.length && /[\s\r\n,]/.test(s[end])) end++;
          return { start: objStart, end };
        }
      }
    }
  }

  throw new Error(`Gagal menemukan ${count} object slide pertama.`);
}

const contactUrl = publicAssetUrl([
  "/assets/slide-0/contact.png",
  "/assets/contact.png",
  "/contact.png",
  "/assets/slide-1/contact.png",
  "/assets/slide-0/frame-1.png"
], "/assets/slide-0/contact.png");

const openingBackground = publicAssetUrl([
  "/assets/slide-0/background.png",
  "/assets/slide-0/background.jpg",
  "/assets/slide-0/background.webp"
], "/assets/slide-0/background.png");

const busFrames = [
  publicAssetUrl(["/assets/slide-1/frame-1.png", "/assets/slide-1/frame-1.jpg"], "/assets/slide-1/frame-1.png"),
  publicAssetUrl(["/assets/slide-1/frame-3.png", "/assets/slide-1/frame-3.jpg"], "/assets/slide-1/frame-3.png")
];

const newSlides = [
  {
    mode: "opening",
    duration: 6500,
    badge: "Born in Pidie Jaya, 5 October 1979",
    h1: "Saifuddin Bin Abdullah Bin Rasyid",
    h2: "",
    h3: "Saifuddin Bin Abdullah Bin Rasyid, born to be legend for architecting intelligence platform and innovation.",
    h4: "",
    title: "Born in Pidie Jaya",
    summary: "Saifuddin Bin Abdullah Bin Rasyid, born to be legend for architecting intelligence platform and innovation.",
    background: openingBackground,
    frames: [contactUrl],
    footerLayout: "single",
    accent: "#0ea5e9",
    accentSoft: "rgba(14,165,233,.16)"
  },
  {
    mode: "bus",
    duration: 5600,
    badge: "New Place, New Hope, New Future",
    h1: "1981",
    h2: "The family moved to Sabang",
    h3: "New Place, New Hope, New Future",
    h4: "",
    title: "New Place, New Hope, New Future",
    summary: "The family moved to Sabang, opening a new chapter of childhood, school life, and personal growth.",
    frames: busFrames,
    footerLayout: "single",
    accent: "#2563eb",
    accentSoft: "rgba(37,99,235,.14)"
  },
  {
    mode: "walk",
    duration: 5200,
    badge: "Active in school activities, including Little Doctor and student competitions",
    h1: "1985",
    h2: "SD Negeri Batee Shok",
    h3: "Active in school activities, including Little Doctor and student competitions",
    h4: "",
    title: "Active in school activities, including Little Doctor and student competitions",
    summary: "School was not only about lessons; it was also about confidence, curiosity, and early participation in student activities.",
    frames: existingFrameSet("slide-2", 5, "slide-2"),
    footerLayout: "single",
    accent: "#16a085",
    accentSoft: "rgba(22,160,133,.15)",
    frameLoops: 3,
    walkStart: "0%",
    walkEnd: "25%",
    walkSegments: [
      { from: "0%", to: "8%" },
      { from: "8%", to: "17%" },
      { from: "17%", to: "25%" }
    ],
    notes: []
  },
  {
    mode: "walk",
    duration: 5200,
    badge: "Engaged in many student competitions and academic activities",
    h1: "1991",
    h2: "SMP Negeri 1 Kota Sabang",
    h3: "Engaged in many student competitions and academic activities",
    h4: "",
    title: "Engaged in many student competitions and academic activities",
    summary: "Junior high school became a place to sharpen discipline, academic courage, and teamwork through many school activities.",
    frames: existingFrameSet("slide-3", 5, "slide-3"),
    footerLayout: "single",
    accent: "#0c8bd8",
    accentSoft: "rgba(12,139,216,.15)",
    frameLoops: 3,
    walkStart: "18%",
    walkEnd: "50%",
    walkSegments: [
      { from: "18%", to: "28%" },
      { from: "28%", to: "39%" },
      { from: "39%", to: "50%" }
    ],
    notes: []
  },
  {
    mode: "walk",
    duration: 3200,
    badge: "Multiple achievements and school awards",
    h1: "1994",
    h2: "SMU Negeri 1 Kota Sabang",
    h3: "Multiple achievements and school awards",
    h4: "",
    title: "Multiple achievements and school awards",
    summary: "This period strengthened talent, discipline, and the courage to compete beyond the classroom.",
    frames: existingFrameSet("slide-3b", 6, "slide-3b"),
    footerLayout: "single",
    accent: "#7b57d1",
    accentSoft: "rgba(123,87,209,.15)",
    frameLoops: 1,
    walkStart: "35%",
    walkEnd: "70%",
    walkSegments: [
      { from: "35%", to: "70%" }
    ],
    notes: []
  },
  {
    mode: "achievement",
    duration: 11500,
    badge: "Leadership, scientific curiosity, and student achievements",
    h1: "1994",
    h2: "SMU Negeri 1 Sabang City",
    h3: "Leadership, scientific curiosity, and student achievements.",
    h4: "Achievements became a bridge from talent to confidence.",
    title: "Leadership, scientific curiosity, and student achievements.",
    summary: "The achievement stage highlights early leadership, scientific writing, public speaking, and competitive growth.",
    frames: [
      publicAssetUrl([
        "/assets/slide-3c/standing.png",
        "/assets/slide-6/standing.png",
        "/assets/slide-6/frame-1.png"
      ], "/assets/slide-3c/standing.png")
    ],
    footerLayout: "single",
    accent: "#7b57d1",
    accentSoft: "rgba(123,87,209,.15)",
    rollingNotes: true,
    noteWindow: 99,
    fastNotes: true,
    fastNoteDelaysMs: [0, 1500, 3000, 4500, 6000],
    fastAfterLastMs: 2500,
    notes: [
      "1st place, P4 Speech Competition, Sabang City (1995)",
      "1st place, Scientific Writing Competition, Sabang City (1996)",
      "School-level leadership and organizational experience",
      "Built early confidence in public speaking and scientific thinking",
      "Learned that achievement grows through discipline, practice, and courage"
    ]
  },
  {
    mode: "walk",
    duration: 10000,
    badge: "University Years",
    h1: "1997",
    h2: "Faculty of Engineering, Syiah Kuala University",
    h3: "University life expanded the horizon.",
    h4: "Learning, leadership, and competition became part of the same journey.",
    title: "University Years",
    summary: "The university years shaped technical thinking, leadership capacity, and the habit of turning ideas into structured work.",
    frames: existingFrameSet("slide-4a", 6, "slide-4a"),
    footerLayout: "single",
    accent: "#16a085",
    accentSoft: "rgba(22,160,133,.15)",
    frameLoops: 3,
    walkStart: "0%",
    walkEnd: "55%",
    walkSegments: [
      { from: "0%", to: "10%" },
      { from: "10%", to: "22%" },
      { from: "22%", to: "34%" },
      { from: "34%", to: "45%" },
      { from: "45%", to: "55%" }
    ],
    rollingNotes: true,
    noteWindow: 99,
    fastNotes: true,
    fastNoteDelaysMs: [0, 1500, 3000, 4500, 6000],
    fastAfterLastMs: 2500,
    notes: [
      "2nd place, University Student Scientific Writing Competition (1998)",
      "1st place, University Student Scientific Writing Competition (1999)",
      "5th place, National Student Scientific Writing Competition (1999)",
      "1st place, Faculty of Engineering Lustrum Scientific Writing Competition (2000)",
      "Campus life strengthened leadership, writing, and technical confidence"
    ]
  },
  {
    mode: "plane",
    duration: 8200,
    badge: "Ready to Fight in Greater Jakarta",
    h1: "2003",
    h2: "Bachelor Graduation & Departure",
    h3: "Ready to Fight in Greater Jakarta",
    h4: "",
    title: "Ready to Fight in Greater Jakarta",
    summary: "After graduation, the journey moved toward Greater Jakarta with hope, courage, and the willingness to start a new professional chapter.",
    frames: existingFrameSet("slide-4b", 5, "slide-4b"),
    footerLayout: "single",
    accent: "#0284c7",
    accentSoft: "rgba(2,132,199,.15)",
    rollingNotes: true,
    noteWindow: 9999,
    notes: [
      "Bachelor graduation marked the beginning of a larger professional journey.",
      "Welcome to Soekarno-Hatta Airport."
    ],
    planeMode: true,
    fastNotes: true,
    fastNoteStepMs: 1500,
    fastAfterLastMs: 900,
    fastNoteDelaysMs: [4800, 6400]
  },
  {
    mode: "walk",
    duration: 8000,
    badge: "Starting from Zero",
    h1: "2003",
    h2: "Cilegon, Banten, Indonesia",
    h3: "Starting from Zero",
    h4: "",
    title: "Starting from Zero",
    summary: "The first professional steps were full of uncertainty, but every step built discipline, survival, and resilience.",
    frames: existingFrameSet("slide-5", 5, "slide-5"),
    footerLayout: "single",
    accent: "#f97316",
    accentSoft: "rgba(249,115,22,.16)",
    frameLoops: 3,
    walkStart: "0%",
    walkEnd: "30%",
    walkSegments: [
      { from: "0%", to: "10%" },
      { from: "10%", to: "20%" },
      { from: "20%", to: "30%" }
    ],
    rollingNotes: true,
    noteWindow: 9999,
    notes: [
      "Started from zero in a new place.",
      "Built resilience through early work, uncertainty, and real-world learning.",
      "Every first step became part of the professional foundation."
    ],
    fastNotes: true,
    fastNoteStepMs: 1500,
    fastAfterLastMs: 1200,
    fastNoteDelaysMs: [2600, 4200, 5800]
  },
  {
    mode: "scene",
    duration: 7600,
    badge: "The earthquake and tsunami changed everything",
    h1: "26 December 2004",
    h2: "Aceh Province, Indonesia",
    h3: "The earthquake and tsunami changed everything",
    h4: "",
    title: "The earthquake and tsunami changed everything",
    summary: "The tsunami changed life forever and became the turning point toward emergency response, recovery work, and public service.",
    frames: existingFrameSet("slide-6", 5, "slide-6"),
    footerLayout: "single",
    accent: "#0f172a",
    accentSoft: "rgba(15,23,42,.16)",
    rollingNotes: true,
    noteWindow: 9999,
    notes: [
      "The earthquake and tsunami changed everything.",
      "The disaster became the turning point toward emergency response and recovery work.",
      "A new professional chapter began in Aceh."
    ],
    fastNotes: true,
    fastNoteStepMs: 1500,
    fastAfterLastMs: 1200,
    fastNoteDelaysMs: [700, 2600, 4600],
    typewriterNotes: true
  },
  {
    mode: "plane",
    duration: 7200,
    badge: "Returning home to make sure his family was safe",
    h1: "December 2004",
    h2: "Flight Back to Aceh",
    h3: "Returning home to make sure his family was safe",
    h4: "",
    title: "Returning home to make sure his family was safe",
    summary: "The journey home was filled with fear, prayer, and uncertainty after the disaster.",
    frames: [
      publicAssetUrl([
        "/assets/slide-7/frame-1.png",
        "/assets/slide-11/frame-1.png",
        "/assets/slide-11/background.png"
      ], "/assets/slide-7/frame-1.png")
    ],
    footerLayout: "single",
    accent: "#334155",
    accentSoft: "rgba(51,65,85,.16)",
    rollingNotes: true,
    noteWindow: 9999,
    notes: [
      "Returned home to make sure family members were safe.",
      "The flight back carried fear, prayer, and uncertainty.",
      "Family safety came first; service followed."
    ],
    planeMode: true,
    fastNotes: true,
    fastNoteStepMs: 1500,
    fastAfterLastMs: 900,
    fastNoteDelaysMs: [700, 2500, 4400]
  }
];

const arrStart = findArrayStart(text);
const range = findFirstNObjectsRange(text, arrStart, 11);
const newSlidesText = newSlides.map(jsonStringify).join(",\n    ");

text = text.slice(0, range.start) + newSlidesText + ",\n    " + text.slice(range.end);
fs.writeFileSync(path, text, "utf8");

console.log("OK: journeySlides.ts first 11 objects replaced only. Slide 12+ preserved.");
console.log("Detected contact asset:", contactUrl);
console.log("Detected opening background:", openingBackground);
'@

$nodeSlidesPatchPath = ".\patch_slide_data_1_11_tmp.cjs"
Set-Content -Path $nodeSlidesPatchPath -Value $nodeSlidesPatch -Encoding UTF8
node $nodeSlidesPatchPath
Remove-Item $nodeSlidesPatchPath -Force

Write-Host "=== PATCH JourneySlider.tsx MINIMALLY ===" -ForegroundColor Cyan

$nodeComponentPatch = @'
const fs = require("fs");
const path = "src/components/JourneySlider.tsx";
let text = fs.readFileSync(path, "utf8");

function replaceOnce(label, oldText, newText) {
  if (!text.includes(oldText)) {
    console.log(`SKIP ${label}: pattern not found`);
    return false;
  }
  text = text.replace(oldText, newText);
  console.log(`OK ${label}`);
  return true;
}

// 1) Enable the dedicated two-bus renderer that already exists in the restored source.
replaceOnce(
  "enable bus duo",
  "{false && currentSlide === 1 && (",
  "{currentSlide === 1 && ("
);

// 2) Make bus duo use the active slide frame paths, not hard-coded slide-1.
replaceOnce(
  "bus duo frame paths",
`                  <div className="journey-bus-duo" aria-hidden="true">
                    <img src="/assets/slide-1/frame-1.png" alt="" />
                    <img src="/assets/slide-1/frame-3.png" alt="" />
                  </div>`,
`                  <div className="journey-bus-duo" aria-hidden="true">
                    <img src={slide.frames[0]} alt="" />
                    <img src={slide.frames[1] || slide.frames[0]} alt="" />
                  </div>`
);

// 3) Add slide-specific note placement classes while keeping the original notes logic.
replaceOnce(
  "notes class",
  '<div className="journey-notes">',
  '<div className={`journey-notes ${currentSlide === 5 ? "early-achievement-notes" : ""} ${currentSlide === 6 ? "early-university-notes" : ""} ${currentSlide === 9 ? "early-tsunami-notes" : ""} ${currentSlide === 10 ? "early-return-notes" : ""}`}>'
);

// 4) Add stable slide class to article, without removing the existing mode and legacy classes.
const oldArticleClass = 'className={`journey-panel ${slide.mode} visual-${slide.visualSide || "left"} ${slide.logoWall ? "logo-wall-panel" : ""} ${slide.staticVisual ? "static-visual" : ""} ${slide.maxVisibleNotes ? "limited-notes" : ""} ${slide.typewriterNotes ? "typewriter-notes" : ""} ${playing ? "is-playing" : "is-paused"}`}';
const newArticleClass = 'className={`journey-panel slide-${currentSlide + 1} early-slide-${currentSlide + 1} ${slide.mode} visual-${slide.visualSide || "left"} ${slide.logoWall ? "logo-wall-panel" : ""} ${slide.staticVisual ? "static-visual" : ""} ${slide.maxVisibleNotes ? "limited-notes" : ""} ${slide.typewriterNotes ? "typewriter-notes" : ""} ${playing ? "is-playing" : "is-paused"}`}';
replaceOnce("article slide class", oldArticleClass, newArticleClass);

fs.writeFileSync(path, text, "utf8");
console.log("OK: JourneySlider.tsx minimal patch complete.");
'@

$nodeComponentPatchPath = ".\patch_journey_component_1_11_tmp.cjs"
Set-Content -Path $nodeComponentPatchPath -Value $nodeComponentPatch -Encoding UTF8
node $nodeComponentPatchPath
Remove-Item $nodeComponentPatchPath -Force

Write-Host "=== APPEND TARGETED CSS FOR SLIDE 1-11 ONLY ===" -ForegroundColor Cyan

$cssPath = ".\src\styles\journey-slider.css"
$cssMarker = "FINAL-SAFE-REVISED-MAPPING-SLIDE-1-11-ONLY-PATCH"

$cssAppend = @'
/* ==========================================================
   FINAL-SAFE-REVISED-MAPPING-SLIDE-1-11-ONLY-PATCH
   Targeted early slide rules. Does not target slide 12+.
   ========================================================== */

/* ---------- Slide 1: Opening / Birth ---------- */
#journey .journey-panel[data-slide-index="0"] {
  background-size: cover;
  background-position: center center;
}

#journey .journey-panel[data-slide-index="0"]::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: url("/assets/slide-0/background.png");
  background-size: cover;
  background-position: center center;
  opacity: 1;
  transform-origin: center center;
  animation: earlyBirthBgSpin 2500ms cubic-bezier(.12,.78,.18,1) forwards;
}

#journey .journey-panel[data-slide-index="0"] .journey-code-stack {
  opacity: 0;
  animation: earlyHeaderIn 1000ms ease 2500ms forwards !important;
}

#journey .journey-panel[data-slide-index="0"] .journey-code-place {
  display: none !important;
}

#journey .journey-panel[data-slide-index="0"] .journey-opening-prologue {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
}

#journey .journey-panel[data-slide-index="0"] .journey-opening-prologue span {
  position: absolute;
  left: 50%;
  top: 18%;
  width: min(82%, 760px);
  transform: translateX(-50%);
  text-align: center;
  font-size: clamp(22px, 3vw, 38px);
  line-height: 1.22;
  font-weight: 950;
  color: #ffffff;
  text-shadow: 0 10px 28px rgba(0,0,0,.38);
  opacity: 0;
}

#journey .journey-panel[data-slide-index="0"] .journey-opening-prologue span:nth-child(1) {
  animation: earlyTextOne 2500ms linear forwards;
}

#journey .journey-panel[data-slide-index="0"] .journey-opening-prologue span:nth-child(2) {
  top: 24%;
  animation: earlyTextTwo 2500ms linear forwards;
}

#journey .journey-panel[data-slide-index="0"] .journey-visual-track {
  z-index: 5;
  top: 120px;
  bottom: 178px;
  display: grid;
  place-items: center;
}

#journey .journey-panel[data-slide-index="0"] .journey-visual-item {
  position: relative;
  left: auto;
  bottom: auto;
  width: min(560px, 72%);
  height: min(360px, 100%);
  opacity: 0;
  transform: scale(.96);
  animation: earlyContactIn 1000ms ease 2000ms forwards;
}

#journey .journey-panel[data-slide-index="0"] .journey-character-img {
  object-fit: contain;
  object-position: center center;
}

#journey .journey-panel[data-slide-index="0"] .journey-slide-footer {
  opacity: 0;
  animation: earlyFooterIn 650ms ease 2500ms forwards !important;
}

#journey .journey-panel[data-slide-index="0"] .journey-footer-badge,
#journey .journey-panel[data-slide-index="0"] .journey-slide-footer p {
  overflow: hidden;
  white-space: nowrap;
  max-width: 0;
  animation: earlyFooterTyping 2000ms steps(58, end) 2500ms forwards;
}

/* ---------- Slide 2: Move to Sabang bus sequence ---------- */
#journey .journey-panel[data-slide-index="1"] .journey-visual-item {
  opacity: 0 !important;
  pointer-events: none;
}

#journey .journey-panel[data-slide-index="1"] .journey-bus-duo {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

#journey .journey-panel[data-slide-index="1"] .journey-bus-duo img {
  position: absolute;
  width: min(34vw, 360px);
  height: auto;
  object-fit: contain;
  transform-origin: center bottom;
  filter: drop-shadow(0 16px 24px rgba(15,23,42,.20));
}

#journey .journey-panel[data-slide-index="1"] .journey-bus-duo img:nth-child(1) {
  right: -18%;
  bottom: 60px;
  animation: earlyBusOne 2600ms cubic-bezier(.16,.72,.18,1) forwards;
}

#journey .journey-panel[data-slide-index="1"] .journey-bus-duo img:nth-child(2) {
  left: 50%;
  bottom: 42px;
  opacity: 0;
  transform: translateX(-50%) scale(.9);
  animation: earlyBusTwo 3000ms cubic-bezier(.16,.72,.18,1) 2100ms forwards;
}

/* ---------- Walk slides 3, 4, 5 and 9 ---------- */
#journey .journey-panel[data-slide-index="2"] .journey-visual-item,
#journey .journey-panel[data-slide-index="3"] .journey-visual-item,
#journey .journey-panel[data-slide-index="4"] .journey-visual-item,
#journey .journey-panel[data-slide-index="8"] .journey-visual-item {
  bottom: 72px;
}

#journey .journey-panel[data-slide-index="2"] .journey-character-img,
#journey .journey-panel[data-slide-index="3"] .journey-character-img,
#journey .journey-panel[data-slide-index="4"] .journey-character-img,
#journey .journey-panel[data-slide-index="8"] .journey-character-img {
  object-fit: contain;
  object-position: center bottom;
}

/* ---------- Slide 6: High School Achievement ---------- */
#journey .journey-panel[data-slide-index="5"] .journey-visual-track {
  top: 118px;
  bottom: 210px;
  display: grid;
  grid-template-columns: minmax(340px, 1fr) minmax(220px, 330px);
  gap: 18px;
  padding: 0 30px;
  align-items: center;
}

#journey .journey-panel[data-slide-index="5"] .journey-visual-item {
  position: absolute;
  left: 78%;
  bottom: 96px;
  width: min(26vw, 310px);
  height: min(48vh, 390px);
  transform: translateX(-50%);
}

#journey .journey-panel[data-slide-index="5"] .journey-character-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

#journey .journey-panel[data-slide-index="5"] .early-achievement-notes {
  top: 122px;
  left: 28px;
  width: min(60%, 720px);
  max-width: 720px;
  gap: 8px;
}

/* ---------- Slide 7: University, notes swap sides ---------- */
#journey .journey-panel[data-slide-index="6"] .early-university-notes {
  width: min(44%, 540px);
  max-width: 540px;
  animation: earlyUniversityNotesSwap var(--journey-duration) linear forwards;
}

/* ---------- Slide 8: Graduation and Departure ---------- */
#journey .journey-panel[data-slide-index="7"] .journey-visual-track {
  top: 118px;
  bottom: 178px;
  display: grid;
  place-items: center;
  overflow: hidden;
}

#journey .journey-panel[data-slide-index="7"] .journey-visual-item {
  position: relative;
  left: auto;
  bottom: auto;
  width: min(94%, 780px);
  height: min(100%, 410px);
  animation: earlyGradSequence var(--journey-duration) ease forwards;
}

#journey .journey-panel[data-slide-index="7"] .journey-character-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
}

#journey .journey-panel[data-slide-index="7"] .plane-svg {
  opacity: 1;
  transform: translateX(-10%);
  animation: earlyPlaneFlyOut var(--journey-duration) ease forwards;
}

#journey .journey-panel[data-slide-index="7"] .journey-visual-track::after {
  content: "Welcome to Soekarno-Hatta Airport";
  position: absolute;
  right: 28px;
  bottom: 24px;
  z-index: 20;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(8,18,38,.84);
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: .02em;
  box-shadow: 0 14px 30px rgba(15,23,42,.24);
  opacity: 0;
  animation: earlyAirportTag var(--journey-duration) linear forwards;
}

/* ---------- Slide 9: Start from zero ---------- */
#journey .journey-panel[data-slide-index="8"] .journey-notes {
  top: 130px;
  left: auto;
  right: 28px;
  width: min(46%, 560px);
  max-width: 560px;
}

/* ---------- Slide 10: Tsunami cinematic ---------- */
#journey .journey-panel[data-slide-index="9"] .journey-visual-track {
  top: 118px;
  bottom: 178px;
  display: grid;
  place-items: center;
  overflow: hidden;
}

#journey .journey-panel[data-slide-index="9"] .journey-visual-item {
  position: relative;
  left: auto;
  bottom: auto;
  width: min(96%, 820px);
  height: min(100%, 420px);
  animation: earlyTsunamiAlive 760ms ease-in-out infinite;
}

#journey .journey-panel[data-slide-index="9"] .journey-character-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  filter: contrast(1.04) saturate(.96);
}

#journey .journey-panel[data-slide-index="9"] .journey-visual-track::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 40% 34%, rgba(255,255,255,.12), transparent 30%),
    linear-gradient(180deg, rgba(15,23,42,.05), rgba(15,23,42,.30));
  pointer-events: none;
}

#journey .journey-panel[data-slide-index="9"] .early-tsunami-notes {
  left: 28px;
  right: 28px;
  width: auto;
  max-width: none;
  top: 118px;
}

#journey .journey-panel[data-slide-index="9"] .journey-note {
  background: rgba(8,18,38,.68);
  border-color: rgba(255,255,255,.16);
  box-shadow: 0 18px 44px rgba(0,0,0,.26);
}

#journey .journey-panel[data-slide-index="9"] .journey-note p {
  color: #f8fafc;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,.38);
}

/* ---------- Slide 11: Return flight opposite direction ---------- */
#journey .journey-panel[data-slide-index="10"] .journey-visual-item {
  opacity: 0;
}

#journey .journey-panel[data-slide-index="10"] .plane-svg {
  opacity: 1;
  transform: scaleX(-1);
  animation: earlyPlaneReturn var(--journey-duration) ease forwards;
}

#journey .journey-panel[data-slide-index="10"] .journey-visual-track::after {
  content: "Landing in Banda Aceh";
  position: absolute;
  left: 28px;
  bottom: 24px;
  z-index: 20;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(8,18,38,.84);
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: .02em;
  box-shadow: 0 14px 30px rgba(15,23,42,.24);
  opacity: 0;
  animation: earlyReturnTag var(--journey-duration) linear forwards;
}

#journey .journey-panel[data-slide-index="10"] .early-return-notes {
  left: 28px;
  right: 28px;
  width: auto;
  max-width: none;
  top: auto;
  bottom: 198px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}

#journey .journey-panel[data-slide-index="10"] .early-return-notes .journey-note {
  flex: 1 1 260px;
}

/* ---------- Animations ---------- */
@keyframes earlyBirthBgSpin {
  0% { transform: scale(.45) rotate(720deg); filter: blur(6px) brightness(1.12); opacity: .2; }
  65% { transform: scale(1.08) rotate(28deg); filter: blur(0) brightness(1.04); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); filter: blur(0) brightness(1); opacity: 1; }
}

@keyframes earlyTextOne {
  0%, 6% { opacity: 0; transform: translateX(-50%) translateY(10px); }
  12%, 36% { opacity: 1; transform: translateX(-50%) translateY(0); }
  42%, 100% { opacity: 0; transform: translateX(-50%) translateY(-8px); }
}

@keyframes earlyTextTwo {
  0%, 38% { opacity: 0; transform: translateX(-50%) translateY(10px); }
  44%, 76% { opacity: 1; transform: translateX(-50%) translateY(0); }
  84%, 100% { opacity: 0; transform: translateX(-50%) translateY(-8px); }
}

@keyframes earlyHeaderIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes earlyContactIn {
  from { opacity: 0; transform: scale(.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes earlyFooterIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes earlyFooterTyping {
  from { max-width: 0; }
  to { max-width: 100%; }
}

@keyframes earlyBusOne {
  0% { right: -18%; bottom: 60px; transform: scale(.78); opacity: 0; }
  14% { opacity: 1; }
  100% { right: 42%; bottom: 60px; transform: scale(1); opacity: 1; }
}

@keyframes earlyBusTwo {
  0% { left: 50%; bottom: 42px; transform: translateX(-50%) scale(.9); opacity: 0; }
  12% { opacity: 1; }
  100% { left: 30%; bottom: 30px; transform: translateX(-50%) scale(1.16); opacity: 1; }
}

@keyframes earlyUniversityNotesSwap {
  0%, 48% { left: auto; right: 28px; }
  52%, 100% { left: 28px; right: auto; }
}

@keyframes earlyGradSequence {
  0%, 22% { transform: scale(1) rotate(0deg); opacity: 1; }
  32% { transform: scale(.22) rotate(420deg); opacity: 0; }
  38% { transform: translateX(-5%) scale(.98); opacity: 1; }
  72% { transform: translateX(7%) scale(1.02); opacity: 1; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}

@keyframes earlyPlaneFlyOut {
  0%, 34% { opacity: 0; transform: translateX(-18%) translateY(18px) rotate(-4deg); }
  44% { opacity: 1; }
  78% { opacity: 1; transform: translateX(12%) translateY(-16px) rotate(-8deg); }
  100% { opacity: .65; transform: translateX(18%) translateY(-8px) rotate(-4deg); }
}

@keyframes earlyAirportTag {
  0%, 72% { opacity: 0; transform: translateY(8px); }
  80%, 100% { opacity: 1; transform: translateY(0); }
}

@keyframes earlyTsunamiAlive {
  0% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.025) translateY(-4px); }
  100% { transform: scale(1) translateY(0); }
}

@keyframes earlyPlaneReturn {
  0% { opacity: 0; transform: scaleX(-1) translateX(-20%) translateY(-12px) rotate(2deg); }
  18% { opacity: 1; }
  72% { opacity: 1; transform: scaleX(-1) translateX(16%) translateY(16px) rotate(8deg); }
  100% { opacity: .7; transform: scaleX(-1) translateX(22%) translateY(22px) rotate(8deg); }
}

@keyframes earlyReturnTag {
  0%, 70% { opacity: 0; transform: translateY(8px); }
  82%, 100% { opacity: 1; transform: translateY(0); }
}
'@

$cssCurrent = Get-Content $cssPath -Raw
if ($cssCurrent -notlike "*$cssMarker*") {
  Add-Content -Path $cssPath -Value "`r`n`r`n$cssAppend" -Encoding UTF8
  Write-Host "CSS targeted slide 1-11 ditambahkan." -ForegroundColor Green
} else {
  Write-Host "CSS marker sudah ada. Tidak ditambahkan ulang." -ForegroundColor Yellow
}

Write-Host "=== VERIFY SLIDE 12+ NOT DELETED ===" -ForegroundColor Cyan
Select-String -Path ".\src\data\journeySlides.ts" -Pattern '"h1": "January 2005"|"h1": "September 2005"|"h1": "June 2010"|"logoWall"' | Select-Object LineNumber, Line

Write-Host "=== VERIFY EARLY PATCH ===" -ForegroundColor Cyan
Select-String -Path ".\src\components\JourneySlider.tsx" -Pattern "journey-bus-duo|early-achievement-notes|early-slide" | Select-Object LineNumber, Line
Select-String -Path ".\src\data\journeySlides.ts" -Pattern '"walkStart": "0%"|"walkStart": "18%"|"walkStart": "35%"|"Born in Pidie Jaya, 5 October 1979"' | Select-Object LineNumber, Line

Write-Host "=== BUILD CHECK ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  throw "Build gagal. Backup tersedia di $backupDir"
}

Write-Host "=== START DEV SERVER ===" -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
npm run dev
