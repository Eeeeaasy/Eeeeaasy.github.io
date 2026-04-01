import { useEffect, useMemo, useRef, useState } from "react";

type Skill = {
  key: string;
  label: string;
  description: string;
};

const skills: Skill[] = [
  {
    key: "A",
    label: "Astro",
    description: "Modern static site builder with islands architecture.",
  },
  {
    key: "R",
    label: "React",
    description: "Component-based UI library for building interfaces.",
  },
  {
    key: "T",
    label: "TypeScript",
    description: "Typed superset of JavaScript for safer, scalable code.",
  },
  {
    key: "J",
    label: "JavaScript",
    description: "The core language of the web and interactive UI.",
  },
  {
    key: "N",
    label: "Node.js",
    description: "Server-side runtime for modern full stack applications.",
  },
  {
    key: "W",
    label: "Tailwind",
    description: "Utility-first CSS framework for rapid interface styling.",
  },
  {
    key: "D",
    label: "Docker",
    description: "Containerized workflows for consistent development.",
  },
  {
    key: "G",
    label: "Git",
    description: "Version control for collaboration and safe iteration.",
  },
];

const AUTO_PLAY_INTERVAL = 1700;
const AUTO_RESUME_DELAY = 4500;

export default function SkillsKeyboard3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const resumeTimerRef = useRef<number | null>(null);

  const activeSkill = skills[activeIndex];

  const keyMap = useMemo(() => {
    return new Map(skills.map((skill, index) => [skill.key, index]));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % skills.length);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [isAutoPlaying]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressed = event.key.toUpperCase();
      const matchedIndex = keyMap.get(pressed);

      if (matchedIndex === undefined) return;
      activate(matchedIndex);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, [keyMap]);

  const activate = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);

    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setIsAutoPlaying(true);
    }, AUTO_RESUME_DELAY);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.1),transparent_45%)]" />

        <div
          className="relative mx-auto w-full max-w-[760px]"
          style={{ perspective: "1600px" }}
        >
          <div
            className="relative"
            style={{
              transform: "rotateX(62deg) rotateZ(-24deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="absolute inset-0 translate-y-16 rounded-[2.5rem] bg-black/35 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.5)]">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                  Keyboard
                </p>
                <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-600">
                  {isAutoPlaying ? "Auto demo" : "Manual mode"}
                </span>
              </div>

              <div className="grid gap-5">
                <div className="grid grid-cols-4 gap-4">
                  {skills.slice(0, 4).map((skill, index) => (
                    <Keycap3D
                      key={skill.key}
                      skill={skill}
                      active={activeIndex === index}
                      onActivate={() => activate(index)}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 pl-10">
                  {skills.slice(4).map((skill, index) => {
                    const actualIndex = index + 4;

                    return (
                      <Keycap3D
                        key={skill.key}
                        skill={skill}
                        active={activeIndex === actualIndex}
                        onActivate={() => activate(actualIndex)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900 text-lg font-semibold text-white shadow-lg shadow-black/30">
            {activeSkill.key}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Active Skill
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-white">
              {activeSkill.label}
            </h3>
          </div>
        </div>

        <p className="mt-6 leading-7 text-neutral-400">
          {activeSkill.description}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {skills.map((skill, index) => {
            const isCurrent = index === activeIndex;

            return (
              <button
                key={skill.key}
                type="button"
                onMouseEnter={() => activate(index)}
                onClick={() => activate(index)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  isCurrent
                    ? "border-white bg-white text-neutral-950"
                    : "border-white/10 bg-neutral-900/60 text-neutral-300 hover:border-white/20 hover:bg-neutral-900"
                }`}
              >
                <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                  {skill.key}
                </div>
                <div className="mt-1 text-sm font-medium">{skill.label}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.key}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-500"
            >
              Press {skill.key}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Keycap3D({
  skill,
  active,
  onActivate,
}: {
  skill: Skill;
  active: boolean;
  onActivate: () => void;
}) {
  const topTranslate = active ? 8 : 0;

  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onClick={onActivate}
      className="group relative h-[110px] w-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-x-2 bottom-0 h-6 rounded-[1rem] bg-black/45 blur-xl" />

      <div
        className="absolute inset-x-0 bottom-0 h-[26px] rounded-b-[1.1rem]"
        style={{
          background: active
            ? "linear-gradient(to bottom, rgba(180,180,180,0.75), rgba(95,95,95,0.9))"
            : "linear-gradient(to bottom, rgb(63,63,70), rgb(24,24,27))",
        }}
      />

      <div
        className="absolute right-0 top-3 h-[72px] w-[14px] rounded-r-[1rem]"
        style={{
          background: active
            ? "linear-gradient(to right, rgba(210,210,210,0.65), rgba(120,120,120,0.92))"
            : "linear-gradient(to right, rgb(82,82,91), rgb(30,30,35))",
          transform: "skewY(-45deg)",
          transformOrigin: "top",
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-[78px] rounded-[1.1rem] border transition-all duration-200"
        style={{
          transform: `translateY(${topTranslate}px)`,
          background: active
            ? "linear-gradient(to bottom, rgb(255,255,255), rgb(236,236,236))"
            : "linear-gradient(to bottom, rgb(35,35,38), rgb(18,18,20))",
          borderColor: active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.08)",
          boxShadow: active
            ? "0 8px 24px rgba(255,255,255,0.12)"
            : "0 14px 28px rgba(0,0,0,0.35)",
        }}
      >
        <div
          className="absolute inset-x-2 top-2 h-5 rounded-full blur-md"
          style={{
            background: active
              ? "rgba(255,255,255,0.55)"
              : "rgba(255,255,255,0.08)",
          }}
        />

        <div
          className={`relative flex h-full flex-col justify-between px-4 py-3 text-left ${
            active ? "text-neutral-950" : "text-neutral-100"
          }`}
        >
          <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            {skill.key}
          </span>
          <span className="text-sm font-medium">{skill.label}</span>
        </div>

        {active && (
          <>
            <div className="pointer-events-none absolute inset-0 rounded-[1.1rem] ring-1 ring-white/35" />
            <div className="pointer-events-none absolute -inset-3 rounded-[1.6rem] bg-white/10 blur-xl" />
          </>
        )}
      </div>
    </button>
  );
}