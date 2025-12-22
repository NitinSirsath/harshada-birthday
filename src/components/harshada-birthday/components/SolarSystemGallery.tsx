import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { PHOTO_MEMORIES } from "../data"; // Your existing data file

export const SolarSystemGallery: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="little-memories" className="min-h-[600px] py-20 scroll-mt-24">
      {/* Title */}
      <div className="mb-16 text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-rose-100 drop-shadow-lg">
          Our Little Universe
        </h2>
        <p className="text-rose-200/70 text-sm uppercase tracking-widest">
          Click a memory to bring it close ✨
        </p>
      </div>

      {/* The Solar System Container */}
      <div className="relative mx-auto flex h-[500px] w-full max-w-2xl items-center justify-center md:h-[600px]">
        {/* 1. The Central Sun (Heart) */}
        <div className="absolute z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 via-rose-600 to-red-600 shadow-[0_0_50px_rgba(244,63,94,0.8)] md:h-32 md:w-32 animate-pulse">
          <span className="text-4xl">❤️</span>
        </div>

        {/* 2. Visual Orbit Ring (Dashed Line) */}
        <div className="absolute h-[280px] w-[280px] rounded-full border border-dashed border-rose-500/30 md:h-[440px] md:w-[440px] animate-spin-ultra-slow opacity-50" />

        {/* 3. The Orbiting Planets */}
        <div
          className={cn(
            "absolute inset-0",
            // If we click a photo OR hover the section, pause the rotation
            (activeId !== null || isHovered) && "[&_*]:pause-animation"
          )}
        >
          {PHOTO_MEMORIES.map((photo, index) => {
            const total = PHOTO_MEMORIES.length;

            // This calculates the delay so planets are spaced out evenly
            const delay = `-${(30 / total) * index}s`;

            const isActive = activeId === index;

            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  animation: `orbit 30s linear infinite`,
                  animationDelay: delay,
                }}
              >
                {/* Counter-rotation wrapper to keep image upright */}
                <div
                  style={{
                    animation: `counter-orbit 30s linear infinite`,
                    animationDelay: delay,
                  }}
                >
                  <button
                    onClick={() => setActiveId(isActive ? null : index)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                      "relative flex items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-500 cursor-pointer shadow-xl",
                      isActive
                        ? "h-48 w-48 border-rose-400 z-50 scale-110 bg-slate-900 shadow-[0_0_40px_rgba(244,63,94,0.6)]"
                        : "h-16 w-16 md:h-20 md:w-20 border-white/20 hover:border-rose-300 hover:scale-125 bg-slate-800"
                    )}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover"
                    />

                    {/* Text Overlay (Only shows when clicked) */}
                    {isActive && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 animate-in fade-in">
                        <p className="text-xs md:text-sm text-rose-50 text-center font-medium leading-relaxed">
                          {photo.caption}
                        </p>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
