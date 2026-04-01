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
    description: "Typed superset of JavaScript for safer code.",
  },
  {
    key: "J",
    label: "JavaScript",
    description: "Core language of the web.",
  },
  {
    key: "N",
    label: "Node.js",
    description: "Backend runtime for scalable apps.",
  },
  {
    key: "W",
    label: "Tailwind",
    description: "Utility-first CSS framework for rapid UI development.",
  },
  {
    key: "D",
    label: "Docker",
    description: "Container platform for consistent development and deployment.",
  },
  {
    key: "G",
    label: "Git",
    description: "Version control system for tracking code changes and collaboration.",
  },
];

const AUTO_PLAY_INTERVAL = 1800;
const AUTO_PLAY_RESUME_DELAY = 5000;

export default function SkillsKeyboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const resumeTimeoutRef = useRef<number | null>(null);

  const activeSkill = skills[activeIndex];

  const skillMap = useMemo(() => {
    return new Map(skills.map((skill, index) => [skill.key, index]));
  }, []);

  const pauseAutoPlayTemporarily = () => {
    setIsAutoPlaying(false);

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsAutoPlaying(true);
    }, AUTO_PLAY_RESUME_DELAY);
  };

  const activateSkill = (index: number, manual = false) => {
    setActiveIndex(index);

    if (manual) {
      pauseAutoPlayTemporarily();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key.toUpperCase();
      const matchedIndex = skillMap.get(pressedKey);

      if (matchedIndex === undefined) return;

      activateSkill(matchedIndex, true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [skillMap]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % skills.length);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [isAutoPlaying]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
            Keyboard
          </p>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span
              className={`h-2 w-2 rounded-full ${
                isAutoPlaying ? "bg-emerald-400" : "bg-neutral-600"
              }`}
            />
            <span>{isAutoPlaying ? "Auto demo" : "Manual mode"}</span>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-4 gap-3">
            {skills.slice(0, 4).map((skill, index) => (
              <Keycap
                key={skill.key}
                skill={skill}
                isActive={activeIndex === index}
                onActivate={() => activateSkill(index, true)}
              />
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3 px-6">
            {skills.slice(4).map((skill, index) => {
              const actualIndex = index + 4;

              return (
                <Keycap
                  key={skill.key}
                  skill={skill}
                  isActive={activeIndex === actualIndex}
                  onActivate={() => activateSkill(actualIndex, true)}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-500">
          <span className="rounded-full border border-white/10 px-3 py-1">
            Press A
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Press R
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Press T
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Press J
          </span>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
          Active Skill
        </p>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900 text-lg font-semibold text-white shadow-lg shadow-black/20">
            {activeSkill.key}
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white">
              {activeSkill.label}
            </h3>
            <p className="text-sm text-neutral-500">Triggered by keyboard input</p>
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
                onClick={() => activateSkill(index, true)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  isCurrent
                    ? "border-white bg-white text-neutral-950"
                    : "border-white/10 bg-neutral-900/70 text-neutral-300 hover:border-white/20 hover:bg-neutral-900"
                }`}
              >
                <div className="text-xs uppercase tracking-[0.2em] opacity-70">
                  {skill.key}
                </div>
                <div className="mt-1 text-sm font-medium">{skill.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Keycap({
  skill,
  isActive,
  onActivate,
}: {
  skill: Skill;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onClick={onActivate}
      className={`group relative h-24 rounded-[1.35rem] border text-left transition-all duration-200 ${
        isActive
          ? "translate-y-[3px] border-white/80"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div
        className={`absolute inset-0 rounded-[1.35rem] transition-all duration-200 ${
          isActive
            ? "bg-white shadow-[0_0_30px_rgba(255,255,255,0.12)]"
            : "bg-neutral-800"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-[-6px] top-[10px] rounded-[1.35rem] transition-all duration-200 ${
          isActive ? "bg-neutral-300/30" : "bg-black/30"
        }`}
      />

      <div
        className={`relative z-10 flex h-full flex-col justify-between rounded-[1.35rem] px-4 py-3 ${
          isActive ? "text-neutral-950" : "text-neutral-100"
        }`}
      >
        <span
          className={`text-[11px] uppercase tracking-[0.22em] ${
            isActive ? "text-neutral-600" : "text-neutral-500"
          }`}
        >
          {skill.key}
        </span>

        <span className="text-sm font-medium">{skill.label}</span>
      </div>

      {isActive && (
        <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-white/40" />
      )}
    </button>
  );
}