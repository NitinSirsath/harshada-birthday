import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "hey-you", label: "Hey You" },
  { id: "nine-years", label: "Nine Years of Us" },
  { id: "little-memories", label: "Little Memories" },
  { id: "finding-our-way-back", label: "Finding Our Way Back" },
  { id: "looking-forward", label: "Looking Forward" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const PHOTO_MEMORIES = [
  {
    src: "/photo1.jpg",
    alt: "You smiling in a way that still feels like college",
    caption: "Somehow you still look like the person my younger self fell for.",
  },
  {
    src: "/photo2.jpg",
    alt: "A quieter candid moment",
    caption: "The soft, in–between moments with you have always been my favourites.",
  },
  {
    src: "/photo3.jpeg",
    alt: "You laughing",
    caption: "This is the version of you my heart keeps replaying.",
  },
  {
    src: "/photo4.jpeg",
    alt: "You looking away from the camera",
    caption: "Even when you aren&apos;t looking here, I still can&apos;t stop looking at you.",
  },
  {
    src: "/photo5.jpeg",
    alt: "You lost in your own world",
    caption: "Sometimes I just like watching you exist, quietly in your own thoughts.",
  },
  {
    src: "/photo6.jpeg",
    alt: "You in a cosy moment",
    caption: "Little pockets of calm with you are still my favourite kind of silence.",
  },
  {
    src: "/photo7.jpeg",
    alt: "You being effortlessly yourself",
    caption: "No filters, no performance &mdash; just you, which has always been enough.",
  },
  {
    src: "/photo8.jpeg",
    alt: "You caught mid-laugh",
    caption: "If my heart had a soundtrack, it would probably sound like this moment.",
  },
  {
    src: "/photo9.jpeg",
    alt: "A softer side of you",
    caption: "There&apos;s a gentleness in you that makes the whole world feel softer.",
  },
  {
    src: "/photo10.jpeg",
    alt: "You, exactly as you are now",
    caption: "If the future looks like more days with you in it, I&apos;m in.",
  },
] as const;

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
          // eslint-disable-next-line react/no-array-index-key
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
          // eslint-disable-next-line react/no-array-index-key
          <span
            key={`meteor-${index}`}
            className="absolute h-[2px] w-24 -rotate-45 bg-gradient-to-r from-transparent via-rose-100 to-transparent opacity-80 animate-meteor-effect"
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
        <aside className="md:sticky md:top-8 md:h-[calc(100vh-4rem)] md:w-64 md:flex-shrink-0">
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
    <section id="hey-you" className="scroll-mt-24 space-y-6 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Hey you
        </p>
        <h2 className="text-3xl font-semibold md:text-4xl">
          Happy Birthday, Harshada
        </h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Somehow, after all these years, it doesn&apos;t feel like time has
        really passed between us. Seeing you again brings back a familiar
        warmth, like the version of us from college quietly found its way back
        into the room.
      </p>

      {/* Hero visual using your photos */}
      <div className="relative mt-6 flex h-64 items-center justify-center overflow-hidden rounded-3xl border bg-cover bg-center bg-[url('/photo1.jpg')] dark:bg-[url('/photo4.jpeg')]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
        <div className="relative z-10 px-4 text-center text-rose-50">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-200">
            A small reminder
          </p>
          <p className="mt-3 text-lg font-medium md:text-xl">
            We lost years, not our connection.
          </p>
          <p className="mt-1 text-xs text-rose-100/90">
            This is one of my favourite versions of us.
          </p>
        </div>
      </div>
    </section>
  );
};

const NineYearsSection: React.FC = () => {
  return (
    <section id="nine-years" className="scroll-mt-24 space-y-6 animate-fade-in-up">
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
      <span className="max-w-[8rem] text-[10px] text-muted-foreground md:text-[11px]">
        {description}
      </span>
    </div>
  );
};

const LittleMemoriesSection: React.FC = () => {
  return (
    <section id="little-memories" className="scroll-mt-24 space-y-6 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Little things
        </p>
        <h2 className="text-2xl font-semibold md:text-3xl">
          The Small Memories
        </h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Not big dramatic momentsjust the tiny ones. The everyday college chaos,
        the inside jokes, the way time used to disappear when we were just
        sitting together. Those are the pieces that still feel alive when I
        think of you.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <MemoryCard
          title="College corners"
          body="The way you'd light up the most ordinary spaces. Somehow the classroom, the canteen, the walk back homethey all feel softer when I think of them with you in them."
        />
        <MemoryCard
          title="Quiet comfort"
          body='How it never felt like we had to perform for each other. Just sitting next to you, saying nothing, somehow felt like the loudest kind of "I&apos;m home."'
        />
        <MemoryCard
          title="Everyday versions of you"
          body="The small expressions, the way you talk when you're excited, the childlike innocence that still shows up in your eyes &mdash; it's always been my favourite version of you."
        />
      </div>

      {/* Photo galaxy strip */}
      <div className="mt-6 relative overflow-hidden rounded-3xl border bg-gradient-to-br from-rose-100/80 via-purple-100/60 to-sky-100/70 p-4 shadow-sm dark:from-slate-900/80 dark:via-purple-950/60 dark:to-slate-900/80 md:p-6">
        {/* subtle stars behind the gallery */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          {Array.from({ length: 18 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <span
              key={index}
              className="absolute h-[3px] w-[3px] rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-fade-in-out"
              style={{
                left: `${(index * 17) % 100}%`,
                top: `${(index * 23) % 100}%`,
                animationDelay: `${index * 0.4}s`,
              }}
            />
          ))}
        </div>

        <div className="relative grid auto-rows-[120px] gap-4 md:auto-rows-[160px] md:grid-cols-3">
          {PHOTO_MEMORIES.map((photo, index) => (
            <figure
              key={photo.src}
              className={cn(
                "group relative flex h-full w-full items-end overflow-hidden rounded-2xl border bg-card/90 shadow-md backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl",
                index % 3 === 0 && "md:row-span-2",
                index % 4 === 0 && "md:col-span-2",
                index % 2 === 0 ? "-rotate-1" : "rotate-1"
              )}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
              <figcaption className="relative z-10 flex w-full items-end justify-between px-3 pb-2 pt-6 text-[10px] text-rose-50 md:px-4 md:pb-3 md:text-xs">
                <span className="max-w-[80%] leading-snug">{photo.caption}</span>
                <span className="ml-2 text-[11px] opacity-80">★</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

interface MemoryCardProps {
  title: string;
  body: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ title, body }) => {
  return (
    <article className="flex h-full flex-col justify-between rounded-xl border bg-card p-4 text-xs shadow-sm md:p-5 md:text-sm">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold md:text-base">{title}</h3>
        <p className="text-[11px] leading-relaxed text-muted-foreground md:text-xs">
          {body}
        </p>
      </div>
    </article>
  );
};

const FindingOurWayBackSection: React.FC = () => {
  return (
    <section id="finding-our-way-back" className="scroll-mt-24 space-y-6 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          After time apart
        </p>
        <h2 className="text-2xl font-semibold md:text-3xl">
          Finding Our Way Back
        </h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Life took us in different directions for a while. We met less, spoke
        less, and whole years went by where we weren&apos;t really in each
        other&apos;s everyday worlds. And still, every time we somehow ended up
        in the same place again, the feeling never really learned how to be a
        stranger.
      </p>

      <div className="mt-4 space-y-3 text-xs md:text-sm">
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
          softer, and I think I&apos;ve always loved that.
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
    <section id="looking-forward" className="scroll-mt-24 space-y-6 pb-10 animate-fade-in-up">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          From here
        </p>
        <h2 className="text-2xl font-semibold md:text-3xl">Looking Forward</h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        We can&apos;t rewrite the years that passed. But we can choose what
        happens with the ones in front of us. Whether it&apos;s slow coffees,
        shared silences, or the tiniest everyday things that somehow feel
        different when you&apos;re there &mdash; I&apos;m grateful that life
        brought you back into my story.
      </p>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Wherever this next chapter goes, I just wanted you to have this small
        corner of the internet that will always say the same simple thing:
      </p>

      <div className="mt-4 rounded-2xl border bg-card px-5 py-4 shadow-sm md:py-5">
        <p className="text-sm font-medium md:text-base">
          I&apos;m really glad we found our way back.
        </p>
        <p className="mt-2 text-xs text-muted-foreground md:text-sm">
          Happy Birthday, Harshada.
        </p>
        <p className="mt-4 text-xs font-medium text-muted-foreground md:text-sm">
          &mdash; Sunny
        </p>
      </div>
    </section>
  );
};

export default HarshadaBirthdayPage;
