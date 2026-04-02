import Reveal from "../ui/Reveal";
import MonochromeLineFlow from "../MonochromeLineFlow";

export default function InspirationPageSection() {
  return (
    <section id="inspiration" className="relative flex-1 min-h-0 overflow-visible outline-none focus:outline-none">
      <div
        className="absolute z-[-1] pointer-events-none overflow-hidden select-none w-screen left-1/2 -translate-x-1/2 lg:left-[40%] lg:-translate-x-[45%]"
      >
        <div className="sticky top-0 flex h-screen w-full items-center justify-start opacity-95">
          <video
            className="w-[180%] md:w-[68vw] lg:w-[46vw] absolute object-cover -ml-12 lg:-ml-[3vw] -mt-20 lg:-mt-140 !outline-none !border-none !ring-0 focus:outline-none focus:ring-0 select-none pointer-events-none transition-opacity duration-1000 delay-300 dark:duration-0 dark:delay-0 opacity-100 dark:opacity-0"
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

          <img
            src="/pictures/dark.png"
            alt="Sleeping at night"
            loading="lazy"
            className="w-[180%] md:w-[68vw] lg:w-[26vw] absolute object-cover ml-2 lg:ml-[6vw] -mt-20 lg:-mt-115 pointer-events-none select-none transition-opacity duration-0 delay-0 dark:duration-1000 dark:delay-200 opacity-0 dark:opacity-100"
          />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex justify-center lg:justify-end overflow-visible">
        <Reveal className="w-full max-w-[960px] lg:max-w-[min(86vw,960px)] lg:ml-auto lg:translate-x-0" y={26}>
          <MonochromeLineFlow className="aspect-[2/1] w-full max-w-full" />
        </Reveal>
      </div>
    </section>
  );
}
