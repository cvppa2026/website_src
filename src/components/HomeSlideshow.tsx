import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Camera, ArrowRight, Sparkles } from "lucide-react";
import { workshopPhotos, type WorkshopPhoto } from "../data/photosData";

function pickRandomThree(photos: WorkshopPhoto[]): WorkshopPhoto[] {
  if (photos.length <= 3) return photos;
  const shuffled = [...photos];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
}

export function HomeSlideshow() {
  const navigate = useNavigate();
  // Pick 3 random photos once on mount
  const selectedPhotos = useMemo(() => pickRandomThree(workshopPhotos), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance every 4.5 seconds when not hovered
  useEffect(() => {
    if (isPaused || selectedPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % selectedPhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, selectedPhotos.length]);

  if (selectedPhotos.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? selectedPhotos.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % selectedPhotos.length);
  };

  const handleGoToPhotos = () => {
    navigate("/photos");
  };

  return (
    <div className="not-prose my-10">
      <div
        onClick={handleGoToPhotos}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleGoToPhotos();
          }
        }}
        className="group relative w-full h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        title="Click to view the full workshop photo gallery"
      >
        {/* Background images cross-fade */}
        {selectedPhotos.map((photo, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={encodeURI(photo.src)}
                alt={`CVPPA 2026 workshop highlight ${idx + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
            </div>
          );
        })}

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/10 pointer-events-none" />

        {/* Top badge */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-white text-xs sm:text-sm font-medium shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Workshop Highlights</span>
          <span className="text-white/40">•</span>
          <span className="text-slate-300 text-xs">
            {currentIndex + 1} of {selectedPhotos.length}
          </span>
        </div>

        {/* Navigation arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous highlight photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/10 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next highlight photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/10 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom banner and call to action */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-300 font-semibold mb-1">
              <Camera className="w-3.5 h-3.5" />
              <span>CVPPA 2026 Gallery</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              Moments from the Workshop in Malmö
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-1 sm:line-clamp-none">
              Explore keynote talks, presentations, attendees, and discussions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Slide dots */}
            <div className="flex items-center gap-1.5 py-1">
              {selectedPhotos.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Jump to photo ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-6 bg-blue-500"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Action pill */}
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg group-hover:translate-x-0.5 transition-all">
              <span>View All Photos</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
