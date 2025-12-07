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

const HarshadaBirthdayPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("hey-you");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), []);

  // Initialise theme from localStorage (optional, simple)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("hb-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }, []);

  // Handle theme class on root container
  const rootClassName = cn(
    "min-h-screen w-full bg-background text-foreground transition-colors duration-300",
    theme === "dark" && "dark"
  );

  const handleThemeToggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        window.localStorage.setItem("hb-theme", next);
      }
      return next;
    });
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
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);

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
    <div className={rootClassName}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10 md:px-8">
        {/* Sidebar / navigation */}
        <aside className="md:sticky md:top-8 md:h-[calc(100vh-4rem)] md:w-64 md:flex-shrink-0">
          <div className="flex items-center justify-between md:block md:space-y-6">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">For</p>
              <h1 className="text-2xl font-semibold">Hey you,</h1>
              <p className="text-xs text-muted-foreground">A small birthday note from Sunny</p>
            </div>

            {/* Theme + music controls (stacked on mobile, inline on desktop) */}
            <div className="mt-4 flex items-center gap-2 text-xs md:mt-6 md:flex-col md:items-start md:gap-3">
              <button
                type="button"
                onClick={handleThemeToggle}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-[11px] font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <span className="inline-block size-1.5 rounded-full bg-primary" />
                <span>{theme === "light" ? "Light" : "Dark"} mood</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMusic}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-[11px] font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <span className="inline-block size-1.5 rounded-full bg-pink-400" />
                <span>{isMusicPlaying ? "Pause our song" : "Play our song"}</span>
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
                  <span className="text-[10px] uppercase tracking-[0.2em]">Now</span>
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
    <section id="hey-you" className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Hey you</p>
        <h2 className="text-3xl font-semibold md:text-4xl">Happy Birthday, Harshada</h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Somehow, after all these years, it doesn&apos;t feel like time has really passed between us.
        Seeing you again brings back a familiar warmth, like the version of us from college quietly
        found its way back into the room.
      </p>

      {/* Hero visual placeholder – replace with a real photo later */}
      <div className="relative mt-6 flex h-52 items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-rose-100 via-amber-50 to-sky-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.25),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.2),_transparent_55%)] opacity-70" />
        <div className="relative z-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">A small reminder</p>
          <p className="mt-3 text-lg font-medium md:text-xl">We lost years, not our connection.</p>
          <p className="mt-1 text-xs text-muted-foreground">This page is just for you.</p>
        </div>
      </div>
    </section>
  );
};

const NineYearsSection: React.FC = () => {
  return (
    <section id="nine-years" className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Timeline</p>
        <h2 className="text-2xl font-semibold md:text-3xl">Nine Years of Us</h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        From college corridors to quiet distances, from a single meeting in 2020 to finding our way
        back again in 2025 &mdash; these years have changed so much around us, but somehow the way it
        feels to be around you hasn&apos;t really changed at all.
      </p>

      <div className="mt-6 space-y-4">
        <div className="relative flex items-center justify-between rounded-xl border bg-card px-4 py-4 text-xs md:px-6 md:py-5 md:text-sm">
          <div className="absolute inset-x-6 top-1/2 -z-10 h-px -translate-y-1/2 bg-border md:inset-x-10" />
          <TimelineDot label="College" description="Where it all quietly started." />
          <TimelineDot label="2017" description="Life pulled us in different directions." />
          <TimelineDot label="2020" description="A brief crossing of paths." />
          <TimelineDot label="2025" description="Somehow, we&apos;re here again." />
        </div>

        {/* Video placeholder */}
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1 rounded-xl border bg-card p-4 text-xs text-muted-foreground md:text-sm">
            <p>
              It&apos;s been almost nine years now. And somehow, every time we meet, the comfort and
              connection between us still feels the same.
            </p>
            <p className="mt-2 text-[11px] font-medium text-foreground md:text-xs">&mdash; Sunny</p>
          </div>

          <div className="flex flex-1 items-center justify-center rounded-xl border bg-muted/60 p-4 text-xs text-muted-foreground md:text-sm">
            <div className="flex h-32 w-full max-w-xs items-center justify-center rounded-lg border border-dashed bg-background/60">
              <span className="text-[11px] md:text-xs">
                Video placeholder &mdash; drop a small clip of a moment that feels like &quot;us&quot; here.
              </span>
            </div>
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
    <section id="little-memories" className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Little things</p>
        <h2 className="text-2xl font-semibold md:text-3xl">The Small Memories</h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Not big dramatic momentsjust the tiny ones. The everyday college chaos, the inside jokes,
        the way time used to disappear when we were just sitting together. Those are the pieces that
        still feel alive when I think of you.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <MemoryCard
          title="College corners"
          body="The way you&apos;d light up the most ordinary spaces. Somehow the classroom, the canteen, the walk back homethey all feel softer when I think of them with you in them."
        />
        <MemoryCard
          title="Quiet comfort"
          body="How it never felt like we had to perform for each other. Just sitting next to you, saying nothing, somehow felt like the loudest kind of &quot;I&apos;m home.&quot;"
        />
        <MemoryCard
          title="Everyday versions of you"
          body="The small expressions, the way you talk when you&apos;re excited, the childlike innocence that still shows up in your eyes &mdash; it&apos;s always been my favourite version of you."
        />
      </div>

      {/* Photo placeholders row */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="flex h-28 items-center justify-center rounded-xl border border-dashed bg-muted/60 text-[11px] text-muted-foreground md:h-32"
          >
            Photo placeholder #{idx}
          </div>
        ))}
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
        <p className="text-[11px] leading-relaxed text-muted-foreground md:text-xs">{body}</p>
      </div>
    </article>
  );
};

const FindingOurWayBackSection: React.FC = () => {
  return (
    <section id="finding-our-way-back" className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">After time apart</p>
        <h2 className="text-2xl font-semibold md:text-3xl">Finding Our Way Back</h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Life took us in different directions for a while. We met less, spoke less, and whole years
        went by where we weren&apos;t really in each other&apos;s everyday worlds. And still, every time we
        somehow ended up in the same place again, the feeling never really learned how to be a
        stranger.
      </p>

      <div className="mt-4 space-y-3 text-xs md:text-sm">
        <QuoteCard>
          After meeting you again, it doesn&apos;t feel like time has passed at all. There&apos;s something
          about you that quietly pulls all those old feelings and memories back to the surface.
        </QuoteCard>
        <QuoteCard>
          Seeing you every day again, just hanging out like we used to, somehow feels simple and
          steady in a world that&apos;s become anything but simple.
        </QuoteCard>
        <QuoteCard>
          It&apos;s been almost nine years now. And still, every time we meet, the comfort and connection
          between us feels exactly the same.
        </QuoteCard>
        <QuoteCard>
          Whenever I see you, there&apos;s a childlike innocence in you that I can&apos;t ignore. It&apos;s the
          part of you that makes the world feel softer, and I think I&apos;ve always loved that.
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
    <section id="looking-forward" className="scroll-mt-24 space-y-6 pb-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">From here</p>
        <h2 className="text-2xl font-semibold md:text-3xl">Looking Forward</h2>
      </header>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        We can&apos;t rewrite the years that passed. But we can choose what happens with the ones in
        front of us. Whether it&apos;s slow coffees, shared silences, or the tiniest everyday things that
        somehow feel different when you&apos;re there &mdash; I&apos;m grateful that life brought you back into
        my story.
      </p>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Wherever this next chapter goes, I just wanted you to have this small corner of the internet
        that will always say the same simple thing:
      </p>

      <div className="mt-4 rounded-2xl border bg-card px-5 py-4 shadow-sm md:py-5">
        <p className="text-sm font-medium md:text-base">I&apos;m really glad we found our way back.</p>
        <p className="mt-2 text-xs text-muted-foreground md:text-sm">Happy Birthday, Harshada.</p>
        <p className="mt-4 text-xs font-medium text-muted-foreground md:text-sm">&mdash; Sunny</p>
      </div>
    </section>
  );
};

export default HarshadaBirthdayPage;
