import { useEffect, useMemo, useRef, useState } from "react";
import { appLogos } from "../data/appLogos";
import { journeySlides } from "../data/journeySlides";
import "../styles/journey-slider.css";

type VisibleNote = {
  id: number;
  text: string;
  exiting: boolean;
};

function getIcon(text: string) {
  const t = text.toLowerCase();

  if (/1st place|champion|award|achievement/.test(t)) return "…¸‚¢‚¬ ";
  if (/2nd place|second place/.test(t)) return "…¸‚¥‹ ";
  if (/3rd place|third place/.test(t)) return "…¸‚¥¢‚¬°";
  if (/tsunami|earthquake|disaster|emergency/.test(t)) return "…¸…… ";
  if (/communication|radio|satellite|gps|network|vpn/.test(t)) return "…¸¢‚¬“‚¡";
  if (/health|mother|newborn|referral|hiv|clinic|puskesmas|covid|vaccine/.test(t)) return "…¡¢‚¬¢‚¸‚";
  if (/system|application|database|platform|web-based|interoperability|dashboard|tool/.test(t)) return "…¸‚§‚©";
  if (/knowledge|learning|training|manual|capacity/.test(t)) return "…¸¢‚¬“‹“";
  if (/ai|model|prompt|testing|qa|reviewer|trainer/.test(t)) return "…¸‚¤¢‚¬";
  if (/governance|government|policy|roadmap|public service/.test(t)) return "…¸‚¢‚¬º‚¸‚";

  return "…‚¨";
}

function parseAchievementNote(text: string) {
  const match = text.match(/^Achievements?:\s*(.+)$/i);

  if (!match) return null;

  return {
    title: "Achievement",
    detail: match[1]
  };
}

function PlaneSvg({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <svg className="plane-svg fly" viewBox="0 0 900 420" aria-hidden="true">
      <path
        d="M60 310 C210 250 330 210 480 180 C610 150 720 135 840 118"
        fill="none"
        stroke="rgba(37,99,235,.28)"
        strokeWidth="4"
        strokeDasharray="12 14"
      />
      <g transform="translate(575 125) rotate(-12)">
        <path
          d="M0 48 L210 0 C226 -4 238 10 224 22 L150 82 L178 155 L148 164 L98 104 L42 125 L20 109 L58 78 L0 48Z"
          fill="rgba(15,23,42,.86)"
        />
        <path d="M72 70 L145 52" stroke="rgba(255,255,255,.65)" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const logoPositions = [
  [78, 10],
  [12, 18],
  [54, 28],
  [30, 62],
  [82, 72],
  [48, 10],
  [16, 78],
  [70, 48],
  [38, 35],
  [88, 36],
  [8, 46],
  [58, 70],
  [24, 8],
  [46, 52],
  [74, 22]
];

function LogoWall() {
  return (
    <div className="journey-logo-wall" aria-label="AI application logo showcase">
      {appLogos.map((logo, index) => {
        const [x, y] = logoPositions[index % logoPositions.length];
        const cycle = Math.floor(index / logoPositions.length);
        const safeY = Math.max(y, 26);

        return (
          <figure
            key={logo.src}
            className="journey-logo-orbit"
            style={{
              ["--logo-x" as string]: `${x}%`,
              ["--logo-y" as string]: `${safeY}%`,
              ["--logo-delay" as string]: `${index * 0.72 + cycle * 0.18}s`,
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

export function JourneySlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [notes, setNotes] = useState<VisibleNote[]>([]);
  const [storyExpanded, setStoryExpanded] = useState(false);
  const timers = useRef<number[]>([]);

  const slide = journeySlides[currentSlide];
  const frameCount = slide.frames?.length || 1;
  const activeFrame = slide.frames?.[frameIndex % frameCount] || slide.frames?.[0] || "";
  const showAchievementHeading = currentSlide >= 7 && currentSlide <= 23;

  const slideDuration = Math.max(900, Number(slide.duration || 2600));

  const panelStyle = useMemo(() => {
    const style: React.CSSProperties = {
      ["--journey-duration" as string]: `${slideDuration}ms`,
      ["--journey-walk-start" as string]: slide.walkStart || "4%",
      ["--journey-walk-end" as string]: slide.walkEnd || "35%",
      ["--journey-accent" as string]: slide.accent || "#2563eb",
      ["--journey-accent-soft" as string]: slide.accentSoft || "rgba(37,99,235,.15)"
    };

    if (slide.background) {
      style.backgroundImage = `linear-gradient(135deg, rgba(223,248,255,.22), rgba(231,255,246,.24)), url("${slide.background}")`;
    }

    return style;
  }, [slide, slideDuration]);

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function goTo(index: number) {
    const next = (index + journeySlides.length) % journeySlides.length;
    setCurrentSlide(next);
  }

  function nextSlide() {
    goTo(currentSlide + 1);
  }

  function previousSlide() {
    goTo(currentSlide - 1);
  }

  function restart() {
    clearTimers();
    setFrameIndex(0);
    setNotes([]);
    setCurrentSlide(0);
    setPlaying(true);
  }

  useEffect(() => {
    clearTimers();
    setFrameIndex(0);
    setNotes([]);

    const items = slide.notes || [];
    if (items.length > 0) {
            const lineDelay = slide.fastNotes ? slide.fastNoteStepMs || 1500 : 700;
      const getNoteDelay = (index: number) => {
        if (slide.fastNoteDelaysMs && slide.fastNoteDelaysMs[index] !== undefined) {
          return slide.fastNoteDelaysMs[index];
        }

        if (!slide.fastNotes) return index * lineDelay;
        if (index === 0) return 0;
        if (index === 1) return 1500;
        if (index === 2) return 3000;
        if (index === 3) return 4500;
        return index * 1500;
      };

      items.forEach((text, index) => {
        schedule(() => {
          const nextNote = {
            id: currentSlide * 100 + index,
            text,
            exiting: false
          };

          setNotes((current) => {
            if (!slide.maxVisibleNotes || current.length < slide.maxVisibleNotes) {
              return [...current, nextNote];
            }

            const [oldest, ...rest] = current;
            if (oldest) {
              schedule(() => {
                setNotes((activeNotes) => activeNotes.filter((activeNote) => activeNote.id !== oldest.id));
              }, 260);
            }

            return oldest ? [{ ...oldest, exiting: true }, ...rest, nextNote] : [...rest, nextNote];
          });
        }, getNoteDelay(index));
      });
    }
if (frameCount > 1) {
      const loops = slide.frameLoops || 1;
      const totalSteps = Math.max(frameCount * loops, frameCount);
      const frameStep = Math.max(90, Math.floor(slideDuration / totalSteps));

      for (let step = 1; step <= totalSteps; step++) {
        schedule(() => {
          setFrameIndex(step % frameCount);
        }, step * frameStep);
      }
    }

    if (playing) {
      schedule(() => {
        setCurrentSlide((value) => (value + 1) % journeySlides.length);
      }, slideDuration);
    }

    return clearTimers;
  }, [currentSlide, playing]);

  const noteStepMs = slide.fastNotes ? slide.fastNoteStepMs || 120 : 180;

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
            cross-functional teams in multi-stakeholder environments. I combine strong technical capabilities with governance
            and operational insight, along with managerial strength and effective stakeholder communication, to deliver
            solutions that are not only functional but also sustainable and impactful at scale.
          </p>
          <button
            className="journey-read-more"
            type="button"
            onClick={() => setStoryExpanded((value) => !value)}
          >
            {storyExpanded ? "Show less" : "Read more"}
          </button>

          <div className="journey-motto">
            Transforming complexity into scalable solutions with global impact.
          </div>

          <div className="journey-control-row">
            <button className="journey-nav-btn" type="button" onClick={previousSlide} aria-label="Previous slide">{"\u2039"}</button>
            <button className="journey-nav-btn" type="button" onClick={nextSlide} aria-label="Next slide">{"\u203A"}</button>

            <div className="journey-dots">
              {journeySlides.map((_, index) => (
                <button
                  key={index}
                  className={`journey-dot ${index === currentSlide ? "active" : ""}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="journey-actions-inline">
            <button className="journey-primary" type="button" onClick={() => setPlaying((value) => !value)}>
              {playing ? "†¢‚¬„¢¢‚¬ ¢š¬¢¢‚¢†¢‚¬„¢‚¢¢‚¬¡‚¬‚¡‚†¢‚¬„¢‚¢¢‚¬¡‚¬‚¡‚¸ Pause" : "†¢‚¬„¢¢‚¬ ¢š¬¢¢‚¢†¢‚¬„¢‚¢†‚¢‚¢¢‚¬¡‚¬‚¡‚¬†‚¢‚¢¢š¬…¡‚¬¢‚¬¦¢š¬…†¢‚¬„¢‚¢¢‚¬¡‚¬‚¡‚¶ Play"}
            </button>
            <button className="journey-primary" type="button" onClick={restart}>Restart</button>
          </div>

          <div className="journey-progress">
            <div key={`${currentSlide}-${playing}`} className="journey-progress-bar" />
          </div>
        </aside>

        <article
          className={`journey-panel ${slide.mode} visual-${slide.visualSide || "left"} ${slide.logoWall ? "logo-wall-panel" : ""} ${slide.staticVisual ? "static-visual" : ""} ${slide.maxVisibleNotes ? "limited-notes" : ""} ${slide.typewriterNotes ? "typewriter-notes" : ""} ${playing ? "is-playing" : "is-paused"}`}
          style={panelStyle}
        >
          {currentSlide === 0 && slide.openingIntro && (
            <div className="journey-opening-intro" aria-label="Opening narrative">
              <div className="journey-opening-intro-line journey-opening-intro-line-1">
                {slide.openingIntro[0]}
              </div>
              <div className="journey-opening-intro-line journey-opening-intro-line-2">
                {slide.openingIntro[1]}
              </div>
            </div>
          )}

          <div className="journey-code-stack">
            <div className="journey-code-year" dangerouslySetInnerHTML={{ __html: slide.h1Html || slide.h1 }} />
            {slide.h2 && <div className="journey-code-place">{slide.h2}</div>}
          </div>

          <div className="journey-visual-track">
            {showAchievementHeading && (
              <div className="journey-achievement-heading">Achievement</div>
            )}

            {slide.logoWall ? (
              <LogoWall />
            ) : (
              <>
                <div className="journey-visual-item">
                  {activeFrame && (
                    <img
                      className="journey-character-img"
                      src={activeFrame}
                      alt={slide.title || slide.h3 || slide.badge}
                      draggable={false}
                    />
                  )}
                </div>

                <PlaneSvg active={Boolean(slide.planeMode)} />
              </>
            )}

            {!slide.logoWall && notes.length > 0 && (
              <div className="journey-notes">
                {notes.map((note) => {
                  const achievement = parseAchievementNote(note.text);
                  const displayText = achievement ? achievement.detail : note.text;

                  return (
                    <div
                      key={note.id}
                      className={`journey-note ${note.exiting ? "exit" : ""}`}
                      style={{
                        animationDelay: "0ms",
                        ["--note-type-duration" as string]: `${Math.min(1500, Math.max(480, displayText.length * 18))}ms`,
                        ["--note-type-steps" as string]: Math.min(72, Math.max(12, displayText.length))
                      }}
                    >
                      <span>{getIcon(note.text)}</span>
                      <p>{displayText}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="journey-ground" />
          <div className="journey-shadow" />

          <footer className="journey-slide-footer">
            <div className="journey-footer-badge">{slide.badge}</div>
            <div className="journey-footer-meta">
              <strong>{slide.h3 || slide.title}</strong>
              {slide.h4 && <span>{slide.h4}</span>}
            </div>
            <h3>{slide.title}</h3>
            {slide.summary && <p>{slide.summary}</p>}
          </footer>
        </article>
      </div>
    </section>
  );
}

export default JourneySlider;
