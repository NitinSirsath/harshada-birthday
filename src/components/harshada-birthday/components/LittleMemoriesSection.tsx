import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PHOTO_MEMORIES } from "../data"; // Your data import

const LittleMemoriesSection: React.FC = () => {
  // State for hover effect (Focus logic)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // State for the Lightbox (Click logic)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex(null);
  };

  return (
    <section
      id="little-memories"
      className="scroll-mt-24 space-y-12 py-10 relative"
    >
      {/* --- HEADER --- */}
      <header className="flex flex-col gap-8 border-b border-rose-500/10 pb-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-rose-500/20 bg-rose-500/5 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-rose-300">
              Observations
            </span>
          </div>

          <h2 className="text-5xl font-black tracking-tighter text-white md:text-7xl lg:text-8xl leading-[0.9]">
            The Small <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500">
              Details.
            </span>
          </h2>
        </div>

        <p className="max-w-md text-base leading-relaxed text-slate-400 md:text-right md:text-lg">
          It isn't the big dramatic moments that stick. It's the quiet chaos,
          the inside jokes, and the comfortable silence of just sitting
          together.
        </p>
      </header>

      {/* --- TEXT CARDS --- */}
      <div className="grid gap-6 md:grid-cols-3">
        <MemoryCard
          icon="🏫"
          title="College Corners"
          body="The way you'd light up the most ordinary spaces. The classroom, the canteen, the walk back home—they all feel softer when I think of them with you in them."
          delay={0}
        />
        <MemoryCard
          icon="☕"
          title="Quiet Comfort"
          body='How it never felt like we had to perform for each other. Just sitting next to you, saying nothing, somehow felt like the loudest kind of "I&apos;m home."'
          delay={1}
        />
        <MemoryCard
          icon="✨"
          title="Everyday You"
          body="The small expressions, the way you talk when you're excited, the childlike innocence that still shows up in your eyes—it's always been my favourite version of you."
          delay={2}
        />
      </div>

      {/* --- INTERACTIVE BENTO GRID --- */}
      <div className="relative mt-12 overflow-hidden rounded-3xl border border-rose-500/20 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl md:p-8">
        {/* Animated Background Nebula */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-rose-500/20 blur-[100px] animate-pulse-glow" />
          <div
            className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-500/20 blur-[100px] animate-pulse-glow"
            style={{ animationDelay: "2s" }}
          />
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                opacity: Math.random() * 0.5 + 0.2,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>

        {/* The Grid */}
        <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[200px]">
          {PHOTO_MEMORIES.map((photo, index) => {
            const isHovered = hoveredIndex === index;
            const isBlur = hoveredIndex !== null && hoveredIndex !== index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(index)} // CLICK EVENT HERE
                className={cn(
                  "relative group overflow-hidden rounded-xl transition-all duration-700 ease-out cursor-pointer text-left w-full h-full block",
                  // Layout logic
                  index % 3 === 0
                    ? "col-span-2 row-span-2"
                    : "col-span-1 row-span-1",
                  // Focus logic
                  isBlur
                    ? "opacity-40 scale-95 grayscale blur-[2px]"
                    : "opacity-100 scale-100 grayscale-0 blur-0",
                  isHovered
                    ? "z-10 shadow-[0_0_30px_rgba(244,63,94,0.3)] ring-2 ring-rose-400/50"
                    : "hover:z-10"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-700 ease-out",
                    isHovered ? "scale-110" : "scale-100 group-hover:scale-105"
                  )}
                />

                {/* Gradient Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent transition-opacity duration-500",
                    isHovered ? "opacity-80" : "opacity-50"
                  )}
                />

                {/* Caption - Slides up on hover */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 p-4 transition-transform duration-500 ease-out",
                    isHovered ? "translate-y-0" : "translate-y-4"
                  )}
                >
                  <p
                    className={cn(
                      "font-medium text-rose-50 leading-snug transition-all duration-500",
                      index % 3 === 0
                        ? "text-lg md:text-xl"
                        : "text-xs md:text-sm",
                      isHovered ? "text-white" : "text-slate-200"
                    )}
                  >
                    {photo.caption}
                  </p>

                  {/* "Click to Expand" Hint */}
                  <div
                    className={cn(
                      "mt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-rose-300 transition-opacity duration-500",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                    <span>Click to view</span>
                  </div>
                </div>

                {/* Corner Shine Effect */}
                <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-white/20 blur-xl transition-all duration-700 group-hover:bg-rose-400/40" />
              </button>
            );
          })}
        </div>

        {/* Bottom decorative text */}
        <div className="mt-6 flex justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose-500/50 animate-pulse">
            Captured Moments
          </p>
        </div>
      </div>

      {/* --- THE LIGHTBOX MODAL --- */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md animate-in fade-in duration-300"
          onClick={handleCloseModal}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-rose-500/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-900 border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.2)] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent clicking inner card from closing
          >
            {/* The High-Res Image */}
            <div className="relative aspect-video w-full bg-slate-950">
              <img
                src={PHOTO_MEMORIES[selectedIndex].src}
                alt="Memory"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Modal Caption */}
            <div className="bg-slate-900 p-6 md:p-8 text-center border-t border-rose-500/20">
              <h3 className="text-xl md:text-2xl font-serif text-rose-100 mb-2">
                {PHOTO_MEMORIES[selectedIndex].caption}
              </h3>
              <p className="text-sm text-slate-400 uppercase tracking-widest">
                A moment in time
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// --- SUB-COMPONENT: MEMORY TEXT CARD ---
const MemoryCard: React.FC<{
  title: string;
  body: string;
  icon: string;
  delay: number;
}> = ({ title, body, icon, delay }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-rose-100/10 bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-rose-500/30 hover:shadow-[0_10px_40px_-10px_rgba(244,63,94,0.2)]"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-xl shadow-inner shadow-rose-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-rose-100 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-400 group-hover:text-rose-100/90 transition-colors">
          {body}
        </p>
      </div>
    </div>
  );
};

export default LittleMemoriesSection;
