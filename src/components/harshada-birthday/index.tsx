import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import LittleMemoriesSection from "./components/LittleMemoriesSection";
import { SECTIONS, type SectionId } from "./data";

const DipaliiBirthdayPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("hey-you");
  const [theme, setTheme] = useState<"romantic" | "dark">("dark");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), []);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 35 });

  // Initialise theme from localStorage (optional, simple)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("hb-theme");
    if (stored === "dark" || stored === "romantic") {
      setTheme(stored);
    } else if (stored === "light") {
      // Backwards compatibility with the old light/dark toggle
      setTheme("romantic");
    }
  }, []);

  useEffect(() => {
    // 1. Try to play immediately (works in some specific browser settings)
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume to 50% so it's not blasting
    audio.volume = 0.5;

    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsMusicPlaying(true);
      } catch (error) {
        // 2. If browser blocks it, wait for the first user interaction
        console.log("Autoplay blocked. Waiting for interaction.");

        const playOnInteraction = async () => {
          try {
            await audio.play();
            setIsMusicPlaying(true);
            // Remove listener so it doesn't trigger again
            document.removeEventListener("click", playOnInteraction);
            document.removeEventListener("keydown", playOnInteraction);
            document.removeEventListener("scroll", playOnInteraction);
          } catch (e) {
            console.error("Playback failed", e);
          }
        };

        // Listen for any interaction
        document.addEventListener("click", playOnInteraction);
        document.addEventListener("keydown", playOnInteraction);
        document.addEventListener("scroll", playOnInteraction);
      }
    };

    attemptPlay();
  }, []);

  // Handle theme class on root container
  const rootClassName = cn(
    "relative min-h-screen w-full overflow-hidden transition-colors duration-500",
    theme === "romantic" &&
      "bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 text-rose-950",
    theme === "dark" &&
      "dark bg-gradient-to-b from-slate-950 via-slate-900 to-rose-950 text-rose-50"
  );

  const handleThemeToggle = () => {
    setTheme((prev) => {
      const next = prev === "romantic" ? "dark" : "romantic";
      if (typeof window !== "undefined") {
        window.localStorage.setItem("hb-theme", next);
      }
      return next;
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setCursorPosition({ x, y });
  };

  const handleScrollTo = (id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Track which section is active while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop
          );

        if (visible[0]) {
          const id = visible[0].target.id as SectionId;
          if (sectionIds.includes(id)) {
            setActiveSection(id);
          }
        }
      },
      {
        root: null,
        threshold: 0.4,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      observer.disconnect();
    };
  }, [sectionIds]);

  const handleToggleMusic = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    try {
      if (isMusicPlaying) {
        audioEl.pause();
        setIsMusicPlaying(false);
      } else {
        await audioEl.play();
        setIsMusicPlaying(true);
      }
    } catch {
      // Autoplay may be blocked; we just fail silently and leave UI as-is
    }
  };

  return (
    <div className={rootClassName} onMouseMove={handleMouseMove}>
      {/* Interactive background glow following the cursor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background:
              theme === "romantic"
                ? `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, rgba(244, 114, 182, 0.20), transparent 60%)`
                : `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, rgba(248, 113, 113, 0.18), transparent 60%)`,
          }}
        />

        {/* Faint galaxy ring in the middle of the screen */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              theme === "romantic"
                ? "conic-gradient(from 140deg, rgba(244,114,182,0.2), rgba(56,189,248,0.15), rgba(251,191,36,0.2), rgba(244,114,182,0.2))"
                : "conic-gradient(from 160deg, rgba(59,130,246,0.35), rgba(236,72,153,0.3), rgba(14,165,233,0.25), rgba(59,130,246,0.35))",
          }}
        />

        {/* Sparkling stars scattered across the screen */}
        {Array.from({ length: 36 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "absolute h-1 w-1 rounded-full bg-rose-300/80 shadow-[0_0_8px_rgba(244,114,182,0.8)] dark:bg-rose-100/80 dark:shadow-[0_0_10px_rgba(248,250,252,0.9)] animate-pulse-slow",
              index % 3 === 0 && "scale-125",
              index % 5 === 0 && "animate-fade-in-out",
              index % 7 === 0 && "h-1.5 w-1.5"
            )}
            style={{
              left: `${(index * 11) % 100}%`,
              top: `${(index * 29) % 100}%`,
              animationDelay: `${index * 0.3}s`,
            }}
          />
        ))}

        {/* Occasional shooting stars */}
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={`meteor-${index}`}
            className="absolute h-0.5 w-24 -rotate-45 bg-linear-to-r from-transparent via-rose-100 to-transparent opacity-80 animate-meteor-effect"
            style={{
              top: `${10 + index * 18}%`,
              left: `${60 + index * 8}%`,
              animationDelay: `${index * 2.5}s`,
            }}
          />
        ))}

        {/* Slow floating blobs for subtle motion */}
        <div className="pointer-events-none absolute -bottom-40 -left-10 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -top-32 right-0 h-56 w-56 rounded-full bg-pink-300/30 blur-3xl animate-bounce-slow" />
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl animate-float-up" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10 md:px-8">
        {/* Sidebar / navigation */}
        {/* --- DESKTOP SIDEBAR (The "Index") --- */}
        <aside className="hidden md:sticky md:top-12 md:flex md:h-[calc(100vh-6rem)] md:w-72 md:shrink-0 md:flex-col md:justify-between">
          {/* Top: Header & Nav */}
          <div className="space-y-12">
            {/* Brand / Title */}
            <div className="space-y-2 border-l-4 border-rose-500 pl-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                The Edition
              </p>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                OCT 17.
              </h1>
              <p className="font-serif italic text-slate-500">For Dipali. 🎂</p>
            </div>

            {/* Navigation (Table of Contents) */}
            <nav className="flex flex-col space-y-2">
              {SECTIONS.map((section, index) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleScrollTo(section.id)}
                    className={cn(
                      "group flex items-center gap-4 py-3 pl-4 transition-all duration-300 hover:pl-8",
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-80"
                    )}
                  >
                    {/* Chapter Number */}
                    <span
                      className={cn(
                        "font-mono text-xs font-bold",
                        isActive ? "text-rose-500" : "text-slate-400"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Label */}
                    <span
                      className={cn(
                        "text-sm font-bold uppercase tracking-wider",
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {section.label}
                    </span>

                    {/* Active Dot */}
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom: Control Deck (Music & Theme) */}
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 dark:bg-white",
                  isMusicPlaying && "animate-spin-slow"
                )}
              >
                <span className="text-xs">💿</span>
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {isMusicPlaying ? "Now Playing" : "Paused"}
                </p>
                <p className="truncate text-[10px] text-slate-500">
                  Our Song.mp3
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleToggleMusic}
                className="flex items-center justify-center gap-2 rounded-lg bg-slate-200 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-rose-500 hover:text-white transition-colors dark:bg-slate-800 dark:text-slate-300"
              >
                {isMusicPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={handleThemeToggle}
                className="flex items-center justify-center gap-2 rounded-lg bg-slate-200 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-900 hover:text-white transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-900"
              >
                {theme === "romantic" ? "Dark" : "Light"}
              </button>
            </div>
          </div>
        </aside>

        {/* --- MOBILE TOP BAR (Brand) --- */}
        <div className="mb-6 flex items-center justify-between md:hidden">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              OCT 17.
            </h1>
            <p className="text-xs uppercase tracking-widest text-rose-500">
              For Dipali 🎂
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleThemeToggle}
              className="rounded-full bg-slate-100 p-2 dark:bg-slate-800"
            >
              {theme === "romantic" ? "🌙" : "☀️"}
            </button>
            <button
              onClick={handleToggleMusic}
              className={cn(
                "rounded-full bg-slate-100 p-2 dark:bg-slate-800",
                isMusicPlaying && "ring-2 ring-rose-500"
              )}
            >
              🎵
            </button>
          </div>
        </div>

        {/* --- MOBILE BOTTOM DOCK (Navigation) --- */}
        <nav className="fixed bottom-6 left-4 right-4 z-50 flex items-center gap-2 overflow-x-auto rounded-2xl border border-white/20 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl md:hidden">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className={cn(
                  "whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all",
                  isActive
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {section.label}
              </button>
            );
          })}
        </nav>

        {/* Hidden audio element */}
        <audio ref={audioRef} loop className="hidden" src="/music.mp3" />

        {/* Main content */}
        <main className="flex-1 space-y-20 pb-20 pt-4 md:pt-0">
          <IntroSection />
          <OurStorySection />
          <LittleMemoriesSection />
          <FindingRhythmSection />
          <LookingForwardSection />
        </main>
      </div>
    </div>
  );
};

const IntroSection: React.FC = () => {
  return (
    <section id="hey-you" className="scroll-mt-24 space-y-8 animate-fade-in-up">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-rose-400/50" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-rose-500/80">
            October 17th
          </p>
        </div>

        {/* BIG TYPOGRAPHY CHANGE */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Happy Birthday,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-rose-400 animate-gradient-x">
              Dipali. 🎂
            </span>
          </h2>
        </div>
      </header>

      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        It all started so unexpectedly, babuuu. ❤️🥹 We started talking and
        everything was normal, but then you found me through a Dating App — and
        I remember telling you about hair mask remedies. 😂❤️ Little did I know
        that one small snap on April 6 would become the beginning of something
        so beautiful.
      </p>

      {/* Cinematic Hero Image - Taller and wider */}
      <div className="group relative mt-8 flex aspect-video w-full items-end overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        {/* Using an img tag ensures better object-fit than bg-image */}
        <img
          src="/photo7.jpeg"
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="relative z-10 p-6 md:p-10">
          <p className="font-serif text-xl italic text-white md:text-3xl">
            &ldquo;What started with a random snap led me to you.&rdquo;
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-rose-200/80">
            April 6, 2025 — October 17, 2026
          </p>
        </div>
      </div>
    </section>
  );
};

const OurStorySection: React.FC = () => {
  return (
    <section
      id="nine-years"
      className="scroll-mt-32 space-y-12 animate-fade-in-up"
    >
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4 border-b-2 border-slate-200/50 pb-8 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-500">
            Timeline
          </p>
          <h2 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white md:text-7xl">
            Our Story.
          </h2>
        </div>
        <p className="max-w-md text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-right">
          From a random snap to everyday conversations, to you landing in
          Aurangabad. ✈️❤️
        </p>
      </div>

      {/* --- CHUNKY CARDS GRID --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <YearCard
          year="Apr 6"
          title="The Snap"
          desc="You replied to my morning snap. Little did we know, this was the beginning."
        />
        <YearCard
          year="Daily"
          title="Every Day"
          desc="Talking every single day, from morning. You became part of my daily life."
        />
        <YearCard
          year="Sep 16"
          title="The Landing"
          desc="Your flight landed in Aurangabad. The universe had already planned our story."
        />
        <YearCard
          year="Now"
          title="Together"
          desc="From strangers to babuuu. I'm grateful for every moment that brought me to you."
          variant="highlight"
        />
      </div>

      {/* --- CINEMATIC VIDEO BLOCK --- */}
      <div className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl transition-all hover:shadow-rose-500/10">
        <div className="relative aspect-[21/9] w-full opacity-90 transition-opacity duration-500 group-hover:opacity-100">
          <video
            className="h-full w-full object-cover"
            src="/vid_1.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/cinametic.jpg"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Video Caption Overlay */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            Live Memory
          </div>
          <p className="mt-4 max-w-lg font-serif text-xl italic text-white/90 md:text-2xl">
            &ldquo;Maybe it was destiny, or maybe some stories are written long
            before we realise they&apos;ve begun.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};

// --- SUB-COMPONENT: BIG CHUNKY CARD ---

interface YearCardProps {
  year: string;
  title: string;
  desc: string;
  variant?: "default" | "highlight";
}

const YearCard: React.FC<YearCardProps> = ({
  year,
  title,
  desc,
  variant = "default",
}) => {
  const isHighlight = variant === "highlight";

  return (
    <div
      className={cn(
        "relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[2rem] p-8 transition-transform duration-500 hover:-translate-y-2",
        isHighlight
          ? "bg-rose-600 text-white shadow-xl shadow-rose-600/20"
          : "bg-slate-100 dark:bg-slate-900/50 dark:border dark:border-slate-800 text-slate-900 dark:text-slate-100"
      )}
    >
      {/* Giant Background Number (The "Chunky" Part) */}
      <span
        className={cn(
          "absolute -right-6 -top-10 font-black leading-none tracking-tighter select-none transition-transform duration-700 group-hover:scale-110",
          // Responsive font size: huge on all screens
          "text-[6rem] md:text-[7rem]",
          isHighlight
            ? "text-rose-900/30"
            : "text-slate-200 dark:text-slate-800"
        )}
      >
        {year}
      </span>

      {/* Content Content */}
      <div className="relative z-10 space-y-3">
        <div
          className={cn(
            "h-1 w-8 rounded-full",
            isHighlight ? "bg-rose-300" : "bg-rose-500"
          )}
        />

        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>

        <p
          className={cn(
            "text-sm font-medium leading-relaxed",
            isHighlight ? "text-rose-100" : "text-slate-500 dark:text-slate-400"
          )}
        >
          {desc}
        </p>
      </div>
    </div>
  );
};

const FindingRhythmSection: React.FC = () => {
  return (
    <section
      id="finding-our-way-back"
      className="scroll-mt-32 space-y-16 animate-fade-in-up"
    >
      {/* --- BIG HEADER --- */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-rose-500" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-500">
            The Connection
          </span>
        </div>

        <h2 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white md:text-8xl">
          Finding <br />
          <span className="text-rose-500">Magic.</span>
        </h2>
      </div>

      {/* --- INTRO BLOCK (Split Layout) --- */}
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:col-span-2">
          <p>
            Without even realising it, you started becoming someone so special
            to me. Our conversations became a part of my daily life, and slowly,
            we began talking every single day.
          </p>
          <p>
            And then came September 16, when suddenly, your flight landed in
            Aurangabad. ❤️✈️ Even today, when I think about everything, it
            feels like some kind of magic — as if the universe had already
            planned our story.
          </p>
        </div>

        {/* Visual "Magic" Badge */}
        <div className="flex items-center justify-center rounded-[2rem] bg-rose-100 p-8 text-rose-900 dark:bg-rose-900/30 dark:text-rose-100">
          <div className="text-center">
            <span className="block text-6xl">✨</span>
            <span className="mt-2 block font-serif text-2xl font-bold italic">
              &ldquo;Magic.&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* --- CHUNKY STATEMENT CARDS --- */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuoteCard>
          &ldquo;It all started so unexpectedly, babuuu. What started with a
          random snap, a few conversations, and so many unexpected moments slowly
          turned into a connection that neither of us could have imagined.&rdquo;
        </QuoteCard>

        <QuoteCard>
          &ldquo;From two people who were practically strangers to being in a
          relationship, sharing feelings, making memories, and becoming a part of
          each other&apos;s lives.&rdquo;
        </QuoteCard>

        <QuoteCard>
          &ldquo;Sometimes, I even feel like you had secretly planned
          everything, like a little mastermind, just to bring us closer. 😂🥹❤️&rdquo;
        </QuoteCard>

        <QuoteCard>
          &ldquo;Maybe it was all a coincidence, maybe it was destiny, or maybe
          some stories are written long before we even realise they have
          begun.&rdquo;
        </QuoteCard>
      </div>
    </section>
  );
};

// --- SUB-COMPONENT: EDITORIAL STATEMENT CARD ---

const QuoteCard: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <figure className="rounded-xl border bg-card px-4 py-3 text-xs shadow-sm md:px-5 md:py-4 md:text-sm">
      <blockquote className="text-muted-foreground">{children}</blockquote>
      <figcaption className="mt-2 text-[11px] font-medium text-foreground md:text-xs">
        &mdash; Sunny
      </figcaption>
    </figure>
  );
};

const LookingForwardSection: React.FC = () => {
  return (
    <section
      id="looking-forward"
      className="scroll-mt-24 pb-16 pt-12 animate-fade-in-up"
    >
      {/* --- CONSISTENT DARK EDITORIAL CARD --- */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Background Texture (Consistent with page) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-rose-500/5 blur-[80px]" />

        <div className="relative z-10 grid gap-10 p-8 md:grid-cols-12 md:p-12">
          {/* LEFT: The "Hook" (Big Typography) */}
          <div className="flex flex-col justify-between md:col-span-5 md:border-r md:border-slate-800 md:pr-10">
            <div className="space-y-4">
              <span className="inline-block h-1 w-12 bg-rose-500"></span>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
                From Here <br />
                <span className="text-rose-500">Forward.</span>
              </h2>
            </div>

            <div className="hidden space-y-2 md:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Signing Off
              </p>
              <p className="font-serif text-2xl italic text-slate-200">
                &ldquo;I&apos;m grateful for every little moment that brought me
                closer to you.&rdquo;
              </p>
            </div>
          </div>

          {/* RIGHT: The Content (Text Heavy but Clean) */}
          <div className="space-y-6 md:col-span-7 md:pl-2">
            <p className="text-base leading-relaxed text-slate-400">
              And now, look at us, babuuu. 🥹❤️ From two people who were
              practically strangers to being in a relationship, sharing feelings,
              making memories, and becoming a part of each other&apos;s lives.
            </p>

            <p className="text-base leading-relaxed text-slate-400">
              If someone had told me back then that one random snap would
              eventually lead me to you, I would never have believed them. But
              today, you&apos;re my babuuu, my special person, and someone
              I&apos;m so grateful to have in my life. ❤️🫂
            </p>

            <p className="text-base leading-relaxed text-slate-400">
              Our story didn&apos;t start with a perfect plan. It started with a
              simple snap, a little conversation, a touch of magic, and somehow,
              it led me to you. ❤️♾️
            </p>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-8">
              <div>
                <p className="text-lg font-bold text-white">
                  Happy Birthday, Dipali. 😘🥰
                </p>
                <p className="text-sm text-slate-500">— Sunny, 2026</p>
              </div>

              {/* Small Visual Detail */}
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 text-rose-500">
                ★
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DipaliiBirthdayPage;
