# ==========================================================
# PATCH JourneySlider + Slide 1-11
# Jalankan dari root project:
#   C:\Users\Saifuddin\Desktop\MyPort
# ==========================================================

$ErrorActionPreference = "Stop"

Write-Host "=== CHECK PROJECT ROOT ===" -ForegroundColor Cyan
if (!(Test-Path ".\src\components\JourneySlider.tsx")) {
  throw "File .\src\components\JourneySlider.tsx tidak ditemukan. Jalankan script ini dari root project MyPort."
}
if (!(Test-Path ".\src\data\journeySlides.ts")) {
  throw "File .\src\data\journeySlides.ts tidak ditemukan."
}
if (!(Test-Path ".\src\styles\journey-slider.css")) {
  throw "File .\src\styles\journey-slider.css tidak ditemukan."
}

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = ".\backup_journey_slider_slide_1_11_$stamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Copy-Item ".\src\components\JourneySlider.tsx" "$backupDir\JourneySlider.tsx.bak" -Force
Copy-Item ".\src\data\journeySlides.ts" "$backupDir\journeySlides.ts.bak" -Force
Copy-Item ".\src\styles\journey-slider.css" "$backupDir\journey-slider.css.bak" -Force

Write-Host "Backup dibuat di: $backupDir" -ForegroundColor Green

Write-Host "=== REPLACE JourneySlider.tsx ===" -ForegroundColor Cyan
$journeySliderTsx = @'
import { useCallback, useEffect, useMemo, useState } from "react";
import { appLogos } from "../data/appLogos";
import { journeySlides, type JourneySlide } from "../data/journeySlides";
import "../styles/journey-slider.css";

type VisibleNote = { id: number; text: string };

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pct = (n: number) => `${n.toFixed(2)}%`;

function getIcon(text: string) {
  const t = text.toLowerCase();
  if (/1st place|champion|award|achievement/.test(t)) return "🏆";
  if (/2nd place|second place/.test(t)) return "🥈";
  if (/3rd place|third place/.test(t)) return "🥉";
  if (/tsunami|earthquake|disaster|emergency/.test(t)) return "🌊";
  if (/communication|radio|satellite|gps|network|vpn/.test(t)) return "📡";
  if (/health|mother|newborn|referral|hiv|clinic|puskesmas|covid|vaccine/.test(t)) return "🩺";
  if (/system|application|database|platform|web-based|interoperability|dashboard|tool/.test(t)) return "🧩";
  if (/knowledge|learning|training|manual|capacity/.test(t)) return "📘";
  if (/ai|model|prompt|testing|qa|reviewer|trainer/.test(t)) return "🤖";
  if (/governance|government|policy|roadmap|public service/.test(t)) return "🏛️";
  return "✨";
}

const logoPositions = [
  [78, 10], [12, 18], [54, 28], [30, 62], [82, 72],
  [48, 10], [16, 78], [70, 48], [38, 35], [88, 36],
  [8, 46], [58, 70], [24, 8], [46, 52], [74, 22]
];

function LogoWall() {
  return (
    <div className="journey-logo-wall" aria-label="AI application logo showcase">
      {appLogos.map((logo, index) => {
        const [x, y] = logoPositions[index % logoPositions.length];
        return (
          <figure
            key={logo.src}
            className="journey-logo-orbit"
            style={{
              ["--logo-x" as string]: `${x}%`,
              ["--logo-y" as string]: `${Math.max(y, 26)}%`,
              ["--logo-delay" as string]: `${index * 0.72}s`,
              ["--logo-size" as string]: `${index % 5 === 0 ? 92 : index % 3 === 0 ? 78 : 68}px`
            }}
          >
            <img src={logo.src} alt={logo.name} draggable={false} />
            <figcaption>{logo.name}</figcaption>
          </figure>
        );
      })}
      <div className="journey-logo-thankyou">Thank you</div>
    </div>
  );
}

function PlaneSvg({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg className={`plane-svg ${reverse ? "plane-return" : "plane-outbound"}`} viewBox="0 0 900 420" aria-hidden="true">
      <path
        d={reverse ? "M840 118 C720 135 610 150 480 180 C330 210 210 250 60 310" : "M60 310 C210 250 330 210 480 180 C610 150 720 135 840 118"}
        fill="none"
        stroke="rgba(37,99,235,.28)"
        strokeWidth="4"
        strokeDasharray="12 14"
      />
      <g transform={reverse ? "translate(320 215) rotate(165)" : "translate(575 125) rotate(-12)"}>
        <path
          d="M0 48 L210 0 C226 -4 238 10 224 22 L150 82 L178 155 L148 164 L98 104 L42 125 L20 109 L58 78 L0 48Z"
          fill="rgba(15,23,42,.86)"
        />
        <path d="M72 70 L145 52" stroke="rgba(255,255,255,.65)" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function useSlideClock(duration: number, playing: boolean, slideKey: number, onDone: () => void) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
  }, [slideKey]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let startedAt = 0;

    const loop = (time: number) => {
      if (!startedAt) startedAt = time;
      const nextElapsed = Math.min(duration, time - startedAt);
      setElapsed(nextElapsed);
      if (nextElapsed >= duration) {
        onDone();
        return;
      }
      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [duration, playing, slideKey, onDone]);

  return elapsed;
}

function noteDelay(slide: JourneySlide, index: number) {
  if (slide.fastNoteDelaysMs && slide.fastNoteDelaysMs[index] !== undefined) return slide.fastNoteDelaysMs[index];
  return (slide.fastNoteStepMs || 1500) * index;
}

function noteStartOffset(index: number) {
  if (index === 8) return 2600;
  if (index === 7) return 4300;
  return 500;
}

function getVisibleNotes(slide: JourneySlide, slideIndex: number, elapsed: number): VisibleNote[] {
  const items: string[] = slide.notes || [];
  const offset = noteStartOffset(slideIndex);
  return items.filter((_: string, i: number) => elapsed >= offset + noteDelay(slide, i)).map((text: string, i: number) => ({ id: slideIndex * 100 + i, text }));
}

function getFrameIndex(frameCount: number, loops: number, moveMs: number, elapsed: number) {
  if (frameCount <= 1) return 0;
  const progress = clamp(elapsed / moveMs);
  const totalFrames = frameCount * Math.max(1, loops);
  return Math.floor(progress * totalFrames) % frameCount;
}

export function JourneySlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [storyExpanded, setStoryExpanded] = useState(false);

  const slide = journeySlides[currentSlide];
  const slideDuration = slide.duration || 5000;
  const isEarly = currentSlide <= 10;

  const advanceSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % journeySlides.length);
  }, []);

  const elapsed = useSlideClock(slideDuration, playing, currentSlide, advanceSlide);

  const notes = useMemo(() => getVisibleNotes(slide, currentSlide, elapsed), [slide, currentSlide, elapsed]);

  const activeFrame = useMemo(() => {
    if (!slide.frames?.length) return "";
    switch (currentSlide) {
      case 0:
        return elapsed >= 2000 ? slide.frames[0] : "";
      case 2:
        return slide.frames[getFrameIndex(slide.frames.length, 3, 3600, elapsed)];
      case 3:
        return slide.frames[getFrameIndex(slide.frames.length, 3, 3600, elapsed)];
      case 4:
        return slide.frames[getFrameIndex(slide.frames.length, 1, 2200, elapsed)];
      case 6:
        return slide.frames[getFrameIndex(slide.frames.length, 3, 3600, elapsed)];
      case 8:
        return slide.frames[getFrameIndex(slide.frames.length, 3, 2200, elapsed)];
      case 9:
        return slide.frames[Math.floor(elapsed / 360) % Math.max(1, slide.frames.length)];
      default:
        return slide.frames[0];
    }
  }, [slide, currentSlide, elapsed]);

  const walkLeft = useMemo(() => {
    switch (currentSlide) {
      case 2:
        return pct(lerp(0, 25, clamp(elapsed / 3600)));
      case 3:
        return pct(lerp(24, 50, clamp(elapsed / 3600)));
      case 4:
        return pct(lerp(49, 70, clamp(elapsed / 2200)));
      case 6:
        return pct(lerp(0, 25, clamp(elapsed / 3600)));
      case 8:
        return pct(lerp(0, 30, clamp(elapsed / 2200)));
      default:
        return slide.walkStart || "0%";
    }
  }, [currentSlide, elapsed, slide.walkStart]);

  const notePlacementClass = useMemo(() => {
    if (currentSlide === 5) return "notes-achievement-wide";
    if (currentSlide === 6) return clamp(elapsed / 3600) < 0.5 ? "notes-right" : "notes-left";
    if (currentSlide === 9) return "notes-dramatic notes-full";
    if (currentSlide === 10) return "notes-horizontal notes-full";
    return "notes-left";
  }, [currentSlide, elapsed]);

  function goTo(index: number) {
    setCurrentSlide((index + journeySlides.length) % journeySlides.length);
  }

  function restart() {
    setCurrentSlide(0);
    setPlaying(true);
  }

  const showCodeStack = currentSlide !== 0 || elapsed >= 2500;
  const showFooter = currentSlide !== 0 || elapsed >= 2500;

  const panelStyle = useMemo(() => {
    const style: React.CSSProperties = {
      ["--journey-duration" as string]: `${slideDuration}ms`,
      ["--journey-accent" as string]: slide.accent || "#2563eb",
      ["--journey-accent-soft" as string]: slide.accentSoft || "rgba(37,99,235,.15)"
    };
    if (slide.background) {
      style.backgroundImage = `linear-gradient(135deg, rgba(223,248,255,.22), rgba(231,255,246,.24)), url("${slide.background}")`;
    }
    return style;
  }, [slide, slideDuration]);

  const renderVisual = () => {
    if (slide.logoWall) return <LogoWall />;

    if (!isEarly) {
      return (
        <>
          <div className="journey-visual-item generic-static">
            {activeFrame && <img className="journey-character-img" src={activeFrame} alt={slide.title || slide.h3 || slide.badge} draggable={false} />}
          </div>
          {slide.planeMode && <PlaneSvg />}
        </>
      );
    }

    switch (currentSlide) {
      case 0:
        return (
          <div className="journey-opening-sequence">
            <div className={`opening-line ${elapsed < 1000 ? "is-visible" : ""}`}>Once upon a time.................</div>
            <div className={`opening-line second ${elapsed >= 1000 && elapsed < 2000 ? "is-visible" : ""}`}>A boy was born in Pidie Jaya, His name........</div>
            {activeFrame && (
              <div className={`opening-portrait ${elapsed < 2500 ? "is-entering" : "is-settled"}`}>
                <img className="journey-character-img" src={activeFrame} alt={slide.title} draggable={false} />
              </div>
            )}
          </div>
        );
      case 1: {
        const p1 = clamp(elapsed / 2100);
        const p2 = clamp((elapsed - 1600) / 1900);
        return (
          <div className="journey-bus-stage" aria-hidden="true">
            <img src={slide.frames[0]} alt="" className="journey-bus-image bus-a" style={{ left: pct(lerp(-28, 26, p1)), transform: `scale(${lerp(0.84, 1, p1)})` }} />
            <img src={slide.frames[1]} alt="" className="journey-bus-image bus-b" style={{ left: pct(lerp(18, 56, p2)), transform: `scale(${lerp(0.68, 1.12, p2)})` }} />
          </div>
        );
      }
      case 2:
      case 3:
      case 4:
      case 6:
      case 8:
        return (
          <div className={`journey-visual-item walk-actor slide-${currentSlide + 1}`} style={{ left: walkLeft }}>
            {activeFrame && <img className="journey-character-img" src={activeFrame} alt={slide.title || slide.h3 || slide.badge} draggable={false} />}
          </div>
        );
      case 7: {
        const stage = elapsed < 1400 ? "grad" : elapsed < 2300 ? "spin-out" : elapsed < 4300 ? "flight" : "arrival";
        return (
          <div className="journey-fullscreen-visual graduation-sequence">
            {stage !== "flight" && stage !== "arrival" && <img className={`journey-fullscreen-img graduation-frame ${stage}`} src={slide.frames[0]} alt={slide.title} />}
            {(stage === "flight" || stage === "arrival") && <img className={`journey-fullscreen-img flight-frame ${stage}`} src={stage === "arrival" ? slide.frames[2] || slide.frames[1] : slide.frames[1]} alt={slide.title} />}
            {(stage === "flight" || stage === "arrival") && <PlaneSvg />}
            {stage === "arrival" && <div className="journey-airport-tag">Welcome to Soekarno-Hatta Airport</div>}
          </div>
        );
      }
      case 9:
        return (
          <div className="journey-fullscreen-visual tsunami-sequence">
            {activeFrame && <img className="journey-fullscreen-img tsunami-frame" src={activeFrame} alt={slide.title} draggable={false} />}
            <div className="tsunami-overlay" />
          </div>
        );
      case 10: {
        const planeProgress = clamp(elapsed / 3400);
        return (
          <div className="journey-fullscreen-visual return-flight-sequence">
            <PlaneSvg reverse />
            <div className="return-plane" style={{ right: pct(lerp(-15, 62, planeProgress)), bottom: `${lerp(46, 12, planeProgress)}%` }}>
              ✈️
            </div>
            <div className="journey-airport-tag banda">Landing in Banda Aceh</div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <section id="journey" className="journey-section">
      <div className="journey-grid">
        <aside className="journey-story">
          <p className="journey-eyebrow">My Life Journey</p>
          <p className={`journey-story-text ${storyExpanded ? "expanded" : ""}`}>
            An ICT4D professional with over 21 years of experience leading digital system development across government,
            NGOs, international programs, as well as national and local initiatives. My core strength lies in transforming
            complex real-world problems into scalable, standardized solutions. Notably, I have contributed to advancing AI
            development and training, as well as building web-based systems and applications that improve quality of life and
            empower communities. I have extensive experience in system architecture, API design, data integration, and leading
            cross-functional teams in multi-stakeholder environments.
          </p>
          <button className="journey-read-more" type="button" onClick={() => setStoryExpanded((value) => !value)}>
            {storyExpanded ? "Show less" : "Read more"}
          </button>

          <div className="journey-motto">Transforming complexity into scalable solutions with global impact.</div>

          <div className="journey-control-row">
            <button className="journey-nav-btn" type="button" onClick={() => goTo(currentSlide - 1)} aria-label="Previous slide">‹</button>
            <button className="journey-nav-btn" type="button" onClick={() => goTo(currentSlide + 1)} aria-label="Next slide">›</button>
            <div className="journey-dots">
              {journeySlides.map((_, index) => (
                <button key={index} className={`journey-dot ${index === currentSlide ? "active" : ""}`} type="button" onClick={() => goTo(index)} aria-label={`Go to slide ${index + 1}`} />
              ))}
            </div>
          </div>

          <div className="journey-actions-inline">
            <button className="journey-primary" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "⏸ Pause" : "▶ Play"}</button>
            <button className="journey-primary" type="button" onClick={restart}>↻ Restart</button>
          </div>

          <div className="journey-progress"><div key={`${currentSlide}-${playing}`} className="journey-progress-bar" /></div>
        </aside>

        <article className={`journey-panel ${slide.mode} slide-${currentSlide + 1} ${playing ? "is-playing" : "is-paused"}`} style={panelStyle} data-slide-index={currentSlide}>
          {showCodeStack && (
            <div className={`journey-code-stack ${currentSlide === 0 ? "opening-code-stack" : ""}`}>
              <div className="journey-code-year" dangerouslySetInnerHTML={{ __html: slide.h1Html || slide.h1 }} />
              {slide.h2 && <div className="journey-code-place">{slide.h2}</div>}
            </div>
          )}

          <div className="journey-visual-track">{renderVisual()}</div>

          {!slide.logoWall && notes.length > 0 && (
            <div className={`journey-notes ${notePlacementClass}`}>
              {notes.map((note) => (
                <div key={note.id} className="journey-note">
                  <span>{getIcon(note.text)}</span>
                  <p>{note.text}</p>
                </div>
              ))}
            </div>
          )}

          {currentSlide >= 2 && currentSlide <= 8 && <div className="journey-ground" />}
          {currentSlide >= 2 && currentSlide <= 8 && <div className="journey-shadow" style={{ left: walkLeft }} />}

          {showFooter && (
            <footer className={`journey-slide-footer ${currentSlide === 0 ? "journey-slide-footer--typing" : ""}`}>
              <div className="journey-footer-badge">{slide.badge}</div>
              <div className="journey-footer-meta">
                <strong>{slide.h3 || slide.title}</strong>
                {slide.h4 && <span>{slide.h4}</span>}
              </div>
              <h3>{slide.title}</h3>
              <p>{slide.summary}</p>
            </footer>
          )}
        </article>
      </div>
    </section>
  );
}

export default JourneySlider;

'@

Set-Content -Path ".\src\components\JourneySlider.tsx" -Value $journeySliderTsx -Encoding UTF8

Write-Host "=== PATCH journeySlides.ts: replace slide 1-11 only ===" -ForegroundColor Cyan
$nodePatch = @'
const fs = require("fs");
const path = "src/data/journeySlides.ts";
let text = fs.readFileSync(path, "utf8");

const newSlides = `
    {
        "mode": "opening",
        "duration": 6500,
        "badge": "Born in Pidie Jaya, 5 October 1979",
        "h1": "Saifuddin Bin Abdullah Bin Rasyid",
        "h2": "",
        "h3": "Saifuddin Bin Abdullah Bin Rasyid, born to be legend for architecting intelligence platform and innovation.",
        "h4": "",
        "title": "Born in Pidie Jaya",
        "summary": "Saifuddin Bin Abdullah Bin Rasyid, born to be legend for architecting intelligence platform and innovation.",
        "background": "/assets/slide-1/background.png",
        "frames": [
            "/assets/slide-1/frame-1.png"
        ],
        "footerLayout": "single",
        "accent": "#0ea5e9",
        "accentSoft": "rgba(14,165,233,.16)"
    },
    {
        "mode": "bus",
        "duration": 5200,
        "badge": "New Place, New Hope, New Future",
        "h1": "1981",
        "h2": "The family moved to Sabang",
        "h3": "New Place, New Hope, New Future",
        "h4": "",
        "title": "New Place, New Hope, New Future",
        "summary": "The family moved to Sabang, opening a new chapter of childhood, school life, and personal growth.",
        "frames": [
            "/assets/slide-1/frame-1.png",
            "/assets/slide-1/frame-3.png"
        ],
        "footerLayout": "single",
        "accent": "#2563eb",
        "accentSoft": "rgba(37,99,235,.14)"
    },
    {
        "mode": "walk",
        "duration": 4200,
        "badge": "Active in school activities, including Little Doctor and student competitions",
        "h1": "1985",
        "h2": "SD Negeri Batee Shok",
        "h3": "Active in school activities, including Little Doctor and student competitions",
        "h4": "",
        "title": "Active in school activities, including Little Doctor and student competitions",
        "summary": "School was not only about lessons; it was also about confidence, curiosity, and early participation in student activities.",
        "frames": [
            "/assets/slide-2/frame-1.png",
            "/assets/slide-2/frame-2.png",
            "/assets/slide-2/frame-3.png",
            "/assets/slide-2/frame-4.png"
        ],
        "footerLayout": "single",
        "accent": "#16a085",
        "accentSoft": "rgba(22,160,133,.15)",
        "frameLoops": 3,
        "walkStart": "0%",
        "walkEnd": "25%",
        "walkSegments": [
            { "from": "0%", "to": "25%" }
        ],
        "notes": []
    },
    {
        "mode": "walk",
        "duration": 4200,
        "badge": "Engaged in many student competitions and academic activities",
        "h1": "1991",
        "h2": "SMP Negeri 1 Kota Sabang",
        "h3": "Engaged in many student competitions and academic activities",
        "h4": "",
        "title": "Engaged in many student competitions and academic activities",
        "summary": "Junior high school became a place to sharpen discipline, academic courage, and teamwork through many school activities.",
        "frames": [
            "/assets/slide-3/frame-1.png",
            "/assets/slide-3/frame-2.png",
            "/assets/slide-3/frame-3.png",
            "/assets/slide-3/frame-4.png"
        ],
        "footerLayout": "single",
        "accent": "#0c8bd8",
        "accentSoft": "rgba(12,139,216,.15)",
        "frameLoops": 3,
        "walkStart": "24%",
        "walkEnd": "50%",
        "walkSegments": [
            { "from": "24%", "to": "50%" }
        ],
        "notes": []
    },
    {
        "mode": "walk",
        "duration": 3000,
        "badge": "Multiple achievements and school awards",
        "h1": "1994",
        "h2": "SMU Negeri 1 Kota Sabang",
        "h3": "Multiple achievements and school awards",
        "h4": "",
        "title": "Multiple achievements and school awards",
        "summary": "This period strengthened talent, discipline, and the courage to compete beyond the classroom.",
        "frames": [
            "/assets/slide-3b/frame-1.png",
            "/assets/slide-3b/frame-2.png",
            "/assets/slide-3b/frame-3.png",
            "/assets/slide-3b/frame-4.png"
        ],
        "footerLayout": "single",
        "accent": "#7b57d1",
        "accentSoft": "rgba(123,87,209,.15)",
        "frameLoops": 1,
        "walkStart": "49%",
        "walkEnd": "70%",
        "walkSegments": [
            { "from": "49%", "to": "70%" }
        ],
        "notes": []
    },
    {
        "mode": "achievement",
        "duration": 11000,
        "badge": "Leadership, scientific curiosity, and student achievements",
        "h1": "1994",
        "h2": "SMU Negeri 1 Sabang City",
        "h3": "Leadership, scientific curiosity, and student achievements.",
        "h4": "Achievements became a bridge from talent to confidence.",
        "title": "Leadership, scientific curiosity, and student achievements.",
        "summary": "The achievement stage highlights early leadership, scientific writing, public speaking, and competitive growth.",
        "frames": [
            "/assets/slide-3c/standing.png"
        ],
        "footerLayout": "single",
        "accent": "#7b57d1",
        "accentSoft": "rgba(123,87,209,.15)",
        "rollingNotes": true,
        "noteWindow": 99,
        "fastNotes": true,
        "fastNoteDelaysMs": [0, 1500, 3000, 4500, 6000],
        "fastAfterLastMs": 2500,
        "notes": [
            "1st place, P4 Speech Competition, Sabang City (1995)",
            "1st place, Scientific Writing Competition, Sabang City (1996)",
            "School-level leadership and organizational experience",
            "Built early confidence in public speaking and scientific thinking",
            "Learned that achievement grows through discipline, practice, and courage"
        ]
    },
    {
        "mode": "walk",
        "duration": 10000,
        "badge": "University Years",
        "h1": "1997",
        "h2": "Faculty of Engineering, Syiah Kuala University",
        "h3": "University life expanded the horizon.",
        "h4": "Learning, leadership, and competition became part of the same journey.",
        "title": "University life expanded the horizon.",
        "summary": "The university years shaped technical thinking, leadership capacity, and the habit of turning ideas into structured work.",
        "frames": [
            "/assets/slide-4a/frame-1.png",
            "/assets/slide-4a/frame-2.png",
            "/assets/slide-4a/frame-3.png",
            "/assets/slide-4a/frame-4.png",
            "/assets/slide-4a/frame-5.png",
            "/assets/slide-4a/frame-6.png"
        ],
        "footerLayout": "single",
        "accent": "#16a085",
        "accentSoft": "rgba(22,160,133,.15)",
        "frameLoops": 3,
        "walkStart": "0%",
        "walkEnd": "25%",
        "walkSegments": [
            { "from": "0%", "to": "25%" }
        ],
        "rollingNotes": true,
        "noteWindow": 99,
        "fastNotes": true,
        "fastNoteDelaysMs": [0, 1500, 3000, 4500, 6000],
        "fastAfterLastMs": 2500,
        "notes": [
            "2nd place, University Student Scientific Writing Competition (1998)",
            "1st place, University Student Scientific Writing Competition (1999)",
            "5th place, National Student Scientific Writing Competition (1999)",
            "1st place, Faculty of Engineering Lustrum Scientific Writing Competition (2000)",
            "Campus life strengthened leadership, writing, and technical confidence"
        ]
    },
    {
        "mode": "plane",
        "duration": 7600,
        "badge": "Ready to Fight in Greater Jakarta",
        "h1": "2003",
        "h2": "Bachelor Graduation & Departure",
        "h3": "Ready to Fight in Greater Jakarta",
        "h4": "",
        "title": "Ready to Fight in Greater Jakarta",
        "summary": "After graduation, the journey moved toward Greater Jakarta with hope, courage, and the willingness to start a new professional chapter.",
        "frames": [
            "/assets/slide-6/frame-1.png",
            "/assets/slide-6/frame-2.png",
            "/assets/slide-6/frame-3.png"
        ],
        "footerLayout": "single",
        "accent": "#0284c7",
        "accentSoft": "rgba(2,132,199,.15)",
        "rollingNotes": true,
        "noteWindow": 9999,
        "notes": [
            "Bachelor graduation marked the beginning of a larger professional journey.",
            "Departure to Greater Jakarta opened a new chapter of work, courage, and adaptation."
        ],
        "planeMode": true,
        "fastNotes": true,
        "fastNoteStepMs": 1500,
        "fastAfterLastMs": 900,
        "fastNoteDelaysMs": [4500, 6000]
    },
    {
        "mode": "walk",
        "duration": 8000,
        "badge": "Start From Zero",
        "h1": "2003",
        "h2": "Cilegon, Banten, Indonesia",
        "h3": "Starting from Zero",
        "h4": "",
        "title": "Starting from Zero",
        "summary": "The first professional steps were full of uncertainty, but every step built discipline, survival, and resilience.",
        "frames": [
            "/assets/slide-7/frame-1.png",
            "/assets/slide-7/frame-2.png",
            "/assets/slide-7/frame-3.png",
            "/assets/slide-7/frame-4.png"
        ],
        "footerLayout": "single",
        "accent": "#f97316",
        "accentSoft": "rgba(249,115,22,.16)",
        "frameLoops": 3,
        "walkStart": "0%",
        "walkEnd": "30%",
        "walkSegments": [
            { "from": "0%", "to": "30%" }
        ],
        "rollingNotes": true,
        "noteWindow": 9999,
        "notes": [
            "Started from zero in a new place.",
            "Built resilience through early work, uncertainty, and real-world learning.",
            "Every first step became part of the professional foundation."
        ],
        "fastNotes": true,
        "fastNoteStepMs": 1500,
        "fastAfterLastMs": 1200,
        "fastNoteDelaysMs": [0, 1400, 3000]
    },
    {
        "mode": "scene",
        "duration": 7000,
        "badge": "Aceh Earthquake & Tsunami",
        "h1": "26 December 2004",
        "h2": "Aceh Province, Indonesia",
        "h3": "The earthquake and tsunami changed everything",
        "h4": "",
        "title": "The earthquake and tsunami changed everything",
        "summary": "The tsunami changed life forever and became the turning point toward emergency response, recovery work, and public service.",
        "frames": [
            "/assets/slide-8/frame-1.png",
            "/assets/slide-8/frame-2.png",
            "/assets/slide-8/frame-3.png",
            "/assets/slide-8/frame-4.png"
        ],
        "footerLayout": "single",
        "accent": "#0f172a",
        "accentSoft": "rgba(15,23,42,.16)",
        "rollingNotes": true,
        "noteWindow": 9999,
        "notes": [
            "The earthquake and tsunami changed everything.",
            "The disaster became the turning point toward emergency response and recovery work.",
            "A new professional chapter began in Aceh."
        ],
        "fastNotes": true,
        "fastNoteStepMs": 1500,
        "fastAfterLastMs": 1200,
        "fastNoteDelaysMs": [500, 2200, 4000]
    },
    {
        "mode": "plane",
        "duration": 6500,
        "badge": "Returning home to make sure his family was safe",
        "h1": "December 2004",
        "h2": "Flight Back to Aceh",
        "h3": "Returning home to make sure his family was safe",
        "h4": "",
        "title": "Returning home to make sure his family was safe",
        "summary": "The journey home was filled with fear, prayer, and uncertainty after the disaster.",
        "frames": [
            "/assets/slide-7/frame-4.png"
        ],
        "footerLayout": "single",
        "accent": "#334155",
        "accentSoft": "rgba(51,65,85,.16)",
        "rollingNotes": true,
        "noteWindow": 9999,
        "notes": [
            "Returned home to make sure family members were safe.",
            "The flight back carried fear, prayer, and uncertainty.",
            "Family safety came first; service followed."
        ],
        "planeMode": true,
        "fastNotes": true,
        "fastNoteStepMs": 1500,
        "fastAfterLastMs": 900,
        "fastNoteDelaysMs": [500, 2200, 4200]
    }`;

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
  let lastEnd = -1;

  for (; i < s.length; i++) {
    const ch = s[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quote) {
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
        lastEnd = i + 1;
        if (found === count) {
          let end = lastEnd;
          while (end < s.length && /[\s\r\n,]/.test(s[end])) end++;
          return { start: objStart, end };
        }
      }
    }
  }

  throw new Error(`Gagal menemukan ${count} objek slide pertama.`);
}

const arrStart = findArrayStart(text);
const range = findFirstNObjectsRange(text, arrStart, 11);
text = text.slice(0, range.start) + newSlides + "\n" + text.slice(range.end);
fs.writeFileSync(path, text, "utf8");
console.log("OK: slide 1-11 di journeySlides.ts sudah diganti. Slide 12 dst tetap dipertahankan.");
'@

$nodePatchPath = ".\patch_journey_slides_1_11_tmp.cjs"
Set-Content -Path $nodePatchPath -Value $nodePatch -Encoding UTF8
node $nodePatchPath
Remove-Item $nodePatchPath -Force

Write-Host "=== APPEND CSS OVERRIDE ===" -ForegroundColor Cyan
$cssPath = ".\src\styles\journey-slider.css"
$cssMarker = "SLIDES 1–11 CLEAN OVERRIDE"
$cssAppend = @'
/* ==========================================================
   SLIDES 1–11 CLEAN OVERRIDE
   Generated by patch_journey_slider_slides_1_11.ps1
   ========================================================== */

.journey-panel.slide-1 .journey-visual-track {
  top: 96px;
  bottom: 186px;
}

.journey-opening-sequence {
  position: absolute;
  inset: 0;
}

.opening-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: min(82%, 760px);
  text-align: center;
  font-size: clamp(22px, 3vw, 36px);
  line-height: 1.25;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 10px 30px rgba(0, 0, 0, .35);
  opacity: 0;
}

.opening-line.is-visible {
  opacity: 1;
  animation: openingFadeIn .35s ease forwards;
}

.opening-line.second {
  top: 20%;
}

.journey-panel.slide-1 .opening-line:not(.second) {
  top: 12%;
}

.opening-portrait {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.opening-portrait img {
  width: min(82%, 620px);
  height: min(100%, 360px);
  object-fit: contain;
  object-position: center center;
}

.opening-portrait.is-entering {
  animation: openingSpinSettle .5s ease forwards;
}

.opening-portrait.is-settled {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.opening-code-stack {
  animation: journeyCodeStackIn .55s ease forwards;
}

.journey-slide-footer--typing .journey-footer-badge,
.journey-slide-footer--typing p {
  overflow: hidden;
  white-space: nowrap;
  animation: footerTypeIn 1.8s steps(42, end) forwards;
}

.journey-bus-stage {
  position: absolute;
  inset: 0;
}

.journey-bus-image {
  position: absolute;
  bottom: 42px;
  width: min(36vw, 360px);
  height: auto;
  object-fit: contain;
  transform-origin: center bottom;
  filter: drop-shadow(0 14px 22px rgba(0,0,0,.18));
}

.journey-bus-image.bus-b {
  width: min(32vw, 320px);
  bottom: 30px;
}

.walk-actor {
  bottom: 72px;
  width: 221px;
  height: 293px;
}

.slide-7.walk-actor,
.journey-panel.slide-7 .walk-actor {
  width: 240px;
  height: 320px;
}

.generic-static {
  left: 50% !important;
  bottom: 30px !important;
  transform: translateX(-50%);
}

.journey-fullscreen-visual {
  position: absolute;
  inset: 6px 18px 186px;
  display: grid;
  place-items: center;
  overflow: hidden;
  z-index: 5;
}

.journey-fullscreen-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
}

.graduation-frame.spin-out {
  animation: spinFadeOut .9s ease forwards;
}

.flight-frame.flight {
  animation: flightPan 2.2s ease forwards;
}

.flight-frame.arrival {
  animation: arrivalSettle 1.1s ease forwards;
}

.journey-airport-tag {
  position: absolute;
  right: 24px;
  bottom: 18px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(8,18,38,.82);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 12px 26px rgba(0,0,0,.2);
}

.journey-airport-tag.banda {
  right: auto;
  left: 24px;
}

.tsunami-frame {
  animation: tsunamiPulse .65s ease-in-out infinite;
}

.tsunami-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 40% 38%, rgba(255,255,255,.12), transparent 28%),
    linear-gradient(180deg, rgba(15,23,42,.12), rgba(15,23,42,.34));
  mix-blend-mode: screen;
  pointer-events: none;
}

.return-plane {
  position: absolute;
  font-size: 54px;
  line-height: 1;
  filter: drop-shadow(0 12px 18px rgba(0,0,0,.24));
  z-index: 7;
}

.notes-left {
  left: 28px;
  right: auto;
  width: min(46%, 560px);
  max-width: 560px;
}

.notes-right {
  right: 28px;
  left: auto;
  width: min(46%, 560px);
  max-width: 560px;
}

.notes-full {
  left: 28px;
  right: 28px;
  width: auto;
  max-width: none;
}

.notes-achievement-wide {
  left: 28px;
  width: min(58%, 720px);
  max-width: 720px;
}

.journey-panel.slide-6 .journey-visual-item {
  left: 76%;
  bottom: 134px;
  width: 290px;
  height: 360px;
  transform: translateX(-50%);
}

.journey-panel.slide-6 .journey-character-img {
  width: 290px;
  height: 360px;
}

.notes-dramatic .journey-note {
  background: rgba(8,18,38,.64);
  border-color: rgba(255,255,255,.12);
  box-shadow: 0 18px 42px rgba(0,0,0,.22);
}

.notes-dramatic .journey-note p {
  color: #f8fafc;
  text-shadow: 0 2px 10px rgba(0,0,0,.32);
  font-weight: 600;
}

.notes-horizontal {
  top: auto;
  bottom: 198px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}

.notes-horizontal .journey-note {
  flex: 1 1 280px;
}

@keyframes openingFadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes openingSpinSettle {
  0%   { opacity: 0; transform: scale(.35) rotate(600deg); filter: blur(4px); }
  70%  { opacity: 1; transform: scale(1.06) rotate(24deg); filter: blur(0); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes footerTypeIn {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes spinFadeOut {
  0%   { opacity: 1; transform: scale(1) rotate(0deg); }
  100% { opacity: 0; transform: scale(.25) rotate(360deg); }
}

@keyframes flightPan {
  0%   { transform: translateX(-6%) translateY(4%) scale(.98); }
  100% { transform: translateX(8%) translateY(-2%) scale(1.02); }
}

@keyframes arrivalSettle {
  0%   { opacity: .2; transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes tsunamiPulse {
  0%   { transform: scale(1) translateY(0); }
  50%  { transform: scale(1.02) translateY(-4px); }
  100% { transform: scale(1) translateY(0); }
}
'@

$cssCurrent = Get-Content $cssPath -Raw
if ($cssCurrent -notlike "*$cssMarker*") {
  Add-Content -Path $cssPath -Value "`r`n`r`n$cssAppend" -Encoding UTF8
  Write-Host "CSS override ditambahkan." -ForegroundColor Green
} else {
  Write-Host "CSS override sudah ada, tidak ditambahkan ulang." -ForegroundColor Yellow
}

Write-Host "=== QUICK VERIFY ===" -ForegroundColor Cyan
Select-String -Path ".\src\components\JourneySlider.tsx" -Pattern "useSlideClock|journey-bus-stage|return-flight-sequence" | Select-Object LineNumber, Line
Select-String -Path ".\src\data\journeySlides.ts" -Pattern '"duration": 6500|"walkEnd": "25%"|"walkEnd": "70%"|"fastAfterLastMs": 2500' | Select-Object LineNumber, Line

Write-Host "=== BUILD CHECK ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  throw "Build gagal. Cek error di atas. Backup tersedia di $backupDir"
}

Write-Host "=== START DEV SERVER ===" -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
npm run dev
