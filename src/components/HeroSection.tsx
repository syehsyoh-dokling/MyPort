import { ArrowRight, Rocket, UserRound } from "lucide-react";
import { slides } from "../data/slides";
import { optimizedAssetPath } from "../utils/assetPath";

export function HeroSection() {
  const firstSlide = slides[0];
  const heroImage = optimizedAssetPath(firstSlide?.background || firstSlide?.frames?.[0] || "/assets/slide-0/background.png");

  return (
    <section id="home" className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 pb-10 pt-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="rounded-[2rem] bg-white/50 p-6 lg:p-8">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
          Executive Summary
        </p>

        <h1 className="font-display text-4xl font-black leading-tight text-slate-950 md:text-6xl">
          I am a professional with <span className="text-teal-700">21 years</span> of experience.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
          I build intelligent digital solutions and lead high-performing teams to deliver impact.
          My expertise spans AI development, full-stack programming, ICT4D initiatives, systems
          design, API integration, digital transformation, and project management.
        </p>

        <div className="mt-6 rounded-2xl border-l-4 border-teal-600 bg-teal-50 p-4 text-lg font-bold text-teal-800">
          Transforming complexity into scalable solutions with global impact.
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20" href="#apps">
            <Rocket size={17} />
            View My Work
          </a>
          <a className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm" href="#contact">
            <UserRound size={17} />
            Let&apos;s Connect
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-slate-950 shadow-soft">
        <div
          className="relative min-h-[500px] bg-cover bg-center p-6"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(4, 25, 40, 0.9), rgba(4, 25, 40, 0.28)), url("${heroImage}")`
          }}
        >
          <div className="relative z-10">
            <p className="text-2xl font-black text-amber-300">My Professional Journey</p>
            <p className="mt-1 text-sm font-semibold text-white/80">21 Years of Growth, Learning & Impact</p>
          </div>

          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <strong className="block text-2xl">100+</strong>
                <span className="text-xs text-white/70">Projects</span>
              </div>
              <div>
                <strong className="block text-2xl">20+</strong>
                <span className="text-xs text-white/70">Organizations</span>
              </div>
              <div>
                <strong className="block text-2xl">5+</strong>
                <span className="text-xs text-white/70">Countries</span>
              </div>
              <div>
                <strong className="block text-2xl">21</strong>
                <span className="text-xs text-white/70">Years</span>
              </div>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm italic text-white/75">
              From solving problems to creating platforms that empower people.
              <ArrowRight size={16} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
