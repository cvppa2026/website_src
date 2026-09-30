import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Play,
  Pause,
  Shuffle,
  Grid,
  Maximize2,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { workshopPhotos, type WorkshopPhoto } from "../data/photosData";

export function PhotosPage() {
  const [photos, setPhotos] = useState<WorkshopPhoto[]>(workshopPhotos);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"grid" | "natural">("grid");
  const [isShuffled, setIsShuffled] = useState(false);

  const filmstripRef = useRef<HTMLDivElement | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsPlayingSlideshow(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  // Scroll active thumbnail into center of filmstrip
  useEffect(() => {
    if (activeThumbRef.current && filmstripRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % photos.length;
    });
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? photos.length - 1 : prev - 1;
    });
  }, [photos.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === " " && !e.target?.toString().includes("HTMLButtonElement")) {
        e.preventDefault();
        setIsPlayingSlideshow((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev, handleClose]);

  // Slideshow auto-play when active in modal
  useEffect(() => {
    if (!isPlayingSlideshow || selectedIndex === null) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlayingSlideshow, selectedIndex, handleNext]);

  // Shuffle toggle
  const toggleShuffle = () => {
    if (!isShuffled) {
      const copy = [...workshopPhotos];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      setPhotos(copy);
      setIsShuffled(true);
      if (selectedIndex !== null) setSelectedIndex(0);
    } else {
      setPhotos(workshopPhotos);
      setIsShuffled(false);
      if (selectedIndex !== null) setSelectedIndex(0);
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartXRef.current = null;
  };

  const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CVPPA 2026 at ECCV</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Workshop Photos
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Moments, keynotes, oral presentations, interactive discussions, and community connections from our workshop in Malmö.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg">
              {photos.length} Photos
            </span>

            {/* Layout Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setLayoutMode("grid")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  layoutMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Square Grid layout"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("natural")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  layoutMode === "natural"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Natural aspect ratio masonry"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Natural</span>
              </button>
            </div>

            {/* Shuffle Button */}
            <button
              type="button"
              onClick={toggleShuffle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isShuffled
                  ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              title={isShuffled ? "Reset to original order" : "Shuffle photos randomly"}
            >
              {isShuffled ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Order</span>
                </>
              ) : (
                <>
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {layoutMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`View photo ${index + 1} enlarged`}
            >
              <img
                src={encodeURI(photo.thumb)}
                onError={(e) => {
                  // Fallback to original image if thumbnail fails
                  (e.currentTarget as HTMLImageElement).src = encodeURI(photo.src);
                }}
                alt={`CVPPA 2026 workshop thumbnail ${photo.id}`}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-2.5 text-white">
                <span className="text-[11px] font-medium tracking-wide bg-slate-900/70 backdrop-blur-sm px-1.5 py-0.5 rounded">
                  #{index + 1}
                </span>
                <span className="p-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Masonry / Natural Aspect Ratio columns */
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="group relative w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 block"
                aria-label={`View photo ${index + 1} enlarged`}
              >
                <img
                  src={encodeURI(photo.thumb)}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = encodeURI(photo.src);
                  }}
                  alt={`CVPPA 2026 workshop thumbnail ${photo.id}`}
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-2.5 text-white">
                  <span className="text-[11px] font-medium tracking-wide bg-slate-900/70 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                  <span className="p-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal via Portal */}
      {selectedIndex !== null && currentPhoto && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Workshop photo viewer"
          className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/95 backdrop-blur-xl text-white select-none animate-fadeIn"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 shrink-0 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-wider text-slate-300">
                Photo {selectedIndex + 1} <span className="text-white/40">/</span> {photos.length}
              </span>
              {isPlayingSlideshow && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 animate-pulse">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Slideshow Playing</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Play / Pause Slideshow button */}
              <button
                type="button"
                onClick={() => setIsPlayingSlideshow((prev) => !prev)}
                className={`p-2 rounded-lg text-slate-300 hover:text-white transition-colors ${
                  isPlayingSlideshow
                    ? "bg-blue-600/30 text-blue-400 border border-blue-500/30"
                    : "hover:bg-white/10"
                }`}
                title={isPlayingSlideshow ? "Pause slideshow (Space)" : "Play slideshow (Space)"}
                aria-label={isPlayingSlideshow ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlayingSlideshow ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {/* Download original full-res photo */}
              <a
                href={encodeURI(currentPhoto.src)}
                download={currentPhoto.filename}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Download original high-resolution photo"
                aria-label="Download original photo"
              >
                <Download className="w-4 h-4" />
              </a>

              {/* Open original in new tab */}
              <a
                href={encodeURI(currentPhoto.src)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Open full size in new tab"
                aria-label="Open full size in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-2"
                title="Close viewer (Escape)"
                aria-label="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Area */}
          <div
            className="relative flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden min-h-0"
            onClick={(e) => {
              // Click on background closes the lightbox
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            {/* Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl"
              title="Previous photo (Arrow Left)"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Current Image Container */}
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                key={currentPhoto.id}
                src={encodeURI(currentPhoto.src)}
                alt={`CVPPA 2026 workshop photo #${currentPhoto.id}`}
                className="max-h-[70vh] sm:max-h-[75vh] md:max-h-[78vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-all duration-200"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl"
              title="Next photo (Arrow Right)"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Filmstrip Thumbnails */}
          <div className="shrink-0 border-t border-white/10 bg-slate-950/80 px-4 py-3">
            <div
              ref={filmstripRef}
              className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
              style={{ scrollBehavior: "smooth" }}
            >
              {photos.map((photo, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <button
                    key={photo.id}
                    ref={isActive ? activeThumbRef : null}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                      isActive
                        ? "ring-2 ring-blue-500 scale-105 opacity-100 z-10"
                        : "opacity-40 hover:opacity-80 scale-95"
                    }`}
                    title={`Go to photo ${idx + 1}`}
                  >
                    <img
                      src={encodeURI(photo.thumb)}
                      alt={`Thumbnail ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
