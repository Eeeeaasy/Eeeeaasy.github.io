import { useEffect, useState } from "react";
import { PLAYER_QUEUE } from "../../data/playerQueue";

export default function DynamicProjectHeader() {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.activeIndex !== undefined) setActiveIndex(e.detail.activeIndex);
    };
    window.addEventListener("projects-player-index-change", handler);
    return () => window.removeEventListener("projects-player-index-change", handler);
  }, []);
  const track = PLAYER_QUEUE[activeIndex] || PLAYER_QUEUE[0];
  return (
    <section className="mt-[30vh] text-center md:mt-[30vh]">
      <p className="text-sm text-white uppercase tracking-[0.25em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">Demo</p>
      <h1 className="mt-3 text-4xl font-semibold text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.52)] md:text-5xl">{track.title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
        {track.subtitle}
      </p>
    </section>
  );
}
