import Reveal from "../ui/Reveal";
import Keyboard3D from "./Keyboard3D";

export default function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-24 py-10 md:py-14">
      <Reveal className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] opacity-50">
            Tech Stack
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
            Tactile UI, playful motion.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 opacity-70">
            A keyboard-inspired interaction lab built with React, Tailwind,
            perspective, and motion design principles.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em]">
          <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 opacity-70 dark:border-white/15 dark:bg-white/10">
            hover
          </span>
          <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 opacity-70 dark:border-white/15 dark:bg-white/10">
            click
          </span>
          <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 opacity-70 dark:border-white/15 dark:bg-white/10">
            press key
          </span>
        </div>
      </Reveal>

      <Reveal delay={120} y={28}>
        <div className="relative overflow-hidden rounded-[2.2rem] border border-black/10 bg-white/55 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(255,180,80,0.2),transparent_34%)] dark:bg-[radial-gradient(circle_at_12%_15%,rgba(255,255,255,0.1),transparent_34%)]" />
          <div className="pointer-events-none absolute right-[-20%] top-[-32%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.08),transparent_65%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_65%)]" />

          <div className="relative z-10">
            <Keyboard3D />
          </div>
        </div>
      </Reveal>
    </section>
  );
}