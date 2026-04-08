import CharacterModel from "./CharacterModel";
import { useEffect, useRef, useState } from "react";
import { PLAYER_QUEUE, type PlayerQueueTrack } from "../../data/playerQueue";

type ProjectsCornerAvatarProps = {
  modelPath?: string;
  showAvatar?: boolean;
};

// Projects 页左下角小人的布局参数：只改这里就能调大小和位置。
const CORNER_AVATAR_LAYOUT = {
  anchorLeft: "50%",
  anchorBottom: "-2vh",
  containerWidth: "clamp(320px, 40vw, 560px)",
  containerHeight: "clamp(280px, 36vh, 430px)",
  modelWidth: "clamp(250px, 24vw, 350px)",
  modelBottom: "-10%",
} as const;

// Projects 页小人阴影参数：调这里即可控制立体感强弱。
const CORNER_AVATAR_SHADOW = {
  groundWidth: "clamp(130px, 18vw, 220px)",
  groundHeight: "clamp(18px, 2.6vw, 30px)",
  groundOpacity: 0.28,
  groundBlur: 14,
  groundBottom: "4%",
  modelDropShadow: "drop-shadow(0 10px 18px rgba(0,0,0,0.22))",
} as const;

// 小人背后的磨砂玻璃播放器模块参数。
const CORNER_AVATAR_PLAYER = {
  bottom: "25%",
  width: "clamp(720px, 92vw, 1280px)",
  mainWidth: "clamp(420px, 52vw, 760px)",
  height: "clamp(132px, 18vh, 184px)",
} as const;

// 小人头部朝向参数：固定仰头，并且只允许左右转动。
const CORNER_AVATAR_HEAD = {
  fixedHeadPitch: -0.22,
  yawRange: 0.34,
} as const;

// Projects 页小人专属打光参数：只改这里，不影响首页小人。
const CORNER_AVATAR_LIGHT = {
  ambientIntensity:1,
  keyLightPosition: [2.4, 3.5, 4.8] as [number, number, number],
  keyLightIntensity: 1.35,
  fillLightPosition: [-2.2, 1.8, 3.2] as [number, number, number],
  fillLightIntensity: 0.42,
  spotLightPosition: [0.5, 4.8, 2.6] as [number, number, number],
  spotLightAngle: 0.42,
  spotLightPenumbra: 0.9,
  spotLightIntensity: 0.82,
} as const;

const wrapQueueIndex = (index: number) => {
  const len = PLAYER_QUEUE.length;
  return ((index % len) + len) % len;
};

const CAROUSEL_OUT_DURATION = 180;
const CAROUSEL_IN_DURATION = 260;
const CAROUSEL_EASING = "cubic-bezier(0.16,1,0.3,1)";

function FrostedPlayer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [carouselPhase, setCarouselPhase] = useState<"idle" | "out" | "in">("idle");
  const [carouselDirection, setCarouselDirection] = useState<"prev" | "next">("next");
  const phaseTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  const currentTrack = PLAYER_QUEUE[activeIndex];
  const getTrackByOffset = (offset: number) => PLAYER_QUEUE[wrapQueueIndex(activeIndex + offset)];

  const emitPlayerState = (cover: string, playing: boolean) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("projects-player-state-change", {
        detail: { cover, isPlaying: playing },
      }),
    );
  };

  const triggerCycle = (direction: "prev" | "next", updater: (prev: number) => number) => {
    if (carouselPhase !== "idle") return;

    setCarouselDirection(direction);
    setCarouselPhase("out");

    if (phaseTimerRef.current !== null) {
      window.clearTimeout(phaseTimerRef.current);
    }
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }

    phaseTimerRef.current = window.setTimeout(() => {
      const nextIndex = updater(activeIndex);
      setActiveIndex(nextIndex);
      // 广播当前 activeIndex
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("projects-player-index-change", { detail: { activeIndex: nextIndex } })
        );
      }
      setCarouselPhase("in");
      phaseTimerRef.current = null;

      settleTimerRef.current = window.setTimeout(() => {
        setCarouselPhase("idle");
        settleTimerRef.current = null;
      }, CAROUSEL_IN_DURATION);
    }, CAROUSEL_OUT_DURATION);
  };

  const goPrev = () => triggerCycle("prev", (prev) => wrapQueueIndex(prev - 1));
  const goNext = () => triggerCycle("next", (prev) => wrapQueueIndex(prev + 1));

  useEffect(() => {
    emitPlayerState(currentTrack.cover, isPlaying);
    // 首次挂载时也广播一次索引，确保页面初始同步
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("projects-player-index-change", { detail: { activeIndex } })
      );
    }
  }, [currentTrack.cover, isPlaying, activeIndex]);

  useEffect(() => {
    return () => {
      if (phaseTimerRef.current !== null) {
        window.clearTimeout(phaseTimerRef.current);
      }
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  const getSidePhaseTransform = (align: "left" | "right") => {
    if (carouselPhase === "idle") return "translateX(0px) scale(1)";

    if (carouselPhase === "out") {
      if (carouselDirection === "next") {
        return align === "left" ? "translateX(-48px) scale(0.93)" : "translateX(-22px) scale(0.96)";
      }
      return align === "left" ? "translateX(22px) scale(0.96)" : "translateX(48px) scale(0.93)";
    }

    if (carouselDirection === "next") {
      return align === "left" ? "translateX(30px) scale(1.03)" : "translateX(48px) scale(1.03)";
    }
    return align === "left" ? "translateX(-48px) scale(1.03)" : "translateX(-30px) scale(1.03)";
  };

  const getMainPhaseTransform = () => {
    if (carouselPhase === "idle") return "translateX(0px) scale(1)";
    if (carouselPhase === "out") {
      return carouselDirection === "next"
        ? "translateX(-30px) scale(0.95)"
        : "translateX(30px) scale(0.95)";
    }
    return carouselDirection === "next"
      ? "translateX(46px) scale(1.035)"
      : "translateX(-46px) scale(1.035)";
  };

  const getMainPhaseBlur = () => {
    if (carouselPhase === "idle") return 0;
    return carouselPhase === "out" ? 1.8 : 0.8;
  };

  const getSidePhaseBlur = () => {
    if (carouselPhase === "idle") return 0;
    return carouselPhase === "out" ? 2.2 : 1.1;
  };

  const mainPhaseOpacity = carouselPhase === "idle" ? 1 : carouselPhase === "out" ? 0.72 : 0.96;
  const sidePhaseOpacity = carouselPhase === "idle" ? 1 : carouselPhase === "out" ? 0.7 : 0.9;
  const phaseDuration = carouselPhase === "out" ? CAROUSEL_OUT_DURATION : CAROUSEL_IN_DURATION;

  const QueueSideCard = ({ track, align, depth }: { track: PlayerQueueTrack; align: "left" | "right"; depth: number }) => (
    <div
      className="absolute hidden rounded-3xl border border-white/62 bg-white/30 px-3 py-3 backdrop-blur-sm transition-all duration-300 md:block"
      style={{
        top: "50%",
        left: "50%",
        width: "clamp(240px, 20vw, 340px)",
        minHeight: "clamp(108px, 12vh, 148px)",
        zIndex: 3 - depth,
        opacity: 0.92 - depth * 0.28,
        boxShadow:
          depth === 0
            ? "0 16px 32px rgba(0,0,0,0.18)"
            : "0 10px 20px rgba(0,0,0,0.14)",
        filter: depth === 1 ? "saturate(0.82) brightness(0.94)" : "none",
        transform:
          align === "left"
            ? `translate(-50%, -50%) translateX(${-58 - depth * 88}px) translateY(${depth * 2}px) scale(${1 - depth * 0.14}) rotateY(26deg) rotateZ(${-1.2 - depth * 0.6}deg)`
            : `translate(-50%, -50%) translateX(${58 + depth * 88}px) translateY(${depth * 2}px) scale(${1 - depth * 0.14}) rotateY(-26deg) rotateZ(${1.2 + depth * 0.6}deg)`,
      }}
    >
      <div className="grid grid-cols-[64px_1fr] items-center gap-2.5">
        <img src={track.cover} alt={track.title} className="h-16 w-16 rounded-xl object-cover opacity-90" loading="lazy" decoding="async" />
        <div className="min-w-0">
          <p className="truncate text-[9px] uppercase tracking-[0.18em] text-black/38">{align === "left" ? "Prev Queue" : "Next Queue"}</p>
          <p className="truncate text-[13px] font-semibold leading-tight text-black/64">{track.title}</p>
          <p className="truncate text-[10px] leading-tight text-black/46">{track.artist}</p>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full bg-black/18" style={{ width: `${track.progress}%` }} />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes demoPlayerBreath {
          0%, 100% {
            box-shadow: 0 30px 50px rgba(9,15,31,0.20), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -10px 24px rgba(255,255,255,0.08);
          }
          50% {
            box-shadow: 0 32px 54px rgba(9,15,31,0.22), inset 0 1px 0 rgba(255,255,255,0.70), inset 0 -11px 26px rgba(255,255,255,0.09);
          }
        }

        @keyframes demoPlayerButtonBreath {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7);
          }
          50% {
            transform: scale(1.012);
            box-shadow: 0 9px 18px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.75);
          }
        }

      `}</style>

      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: CORNER_AVATAR_PLAYER.bottom,
          width: CORNER_AVATAR_PLAYER.width,
          height: CORNER_AVATAR_PLAYER.height,
          zIndex: 1,
          transform: "translateX(-50%)",
        }}
      >
        <div className="grid h-full grid-cols-[minmax(260px,1fr)_minmax(420px,760px)_minmax(260px,1fr)] items-center gap-5 md:gap-6">
          <div
            className="relative hidden h-full items-center justify-center md:flex"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
              transform: getSidePhaseTransform("left"),
              opacity: sidePhaseOpacity,
              filter: `blur(${getSidePhaseBlur()}px)`,
              transition: `transform ${phaseDuration}ms ${CAROUSEL_EASING}, opacity ${phaseDuration}ms ${CAROUSEL_EASING}, filter ${phaseDuration}ms ${CAROUSEL_EASING}`,
            }}
          >
            <QueueSideCard track={getTrackByOffset(-1)} align="left" depth={0} />
            <QueueSideCard track={getTrackByOffset(-2)} align="left" depth={1} />
          </div>

          <div
            className="relative h-full overflow-hidden rounded-3xl border border-white/80 p-3.5 backdrop-blur-[2px] transition-all duration-500 dark:border-white/42"
            style={{
              animation: "demoPlayerBreath 10.5s ease-in-out infinite",
              transform: `${getMainPhaseTransform()} translateZ(0)`,
              opacity: mainPhaseOpacity,
              filter: `blur(${getMainPhaseBlur()}px)`,
              transition: `transform ${phaseDuration}ms ${CAROUSEL_EASING}, opacity ${phaseDuration}ms ${CAROUSEL_EASING}, filter ${phaseDuration}ms ${CAROUSEL_EASING}`,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.24) 48%, rgba(255,255,255,0.13) 100%)",
              outline: "1px solid rgba(255,255,255,0.62)",
              outlineOffset: "-1px",
              pointerEvents: "auto",
              zIndex: 10,
            }}
          >
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              "radial-gradient(140% 120% at 18% 12%, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.06) 46%, rgba(255,255,255,0.00) 72%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            opacity: 0.06,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 1px, transparent 1px, transparent 5px)",
            mixBlendMode: "soft-light",
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 34%, rgba(0,0,0,0.04) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute left-0 right-0 top-0 h-[1px]"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.54) 50%, rgba(255,255,255,0.14) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.54) 50%, rgba(255,255,255,0.14) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute bottom-0 top-0 left-0 w-[1px]"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.22) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute bottom-0 top-0 right-0 w-[1px]"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.52) 50%, rgba(255,255,255,0.18) 100%)",
            pointerEvents: "none",
          }}
        />

        <div className="grid grid-cols-[108px_1fr] items-center gap-3">
        <div className="grid h-[96px] w-[96px] place-items-center rounded-2xl border border-white/55 bg-white/22 shadow-[0_8px_18px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-white/18 dark:bg-white/8">
          <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-xl border border-black/10 bg-zinc-200 shadow-[0_8px_16px_rgba(0,0,0,0.26)] dark:border-white/20 dark:bg-zinc-700">
            <img
              src={currentTrack.cover}
              alt="Album cover"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(255,255,255,0.45),transparent_42%)]" />
            <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/28 to-transparent" />
            <div className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-white/65 bg-black/45 dark:bg-white/65" />
          </div>
        </div>

        <div className="min-w-0 self-start pt-0.5">
          <p className="truncate text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-white/55">Now Playing</p>
          <p className="truncate text-sm font-semibold text-black/85 dark:text-white/90">{currentTrack.title}</p>
          <p className="truncate text-xs text-black/55 dark:text-white/55">{currentTrack.artist}</p>

          <div className="mt-1 flex items-center justify-end gap-3.5 pr-14 md:pr-20 text-black/68 dark:text-white/75">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-black/12 bg-white/62 shadow-[0_8px_14px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.72)] dark:border-white/20 dark:bg-white/16"
              style={{ animation: "demoPlayerButtonBreath 9.8s ease-in-out infinite" }}
              aria-label="Previous"
              onClick={goPrev}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M11 18V6a1 1 0 0 0-1.53-.85L2 10.15a1 1 0 0 0 0 1.7l7.47 5A1 1 0 0 0 11 18Zm11 0V6a1 1 0 0 0-1.53-.85l-7.47 5a1 1 0 0 0 0 1.7l7.47 5A1 1 0 0 0 22 18Z" />
              </svg>
            </button>

            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/14 bg-white/70 shadow-[0_10px_18px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.78)] dark:border-white/24 dark:bg-white/22"
              style={{ animation: "demoPlayerButtonBreath 9.8s ease-in-out infinite" }}
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={() => setIsPlaying((prev) => !prev)}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden="true">
                  <path d="M7 5.5A1.5 1.5 0 0 1 8.5 7v10a1.5 1.5 0 1 1-3 0V7A1.5 1.5 0 0 1 7 5.5Zm9.5 0A1.5 1.5 0 0 1 18 7v10a1.5 1.5 0 1 1-3 0V7a1.5 1.5 0 0 1 1.5-1.5Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden="true">
                  <path d="M6.5 6.2v11.6a.9.9 0 0 0 1.38.76l8.6-5.8a.9.9 0 0 0 0-1.52l-8.6-5.8a.9.9 0 0 0-1.38.76Z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-black/12 bg-white/62 shadow-[0_8px_14px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.72)] dark:border-white/20 dark:bg-white/16"
              style={{ animation: "demoPlayerButtonBreath 9.8s ease-in-out infinite" }}
              aria-label="Next"
              onClick={goNext}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M13 18V6a1 1 0 0 1 1.53-.85l7.47 5a1 1 0 0 1 0 1.7l-7.47 5A1 1 0 0 1 13 18ZM2 18V6a1 1 0 0 1 1.53-.85l7.47 5a1 1 0 0 1 0 1.7l-7.47 5A1 1 0 0 1 2 18Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-black/55 dark:text-white/55">
        <span>{currentTrack.elapsed}</span>
        <div className="relative h-[7px] flex-1 overflow-hidden rounded-full bg-black/12 shadow-inner dark:bg-white/15">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-300/80 via-sky-300/70 to-indigo-300/65 dark:from-cyan-200/85 dark:to-indigo-200/70" style={{ width: `${currentTrack.progress}%` }} />
          <div className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-sky-300/75 dark:bg-white dark:ring-sky-200/60" style={{ left: `${currentTrack.progress}%` }} />
        </div>
        <span>{currentTrack.duration}</span>
      </div>

      <div className="mt-2.5 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-black/55 dark:text-white/60" fill="currentColor" aria-hidden="true">
            <path d="M4 10v4h3l4 4V6L7 10H4Zm10.5 2a4.5 4.5 0 0 0-2.12-3.82v7.64A4.5 4.5 0 0 0 14.5 12Zm0-8.5v2.06A8 8 0 0 1 19 12a8 8 0 0 1-4.5 7.44v2.06A10 10 0 0 0 21 12 10 10 0 0 0 14.5 3.5Z" />
          </svg>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-black/12 shadow-inner dark:bg-white/15">
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-cyan-300/80 to-indigo-300/70 dark:from-cyan-200/80 dark:to-indigo-200/70" />
          </div>
        </div>
      </div>
          </div>

          <div
            className="relative hidden h-full items-center justify-center md:flex"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
              transform: getSidePhaseTransform("right"),
              opacity: sidePhaseOpacity,
              filter: `blur(${getSidePhaseBlur()}px)`,
              transition: `transform ${phaseDuration}ms ${CAROUSEL_EASING}, opacity ${phaseDuration}ms ${CAROUSEL_EASING}, filter ${phaseDuration}ms ${CAROUSEL_EASING}`,
            }}
          >
            <QueueSideCard track={getTrackByOffset(1)} align="right" depth={0} />
            <QueueSideCard track={getTrackByOffset(2)} align="right" depth={1} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProjectsCornerAvatar({
  modelPath = "/models/withAudio.glb",
  showAvatar = true,
}: ProjectsCornerAvatarProps) {
  return (
    <div
      className="pointer-events-none fixed z-20 overflow-visible"
      style={{
        bottom: CORNER_AVATAR_LAYOUT.anchorBottom,
        left: CORNER_AVATAR_LAYOUT.anchorLeft,
        transform: "translateX(-50%)",
        width: CORNER_AVATAR_LAYOUT.containerWidth,
        height: CORNER_AVATAR_LAYOUT.containerHeight,
      }}
    >
      <FrostedPlayer />

      {showAvatar && (
        <>
          <div
            className="absolute rounded-full"
            style={{
              width: CORNER_AVATAR_SHADOW.groundWidth,
              height: CORNER_AVATAR_SHADOW.groundHeight,
              left: "50%",
              bottom: CORNER_AVATAR_SHADOW.groundBottom,
              transform: "translateX(-50%)",
              opacity: CORNER_AVATAR_SHADOW.groundOpacity,
              filter: `blur(${CORNER_AVATAR_SHADOW.groundBlur}px)`,
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 68%, rgba(0,0,0,0) 100%)",
            }}
          />

          <div
            className="absolute"
            style={{
              left: "50%",
              bottom: CORNER_AVATAR_LAYOUT.modelBottom,
              transform: "translateX(-50%)",
              width: CORNER_AVATAR_LAYOUT.modelWidth,
              filter: CORNER_AVATAR_SHADOW.modelDropShadow,
              zIndex: 2,
            }}
          >
            <CharacterModel
              modelPath={modelPath}
              lockHeadPitch
              fixedHeadPitch={CORNER_AVATAR_HEAD.fixedHeadPitch}
              yawRange={CORNER_AVATAR_HEAD.yawRange}
              lightConfig={CORNER_AVATAR_LIGHT}
            />
          </div>
        </>
      )}
    </div>
  );
}