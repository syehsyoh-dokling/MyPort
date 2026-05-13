import { CSSProperties, useEffect, useMemo, useState } from "react";
import { optimizedAssetPath } from "../utils/assetPath";
import "../styles/experience-logo-section.css";

type ProjectItem = {
  src: string;
  code: string;
  period: string;
  description: string;
};

type OrgItem = {
  src: string;
  label: string;
  detail: string;
};

const projectItems: ProjectItem[] = [
  { src: "/assets/Logo-proyek/Epic.png", code: "EpiC / EPIC", period: "2021-2025", description: "Supported HIV epidemic control and continuity of essential health services for key populations." },
  { src: "/assets/Logo-proyek/LINKAGES.png", code: "LINKAGES", period: "2016-2021", description: "Strengthened HIV services for key populations across prevention, testing, treatment, care, and retention." },
  { src: "/assets/Logo-proyek/SIAP.png", code: "USAID-SIAP / SIAP-1", period: "2012-2016", description: "Strengthened integrity, accountability, and governance systems within Indonesian public institutions." },
  { src: "/assets/Logo-proyek/RTRC.png", code: "RTRC", period: "2013-2015", description: "Supported bureaucratic reform, institutional strengthening, and governance improvement in Indonesia." },
  { src: "/assets/Logo-proyek/IKAT US.png", code: "IKAT-US", period: "2012-2013", description: "Built civil society networks, knowledge exchange, and innovation through regional collaboration." },
  { src: "/assets/Logo-proyek/EMAS.png", code: "USAID-EMAS", period: "2011", description: "Strengthened emergency obstetric and neonatal care and referral systems to improve maternal and newborn survival." },
  { src: "/assets/Logo-proyek/PPSP.png", code: "PPSP", period: "2010", description: "Accelerated local sanitation planning and sustainable settlement sanitation development in Indonesia." },
  { src: "/assets/Logo-proyek/LGSP.png", code: "USAID-LGSP", period: "2005-2009", description: "Supported participatory, effective, and accountable local governance and decentralization in Indonesia." },
  { src: "/assets/Logo-proyek/TERP.png", code: "TERP", period: "2005-2007", description: "Supported post-tsunami public health recovery, emergency response, surveillance, and health service restoration in Aceh." }
];

const organizationItems: OrgItem[] = [
  { src: "/assets/logo-organisasi/RTI.png", label: "RTI International", detail: "Project Staff - 2005-2009, 2011" },
  { src: "/assets/logo-organisasi/MSI.png", label: "Management Systems International (MSI)", detail: "Consultant - 2012-2013, 2016" },
  { src: "/assets/logo-organisasi/PGR.jpg", label: "Kemitraan / The Partnership for Governance Reform", detail: "Project Staff - 2014, 2015" },
  { src: "/assets/logo-organisasi/ombudsman.png", label: "Ombudsman", detail: "Consultant - 2014" },
  { src: "/assets/logo-organisasi/FHI.png", label: "FHI 360", detail: "Permanent Staff - 2016-2025" },
  { src: "/assets/logo-organisasi/NIPA.png", label: "NIPA Korea", detail: "Consultant - 2022-2024" },
  { src: "/assets/logo-organisasi/aligneer.png", label: "Alignerr", detail: "AI Trainer / Tester / Reviewer - Now" },
  { src: "/assets/logo-organisasi/WHO.jpg", label: "World Health Organization (WHO)", detail: "Project Staff - 2005" },
  { src: "/assets/logo-organisasi/Test IO.png", label: "Test IO", detail: "Freelancer - Quality Control - Now" },
  { src: "/assets/logo-organisasi/outlier.jpg", label: "Outlier", detail: "AI Trainer / Tester / Reviewer - Now" },
  { src: "/assets/logo-organisasi/KIP.jpg", label: "Komisi Informasi Pusat", detail: "Consultant - 2014" },
  { src: "/assets/logo-organisasi/PANRB.png", label: "Kementerian PANRB", detail: "Consultant - 2013-2014" },
  { src: "/assets/logo-organisasi/AUSAID.png", label: "Ausaid", detail: "Project owner or implementing organization" },
  { src: "/assets/logo-organisasi/DFAT.png", label: "Dfat", detail: "Project owner or implementing organization" },
  { src: "/assets/logo-organisasi/kemkes.png", label: "Kemkes", detail: "Project owner or implementing organization" },
  { src: "/assets/logo-organisasi/pepfar.png", label: "Pepfar", detail: "Project owner or implementing organization" },
  { src: "/assets/logo-organisasi/SME.png", label: "Sme", detail: "Project owner or implementing organization" },
  { src: "/assets/logo-organisasi/Testerwork.png", label: "Testerwork", detail: "Project owner or implementing organization" },
  { src: "/assets/logo-organisasi/USAID.png", label: "USAID", detail: "Project owner or implementing organization" }
];

function chunkArray<T>(items: T[], size: number) {
  const output: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }

  return output;
}

function getYearsSince(startDateString: string) {
  const start = new Date(startDateString);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();

  const hasPassedAnniversary =
    now.getMonth() > start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() >= start.getDate());

  if (!hasPassedAnniversary) years -= 1;

  return Math.max(years, 0);
}

function ProjectIcon() {
  return (
    <svg viewBox="0 0 64 64" className="exp-svg-icon" aria-hidden="true">
      <rect x="10" y="18" width="44" height="30" rx="8" fill="#F8D45A" />
      <path d="M10 24h44" stroke="#D4A62A" strokeWidth="3" />
      <path d="M18 15h14a6 6 0 0 1 5 2.8l1.6 2.2H18a5 5 0 0 1-5-5z" fill="#F4C63D" />
      <rect x="16" y="12" width="12" height="4" rx="2" fill="#22C55E" />
      <rect x="31" y="12" width="10" height="4" rx="2" fill="#60A5FA" />
      <rect x="43" y="12" width="6" height="4" rx="2" fill="#FB7185" />
    </svg>
  );
}

function OrganizationIcon() {
  return (
    <svg viewBox="0 0 64 64" className="exp-svg-icon" aria-hidden="true">
      <rect x="14" y="14" width="36" height="38" rx="6" fill="#8CB4FF" />
      <rect x="22" y="22" width="6" height="6" rx="1.5" fill="#EAF2FF" />
      <rect x="36" y="22" width="6" height="6" rx="1.5" fill="#EAF2FF" />
      <rect x="22" y="32" width="6" height="6" rx="1.5" fill="#EAF2FF" />
      <rect x="36" y="32" width="6" height="6" rx="1.5" fill="#EAF2FF" />
      <rect x="28" y="42" width="8" height="10" rx="2" fill="#3C5A99" />
      <rect x="10" y="50" width="44" height="4" rx="2" fill="#A46A2A" />
    </svg>
  );
}

export function ExperienceLogoSection() {
  const projectList = useMemo(() => {
    return projectItems.length ? [...projectItems, ...projectItems] : [];
  }, []);

  const organizationPages = useMemo(() => {
    const pages = chunkArray(organizationItems, 6);
    return pages.length ? pages : [[]];
  }, []);

  const [orgPage, setOrgPage] = useState(0);

  useEffect(() => {
    if (organizationPages.length <= 1) return;

    const timer = window.setInterval(() => {
      setOrgPage((prev) => (prev + 1) % organizationPages.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [organizationPages.length]);

  const projectCount = projectItems.length;
  const experienceYears = getYearsSince("2005-01-01");

  const projectScrollerStyle = {
    "--scroll-distance": `${Math.max(projectItems.length, 1) * 128}px`,
    animationDuration: `${Math.max(projectItems.length * 3.2, 22)}s`
  } as CSSProperties;

  return (
    <section id="experience-logos" className="mx-auto max-w-7xl px-5 py-4">
      <div className="exp-logo-grid">
        <article className="exp-card">
          <div className="exp-card-header">
            <div className="exp-card-icon exp-card-icon--teal">
              <ProjectIcon />
            </div>

            <div className="exp-card-header-copy">
              <h3 className="exp-card-title exp-card-title--teal">
                Project Handling Experience
              </h3>

              <p className="exp-card-subtitle">
                Involved in {projectCount} {projectCount === 1 ? "project" : "projects"} in {experienceYears} years of experience.
              </p>
            </div>
          </div>

          <div className="exp-project-window">
            <div className="exp-project-track" style={projectScrollerStyle}>
              {projectList.map((item, index) => (
                <div className="exp-project-row" key={`${item.code}-${index}`}>
                  <div className="exp-project-logoWrap">
                    <img loading="lazy" decoding="async" src={optimizedAssetPath(item.src)} alt={item.code} className="exp-project-logo" />
                  </div>

                  <div className="exp-project-meta">
                    <div className="exp-project-head">
                      <span className="exp-project-code">{item.code}</span>
                      {item.period ? <span className="exp-year-pill">{item.period}</span> : null}
                    </div>

                    <p className="exp-project-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="exp-card">
          <div className="exp-card-header">
            <div className="exp-card-icon exp-card-icon--amber">
              <OrganizationIcon />
            </div>

            <div className="exp-card-header-copy">
              <h3 className="exp-card-title exp-card-title--amber">
                Organizational Track Record
              </h3>

              <p className="exp-card-subtitle">
                List of project owners or implementing organizations
              </p>
            </div>
          </div>

          <div className="exp-org-stage">
            {organizationPages.map((page, pageIndex) => (
              <div
                key={pageIndex}
                className={`exp-org-page ${pageIndex === orgPage ? "is-active" : ""}`}
              >
                {page.map((item, index) => (
                  <div className="exp-org-item" key={`${item.label}-${index}`}>
                    <div className="exp-org-logoWrap">
                      <img loading="lazy" decoding="async" src={optimizedAssetPath(item.src)} alt={item.label} className="exp-org-logo" />
                    </div>

                    <div className="exp-org-copy">
                      <div className="exp-org-label">{item.label}</div>
                      <div className="exp-org-detail">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
