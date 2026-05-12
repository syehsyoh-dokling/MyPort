import { useEffect } from "react";
import { Download } from "lucide-react";
import { useLiveCounter } from "../hooks/useLiveCounter";

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
  /* HEADER_NAV_CAPTURE_PATCH */
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
        return;
      }

    };

    document.addEventListener("click", handleHeaderClick, true);

    return () => {
      document.removeEventListener("click", handleHeaderClick, true);
    };
  }, []);

  const counter = useLiveCounter();

  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-slate-200/70 bg-white/85 px-5 py-2.5 shadow-soft backdrop-blur">
        <div className="flex items-center gap-3">
          <img
            src="/profile-photo.png"
            alt="Saifuddin Abdullah Rasyid"
            className="h-10 w-10 rounded-lg bg-slate-100 object-contain shadow-md"
          />

          <div>
            <strong className="block text-sm font-bold text-slate-900">
              Saifuddin Abdullah Rasyid
            </strong>

            <span className="block text-xs font-medium text-slate-500">
              Experience spanning 21 years and counting.
            </span>

            <span className="block text-xs font-medium text-slate-500">
              {counter}
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-teal-50 hover:text-teal-700"
            >
              {item.label}
            </a>
          ))}

          <div className="group relative">
            <button
              type="button"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700 focus:outline-none"
              aria-haspopup="true"
            >
              Publication
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/95 p-2 opacity-0 shadow-2xl shadow-slate-900/12 backdrop-blur transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {publicationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 ring-1 ring-slate-200/80">
                    <img
                      src={item.icon}
                      alt=""
                      className="h-full w-full object-contain p-1.5"
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

          <a
            href="/CV_SAIFUDDIN.pdf"
            download
            className="ml-2 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-amber-700/20 hover:bg-amber-700"
          >
            <Download size={16} />
            Download CV
          </a>
        </nav>
      </div>
    </header>
  );
}
