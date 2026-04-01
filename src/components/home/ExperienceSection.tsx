import Reveal from "../ui/Reveal";

const experiences = [
  {
    company: "Your Company",
    role: "Full Stack Developer",
    period: "2024 — Present",
    points: [
      "Built modern web interfaces with React, TypeScript, and Tailwind.",
      "Improved performance, maintainability, and developer experience.",
      "Worked across frontend architecture, UI systems, and product delivery.",
    ],
  },
  {
    company: "Freelance",
    role: "Frontend / Full Stack Developer",
    period: "2022 — 2024",
    points: [
      "Delivered landing pages, portfolio sites, and internal dashboards.",
      "Collaborated with clients on product structure and visual direction.",
      "Shipped responsive, conversion-focused websites for multiple use cases.",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative scroll-mt-24 py-16 md:py-24 outline-none focus:outline-none">
      <div 
        className="absolute z-[-1] hidden w-screen select-none overflow-hidden pointer-events-none md:block" 
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        <div className="sticky top-0 flex h-screen w-full items-center justify-start opacity-95">
          
          {/* 【白天的视频】 
              出现时: delay-500 延时0.5秒等背景变白, 然后 duration-1000 缓慢出现
              消失时: dark:delay-0 dark:duration-0 切黑夜时立马隐身
          */}
          <video 
            className="w-[200%] md:w-[80vw] lg:w-[55vw] absolute object-cover -ml-5 lg:-ml-5 -mt-20 lg:-mt-32 !outline-none !border-none !ring-0 focus:outline-none focus:ring-0 select-none pointer-events-none transition-opacity duration-1000 delay-300 dark:duration-0 dark:delay-0 opacity-100 dark:opacity-0" 
            autoPlay 
            playsInline 
            loop 
            muted
            disablePictureInPicture 
            disableRemotePlayback
            tabIndex={-1}
          >
            <source src="/videos/video.mp4" type="video/mp4" />
          </video>

          {/* 【夜晚的图片】 
              出现时: dark:delay-500 延时0.5秒等背景变黑, 然后 dark:duration-1000 缓慢出现
              消失时: delay-0 duration-0 切白天时立马隐身
          */}
          <img 
            src="/pictures/dark.png" 
            alt="Sleeping at night"
            loading="lazy"
            className="w-[200%] md:w-[80vw] lg:w-[31vw] absolute object-cover ml-10 lg:ml-[10vw] -mt-20 lg:mt-2 pointer-events-none select-none transition-opacity duration-0 delay-0 dark:duration-1000 dark:delay-200 opacity-0 dark:opacity-100" 
          />

        </div>
      </div>

      <Reveal className="max-w-2xl relative z-10 pointer-events-none">
        <p className="text-sm tracking-[0.25em] opacity-50 uppercase">
          Experience
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
          Work that reflects both craft and impact.
        </h2>
      </Reveal>

      <div className="mt-12 flex lg:justify-end relative z-10">
        <div className="w-full lg:w-[55%] space-y-6">
          {experiences.map((item, index) => (
            <Reveal key={`${item.company}-${item.period}`} delay={index * 140} y={26}>
              <article className="rounded-[2rem] border border-gray-500/20 bg-gray-500/10 p-6 md:p-8 backdrop-blur-md transition-colors hover:bg-gray-500/20 shadow-xl shadow-black/5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {item.role}
                    </h3>
                    <p className="mt-1 opacity-80">{item.company}</p>
                  </div>
                  <p className="text-sm opacity-50">{item.period}</p>
                </div>

                <ul className="mt-6 space-y-3 opacity-70">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}