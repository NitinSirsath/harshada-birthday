import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import LittleMemoriesSection from "./components/LittleMemoriesSection";
import { SECTIONS, type SectionId } from "./data";

const HarshadaBirthdayPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("hey-you");
  const [theme, setTheme] = useState<"romantic" | "dark">("romantic");
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
        <aside className="md:sticky md:top-8 md:h-[calc(100vh-4rem)] md:w-64 md:shrink-0">
          <div className="flex items-center justify-between md:block md:space-y-6">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                For
              </p>
              <h1 className="text-2xl font-semibold">Hey you,</h1>
              <p className="text-xs text-muted-foreground">
                A small birthday note from Sunny
              </p>
            </div>

            {/* Theme + music controls (stacked on mobile, inline on desktop) */}
            <div className="mt-4 flex items-center gap-2 text-xs md:mt-6 md:flex-col md:items-start md:gap-3">
              <button
                type="button"
                onClick={handleThemeToggle}
                className="inline-flex items-center gap-2 rounded-full border bg-card/90 px-3 py-1 text-[11px] font-medium shadow-sm backdrop-blur hover:bg-rose-100/90 hover:text-rose-700 dark:bg-card/80 dark:hover:bg-rose-900/60"
              >
                <span className="inline-block size-1.5 rounded-full bg-rose-400" />
                <span>{theme === "romantic" ? "Romantic" : "Dark"} mode</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMusic}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-[11px] font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <span className="inline-block size-1.5 rounded-full bg-pink-400" />
                <span>
                  {isMusicPlaying ? "Pause our song" : "Play our song"}
                </span>
              </button>
            </div>
          </div>

          {/* Desktop section nav */}
          <nav className="mt-8 hidden flex-col gap-2 text-sm md:flex">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => handleScrollTo(section.id)}
                className={cn(
                  "flex items-center justify-between rounded-full px-3 py-2 text-left transition-colors",
                  activeSection === section.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span>{section.label}</span>
                {activeSection === section.id && (
                  <span className="text-[10px] uppercase tracking-[0.2em]">
                    Now
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile section nav */}
          <nav className="sticky bottom-4 z-10 mt-8 flex items-center gap-2 overflow-x-auto rounded-full border bg-card/95 px-2 py-2 text-xs shadow-lg backdrop-blur md:hidden">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => handleScrollTo(section.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1",
                  activeSection === section.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {section.label}
              </button>
            ))}
          </nav>

          {/* Hidden audio element with placeholder source – replace with real track */}
          <audio
            ref={audioRef}
            loop
            className="hidden"
            src="/media/our-song-placeholder.mp3" // TODO: replace with the actual track path
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-20 pb-20 pt-4 md:pt-0">
          <IntroSection />
          <NineYearsSection />
          <LittleMemoriesSection />
          <FindingOurWayBackSection />
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
            December 25
          </p>
        </div>

        {/* BIG TYPOGRAPHY CHANGE */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Happy Birthday,
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-rose-400 via-purple-400 to-rose-400 animate-gradient-x">
              Harshada.
            </span>
          </h2>
        </div>
      </header>

      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Somehow, after all these years, it doesn&apos;t feel like time has
        really passed between us. Seeing you again brings back a familiar
        warmth, like the version of us from college quietly found its way back
        into the room.
      </p>

      {/* Cinematic Hero Image - Taller and wider */}
      <div className="group relative mt-8 flex aspect-video w-full items-end overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        {/* Using an img tag ensures better object-fit than bg-image */}
        <img
          src="/photo4.jpeg"
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

        <div className="relative z-10 p-6 md:p-10">
          <p className="font-serif text-xl italic text-white md:text-3xl">
            "We lost years, not our connection."
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-rose-200/80">
            2016 — 2025
          </p>
        </div>
      </div>
    </section>
  );
};

const NineYearsSection: React.FC = () => {
  return (
    <section
      id="nine-years"
      className="scroll-mt-24 space-y-6 animate-fade-in-up"
    >
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Timeline
        </p>
        <h2 className="text-2xl font-semibold md:text-3xl">Nine Years of Us</h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        From college corridors to quiet distances, from a single meeting in 2020
        to finding our way back again in 2025 &mdash; these years have changed
        so much around us, but somehow the way it feels to be around you
        hasn&apos;t really changed at all.
      </p>

      <div className="mt-6 space-y-4">
        <div className="relative flex items-center justify-between rounded-xl border bg-card px-4 py-4 text-xs md:px-6 md:py-5 md:text-sm">
          <div className="absolute inset-x-6 top-1/2 -z-10 h-px -translate-y-1/2 bg-border md:inset-x-10" />
          <TimelineDot
            label="College"
            description="Where it all quietly started."
          />
          <TimelineDot
            label="2017"
            description="Life pulled us in different directions."
          />
          <TimelineDot label="2020" description="A brief crossing of paths." />
          <TimelineDot label="2025" description="Somehow, we're here again." />
        </div>

        {/* Little note + your video */}
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1 rounded-xl border bg-card p-4 text-xs text-muted-foreground md:text-sm">
            <p>
              It&apos;s been almost nine years now. And somehow, every time we
              meet, the comfort and connection between us still feels the same.
            </p>
            <p className="mt-2 text-[11px] font-medium text-foreground md:text-xs">
              &mdash; Sunny
            </p>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl border bg-black/90">
            <video
              className="h-40 w-full object-cover md:h-56"
              src="/vid_1.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/cinametic.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface TimelineDotProps {
  label: string;
  description: string;
}

const TimelineDot: React.FC<TimelineDotProps> = ({ label, description }) => {
  return (
    <div className="relative flex flex-1 flex-col items-center gap-1 text-center">
      <span className="inline-flex size-2 items-center justify-center rounded-full bg-primary" />
      <span className="text-[11px] font-medium md:text-xs">{label}</span>
      <span className="max-w-32 text-[10px] text-muted-foreground md:text-[11px]">
        {description}
      </span>
    </div>
  );
};

const FindingOurWayBackSection: React.FC = () => {
  return (
    <section
      id="finding-our-way-back"
      className="scroll-mt-24 space-y-8 animate-fade-in-up"
    >
      <header className="space-y-2 border-l-2 border-rose-500/30 pl-4">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          The Return
        </p>
        <h2 className="text-3xl font-semibold md:text-5xl">
          Finding Our Way Back
        </h2>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Life took us in different directions for a while. We met less, spoke
            less, and whole years went by where we weren&apos;t really in each
            other&apos;s everyday worlds.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            And still, every time we somehow ended up in the same place again,
            the feeling never really learned how to be a stranger.
          </p>
        </div>

        {/* Visual Decoration */}
        <div className="relative flex items-center justify-center rounded-2xl border border-rose-100/10 bg-gradient-to-br from-rose-500/5 to-purple-500/5 p-8">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] opacity-20"></div>
          <div className="text-center">
            <span className="text-4xl md:text-6xl">⚓️</span>
            <p className="mt-4 font-serif text-xl italic text-foreground/80">
              "Steady."
            </p>
          </div>
        </div>
      </div>

      {/* Grid for quotes instead of stack */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <QuoteCard>
          After meeting you again, it doesn&apos;t feel like time has passed at
          all. There&apos;s something about you that quietly pulls all those old
          feelings and memories back to the surface.
        </QuoteCard>
        <QuoteCard>
          Seeing you every day again, just hanging out like we used to, somehow
          feels simple and steady in a world that&apos;s become anything but
          simple.
        </QuoteCard>
        <QuoteCard>
          It&apos;s been almost nine years now. And still, every time we meet,
          the comfort and connection between us feels exactly the same.
        </QuoteCard>
        <QuoteCard>
          Whenever I see you, there&apos;s a childlike innocence in you that I
          can&apos;t ignore. It&apos;s the part of you that makes the world feel
          softer.
        </QuoteCard>
      </div>
    </section>
  );
};

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
      className="scroll-mt-24 space-y-12 pb-24 pt-10 animate-fade-in-up"
    >
      <div className="relative overflow-hidden rounded-3xl border border-rose-200/20 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 px-6 py-12 text-center shadow-2xl md:px-12 md:py-20">
        {/* Background sparkles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-rose-500/20 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-2xl space-y-8">
          <h2 className="font-serif text-3xl font-medium text-rose-100 md:text-5xl">
            "I'm really glad we found our way back."
          </h2>

          <div className="mx-auto h-px w-24 bg-rose-500/50"></div>

          <p className="text-base text-rose-200/80 md:text-lg">
            We can&apos;t rewrite the years that passed. But we can choose what
            happens with the ones in front of us. Whether it&apos;s slow coffees
            or shared silences, I&apos;m grateful life brought you back into my
            story.
          </p>

          <div className="mt-8">
            <p className="text-sm font-bold uppercase tracking-widest text-rose-500">
              Happy Birthday, Harshada
            </p>
            <p className="mt-2 text-xs text-slate-400">— Sunny, 2025</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HarshadaBirthdayPage;
