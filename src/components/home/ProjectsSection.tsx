import Reveal from "../ui/Reveal";

const projects = [
  {
    title: "Project One",
    type: "Portfolio",
    description:
      "A modern personal portfolio focused on speed, clarity, and visual rhythm.",
  },
  {
    title: "Project Two",
    type: "Dashboard",
    description:
      "An internal dashboard inspiration with reusable UI patterns and clean data views.",
  },
  {
    title: "Project Three",
    type: "Landing Page",
    description:
      "A conversion-focused marketing page designed with strong hierarchy and responsive layout.",
  },
  {
    title: "Project Four",
    type: "Web App",
    description:
      "A product-style frontend built with scalable components and polished interactions.",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-24 py-16 md:py-24">
      <Reveal className="mb-10 max-w-2xl">
        <p className="text-sm tracking-[0.25em] opacity-50 uppercase">
          Projects
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
          Selected work and product experiments.
        </h2>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.title} delay={index * 110} y={24}>
            <article className="group rounded-[2rem] border border-gray-500/20 bg-gray-500/10 p-6 transition hover:border-gray-500/30 hover:bg-gray-500/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm opacity-50">{project.type}</p>
                  <h3 className="mt-2 text-xl font-semibold">
                    {project.title}
                  </h3>
                </div>

                <span className="rounded-full border border-gray-500/30 px-3 py-1 text-xs opacity-60">
                  Case
                </span>
              </div>

              <p className="mt-4 leading-7 opacity-70">
                {project.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}