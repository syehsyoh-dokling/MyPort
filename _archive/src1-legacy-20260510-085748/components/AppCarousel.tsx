import { useEffect, useMemo, useState } from "react";
import "../styles/project-apps-carousel.css";

type AppItem = {
  name: string;
  tagline: string;
  logo: string;
  detail: string;
  bubble: string;
  halo: string;
};

const apps: AppItem[] = [
  {
    name: "Pentestor",
    tagline: "AI Security Assistant",
    logo: "/assets/app-logos/pentestor.png",
    detail: "An AI assistant for end-to-end penetration testing, covering scanning, vulnerability identification, risk analysis, and remediation planning.",
    bubble: "linear-gradient(145deg, #f8fbff, #dbeafe)",
    halo: "rgba(59, 130, 246, 0.30)"
  },
  {
    name: "datAIntegrator",
    tagline: "AI Data Migration Agent",
    logo: "/assets/app-logos/dataintegrator.png",
    detail: "An AI-powered co-pilot for migrating data from legacy systems to new architectures with automated field mapping, validation, and SQL/API execution.",
    bubble: "linear-gradient(145deg, #ecfeff, #cffafe)",
    halo: "rgba(34, 211, 238, 0.30)"
  },
  {
    name: "ASPRI Legislator",
    tagline: "AI Governance Assistant",
    logo: "/assets/app-logos/aspri-legislator.png",
    detail: "An AI assistant for legislators to manage public aspirations, analyze policies, and support communication workflows for more data-driven decisions.",
    bubble: "linear-gradient(145deg, #f0f9ff, #dbeafe)",
    halo: "rgba(56, 189, 248, 0.28)"
  },
  {
    name: "Labour Advocate",
    tagline: "AI Legal Assistant for Workers",
    logo: "/assets/app-logos/labour-advocate.png",
    detail: "An AI tool that helps workers understand labor rights, draft complaints, and navigate workplace-related legal issues in a practical way.",
    bubble: "linear-gradient(145deg, #f5f3ff, #e0e7ff)",
    halo: "rgba(99, 102, 241, 0.28)"
  },
  {
    name: "PoligAmI",
    tagline: "AI Matchmaking Agent",
    logo: "/assets/app-logos/poligami.png",
    detail: "An AI-based matchmaking assistant aligned with Islamic values, helping users find compatible partners based on preferences and principles.",
    bubble: "linear-gradient(145deg, #faf5ff, #f3e8ff)",
    halo: "rgba(168, 85, 247, 0.30)"
  },
  {
    name: "Berani Bersama",
    tagline: "AI Health Consultant",
    logo: "/assets/app-logos/berani-bersama.png",
    detail: "An AI consultant providing private, science-based guidance on reproductive health, HIV/STD prevention, risk awareness, and preventive care.",
    bubble: "linear-gradient(145deg, #ecfdf5, #d1fae5)",
    halo: "rgba(16, 185, 129, 0.28)"
  },
  {
    name: "HAI Mom",
    tagline: "AI Assistant for Mothers",
    logo: "/assets/app-logos/hai-mom.png",
    detail: "An AI companion for women across life stages, from menstruation and pregnancy to postpartum care and parenting guidance.",
    bubble: "linear-gradient(145deg, #fff1f2, #fce7f3)",
    halo: "rgba(244, 114, 182, 0.28)"
  },
  {
    name: "Review Obat",
    tagline: "AI Product Scanner",
    logo: "/assets/app-logos/review-obat.png",
    detail: "An AI tool that verifies the safety and legality of medicines and cosmetics by analyzing packaging and regulatory information.",
    bubble: "linear-gradient(145deg, #f7fee7, #dcfce7)",
    halo: "rgba(132, 204, 22, 0.28)"
  },
  {
    name: "Check Halal",
    tagline: "AI Halal Scanner",
    logo: "/assets/app-logos/check-halal.png",
    detail: "An AI scanner that verifies the halal status of food and beverage products through packaging analysis and product information review.",
    bubble: "linear-gradient(145deg, #f0fdf4, #bbf7d0)",
    halo: "rgba(34, 197, 94, 0.26)"
  },
  {
    name: "AIr Tanah",
    tagline: "AI Groundwater Locator",
    logo: "/assets/app-logos/air-tanah.png",
    detail: "An AI system that identifies optimal water drilling points using geological, resistivity, and field data to improve groundwater exploration.",
    bubble: "linear-gradient(145deg, #f0f9ff, #bae6fd)",
    halo: "rgba(14, 165, 233, 0.28)"
  },
  {
    name: "Petani MileniAI",
    tagline: "AI Farming Assistant",
    logo: "/assets/app-logos/petani-mileniai.png",
    detail: "An AI assistant that recommends suitable crops based on land conditions and provides step-by-step guidance from planting to harvest.",
    bubble: "linear-gradient(145deg, #f0fdf4, #dcfce7)",
    halo: "rgba(22, 163, 74, 0.28)"
  },
  {
    name: "Arah Ikan",
    tagline: "AI Fish Finder",
    logo: "/assets/app-logos/arah-ikan.png",
    detail: "An AI tool that uses satellite, ocean, and environmental data to recommend optimal fishing locations for small-scale fishers.",
    bubble: "linear-gradient(145deg, #ecfeff, #bae6fd)",
    halo: "rgba(6, 182, 212, 0.30)"
  },
  {
    name: "Meuneuheun",
    tagline: "AI Aquaculture Assistant",
    logo: "/assets/app-logos/meuneuheun.png",
    detail: "An AI assistant for fish and shrimp farming, offering daily recommendations, condition monitoring, and early disease detection support.",
    bubble: "linear-gradient(145deg, #f0fdfa, #ccfbf1)",
    halo: "rgba(20, 184, 166, 0.30)"
  },
  {
    name: "AI Love Sabang",
    tagline: "AI Tourism Assistant",
    logo: "/assets/app-logos/ai-love-sabang.png",
    detail: "An AI travel assistant providing cultural insights, culinary recommendations, local guidance, and tourism support for visitors in Sabang.",
    bubble: "linear-gradient(145deg, #fff7ed, #ffedd5)",
    halo: "rgba(251, 146, 60, 0.30)"
  },
  {
    name: "PandAI Jalan",
    tagline: "AI Travel Planner",
    logo: "/assets/app-logos/pandai-jalan.png",
    detail: "An AI travel planner for Indonesia, offering route planning, cost estimation, itinerary support, and cultural travel tips.",
    bubble: "linear-gradient(145deg, #eff6ff, #dbeafe)",
    halo: "rgba(37, 99, 235, 0.28)"
  },
  {
    name: "AIsisten Umroh Mandiri",
    tagline: "AI Umrah Planner",
    logo: "/assets/app-logos/aisisten-umroh-mandiri.png",
    detail: "An AI assistant for organizing independent Umrah journeys, covering flights, accommodation, visas, transportation, rituals, and preparation.",
    bubble: "linear-gradient(145deg, #fffbeb, #fef3c7)",
    halo: "rgba(217, 119, 6, 0.28)"
  },
  {
    name: "CekGu",
    tagline: "AI Education Assistant",
    logo: "/assets/app-logos/cekgu.png",
    detail: "An AI tool that helps teachers design critical-thinking exam questions aligned with curriculum standards and resistant to easy AI-generated answers.",
    bubble: "linear-gradient(145deg, #f0f9ff, #e0f2fe)",
    halo: "rgba(2, 132, 199, 0.28)"
  },
  {
    name: "DesAInher",
    tagline: "AI Design & Cost Estimator",
    logo: "/assets/app-logos/desainher.png",
    detail: "An AI system for building design, architectural planning, and automated material cost estimation for faster construction planning.",
    bubble: "linear-gradient(145deg, #f8fafc, #e2e8f0)",
    halo: "rgba(100, 116, 139, 0.26)"
  }
];

const tickerItems = [
  "Professional in Project Management",
  "AI Developer",
  "AI Trainer",
  "AI Reviewer",
  "Full Stack Programmer",
  "Automation Builder",
  "Digital Transformation"
];

const sidePositions = [-4, -3, -2, -1, 1, 2, 3, 4];

function wrapIndex(index: number) {
  return (index + apps.length) % apps.length;
}

function getElapsedSince(startDateString: string) {
  const start = new Date(startDateString);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export function AppCarousel() {
  const elapsed = getElapsedSince("2024-01-02");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const activeApp = apps[currentIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIsMoving(true);

      window.setTimeout(() => {
        setCurrentIndex((value) => wrapIndex(value + 1));
        setIsMoving(false);
      }, 820);
    }, 8000);

    return () => window.clearInterval(timer);
  }, []);

  const sideItems = useMemo(() => {
    return sidePositions.map((position) => {
      const app = apps[wrapIndex(currentIndex + position)];
      const distance = Math.abs(position);

      const className =
        distance === 1
          ? "projectapps-near-1"
          : distance === 2
            ? "projectapps-near-2"
            : distance === 3
              ? "projectapps-far-1"
              : "projectapps-far-2";

      return { app, position, className };
    });
  }, [currentIndex]);

  return (
    <section id="apps" className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-8 overflow-hidden rounded-[1.35rem] border border-slate-200/70 bg-white/80 shadow-soft backdrop-blur">
        <div className="projectapps-marquee">
          <div className="projectapps-marquee-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`} className="projectapps-marquee-item">
                <span />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="font-display text-3xl font-black text-slate-900">
          AI-Based & Automation Application Achievements
        </h2>
        <p className="mt-2 text-slate-600">
          Developed more than <strong>{apps.length}</strong> applications during{" "}
          <strong>
            {elapsed.years} years {elapsed.months} months {elapsed.days} days
          </strong>.
        </p>
      </div>

      <div className="projectapps-shell">
        <p className="projectapps-hint">Hover the center logo for detail</p>

        <div className={`projectapps-stage ${isMoving ? "projectapps-moving" : ""}`}>
          <div className="projectapps-side projectapps-left">
            {sideItems
              .filter((item) => item.position < 0)
              .map(({ app, position, className }) => (
                <div key={`left-${currentIndex}-${position}-${app.logo}`} className={`projectapps-item ${className}`}>
                  <div
                    className="projectapps-bubble"
                    style={{
                      background: app.bubble,
                      boxShadow: `0 18px 42px ${app.halo}`
                    }}
                  >
                    <div className="projectapps-halo" style={{ background: app.halo }} />
                    <img src={app.logo} alt={app.name} className="projectapps-logo" />
                  </div>
                </div>
              ))}
          </div>

          <div className="projectapps-center">
            <div
              className="projectapps-center-bubble"
              style={{
                background: activeApp.bubble,
                boxShadow: `0 24px 56px ${activeApp.halo}`
              }}
            >
              <div className="projectapps-halo" style={{ background: activeApp.halo }} />
              <img src={activeApp.logo} alt={activeApp.name} className="projectapps-logo" />

              <div className="projectapps-tooltip">
                <strong>{activeApp.tagline}</strong>
                <p>{activeApp.detail}</p>
              </div>
            </div>

            <p className="projectapps-tagline">{activeApp.tagline}</p>
          </div>

          <div className="projectapps-side projectapps-right">
            {sideItems
              .filter((item) => item.position > 0)
              .map(({ app, position, className }) => (
                <div key={`right-${currentIndex}-${position}-${app.logo}`} className={`projectapps-item ${className}`}>
                  <div
                    className="projectapps-bubble"
                    style={{
                      background: app.bubble,
                      boxShadow: `0 18px 42px ${app.halo}`
                    }}
                  >
                    <div className="projectapps-halo" style={{ background: app.halo }} />
                    <img src={app.logo} alt={app.name} className="projectapps-logo" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="projectapps-dots">
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((position) => (
            <span key={position} className={position === 0 ? "active" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}