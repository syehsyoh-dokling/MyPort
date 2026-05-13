import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides } from "../data/slides";
import { optimizedAssetPath } from "../utils/assetPath";

export function AssetSliderPreview() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  const activeSlide = slides[slideIndex];

  const frames = useMemo(() => {
    return activeSlide?.frames?.length ? activeSlide.frames : [];
  }, [activeSlide]);

  useEffect(() => {
    setFrameIndex(0);
  }, [slideIndex]);

  useEffect(() => {
    if (frames.length <= 1) return;

    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, 350);

    return () => window.clearInterval(timer);
  }, [frames]);

  if (!activeSlide) return null;

  const currentFrame = optimizedAssetPath(frames[frameIndex] || activeSlide.background || "/assets/slide-0/background.png");

  function go(direction: number) {
    setSlideIndex((current) => {
      const next = current + direction;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Slider Source</p>
          <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
            Slider Preview from public/assets
          </h2>
          <p className="mt-2 text-slate-600">
            Visual di bawah ini berasal langsung dari folder asset lama yang sekarang berada di public/assets.
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <ChevronLeft />
          </button>
          <button onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
        <div
          className="relative grid min-h-[520px] place-items-center bg-cover bg-center p-8"
          style={{
            backgroundImage: activeSlide.background
              ? `linear-gradient(135deg, rgba(248,251,255,.55), rgba(237,250,246,.72)), url("${optimizedAssetPath(activeSlide.background)}")`
              : "linear-gradient(135deg, #f8fbff, #edfaf6)"
          }}
        >
          <img src={currentFrame} alt={activeSlide.title} className="max-h-[420px] max-w-full object-contain drop-shadow-2xl" />

          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-900">{activeSlide.title}</h3>
                <p className="text-sm text-slate-600">
                  Folder: {activeSlide.folder} · Frame {frameIndex + 1} / {frames.length}
                </p>
              </div>
              <span className="rounded-full bg-teal-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-teal-800">
                {activeSlide.mode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
