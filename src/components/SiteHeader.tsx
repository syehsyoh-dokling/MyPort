import { useEffect } from "react";
import { Download } from "lucide-react";
import { useLiveCounter } from "../hooks/useLiveCounter";
import { optimizedAssetPath } from "../utils/assetPath";
import "../styles/site-header-modern.css";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Work Experience", href: "#work-experience" },
  { label: "Managerial Experience", href: "#managerial-experience" },
  { label: "Contact", href: "#contact" }
];

const publicationItems = [
  {
    label: "Sirah",
    href: "https://sirah.danandad.org",
    icon: "/assets/publication/sirah.png"
  },
  {
    label: "Kutubooku",
    href: "https://kutubooku.danandad.com",
    icon: "/assets/publication/kutubooku.png"
  },
  {
    label: "Pikiranku",
    href: "https://pikiranku.binsaifuddin.it.com/",
    icon: "/assets/publication/pikiranku.png"
  }
];

export function SiteHeader() {
  useEffect(() => {
    const handleHeaderClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const clickable = target.closest("a,button");

      if (!(clickable instanceof HTMLElement)) return;

      const label = (clickable.textContent ?? "").trim().replace(/\s+/g, " ");

      if (label === "Home") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleHeaderClick, true);

    return () => {
      document.removeEventListener("click", handleHeaderClick, true);
    };
  }, []);

  const counter = useLiveCounter();

  return (
    <header id="top" className="modern-site-header">
      <div className="modern-header-shell">
        <a className="modern-brand" href="#top" aria-label="Go to top">
          <span className="modern-brand-photo-wrap">
            <img
              loading="lazy"
              src="/profile-photo.png"
              alt="Saifuddin Abdullah Rasyid"
              className="modern-brand-photo"
            />
          </span>

          <span className="modern-brand-copy">
            <span className="modern-brand-kicker modern-brand-kicker-hidden">ICT4D • AI Engineering • Full Stack</span>

            <strong className="modern-brand-name">
              <span>Saifuddin</span>
              <span className="modern-brand-name-gold">Bin Abdullah</span>
              <span>Rasyid</span>
            </strong>

            <span className="modern-brand-subtitle">
              <span>Experience spanning 21 years and counting.</span>
              <span>{counter}</span>
            </span>
          </span>
        </a>

        <nav className="modern-header-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="modern-nav-link">
              {item.label}
            </a>
          ))}

          <div className="modern-publication">
            <button type="button" className="modern-nav-link modern-publication-button">
              Publication
            </button>

            <div className="modern-publication-menu">
              {publicationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="modern-publication-item"
                >
                  <span className="modern-publication-icon">
                    <img
                      loading="lazy"
                      src={optimizedAssetPath(item.icon)}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          <a href="/CV_SAIFUDDIN.pdf" download className="modern-download-button">
            <Download size={16} />
            Download CV
          </a>
        </nav>
      </div>
    </header>
  );
}

