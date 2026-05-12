import { SiteHeader } from "./components/SiteHeader";
import { JourneySlider } from "./components/JourneySlider";
import { AppCarousel } from "./components/AppCarousel";
import { ExperienceLogoSection } from "./components/ExperienceLogoSection";
import { ChecklistSections } from "./components/ChecklistSections";
import { ExperienceSections } from "./components/ExperienceSections";
import { SkillsSection } from "./components/SkillsSection";

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(13,148,136,.12),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(217,119,6,.12),transparent_26%),linear-gradient(160deg,#f8fbff,#eef8ff_45%,#f6fffb)] text-slate-900">
      <SiteHeader />

      <main>
        <JourneySlider />
        <AppCarousel />
        <ExperienceLogoSection />
        <ChecklistSections />
        <ExperienceSections />
        <SkillsSection />
      </main>
    </div>
  );
}
