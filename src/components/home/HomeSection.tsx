import Hero from "./Hero";
import InspirationSection from "./InspirationSection";
import ProjectsSection from "./ProjectsSection";

export default function HomeSection() {
  return (
    <section className="relative min-h-screen">
      <main className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-24 pt-24 md:px-10">
        <Hero />
        <InspirationSection />
        <ProjectsSection />
      </main>
    </section>
  );
}
