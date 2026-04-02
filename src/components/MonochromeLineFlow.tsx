import { useEffect, useMemo, useRef, useState } from "react";
import { INSPIRATION_CARDS, type InspirationCard } from "../data/inspirationCards";

type MonochromeLineFlowProps = {
  className?: string;
};

// 以容器中心为锚点：无论收紧或展开，整组中心位置不变。
const STACK_CENTER_Y = 50;
const DEFAULT_CONTAINER_WIDTH = 980;
const DEFAULT_CONTAINER_HEIGHT = 480;
const OPEN_SNAPSHOT_KEY = "inspiration-open-snapshot-v1";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));


function FolderCard({
  card,
  topStep,
  leftStep,
  middleIndex,
  cardWidth,
  cardHeight,
  stackBaseLeft,
}: {
  card: InspirationCard;
  topStep: number;
  leftStep: number;
  middleIndex: number;
  cardWidth: number;
  cardHeight: number;
  stackBaseLeft: number;
}) {
  const tabLeft = Math.max(5, Math.min(70, card.notch));
  const relativeIndex = card.id - 1 - middleIndex;
  const cardTop = STACK_CENTER_Y - cardHeight / 2 + relativeIndex * topStep;
  const cardLeft = relativeIndex * leftStep;

  return (
    <a
      className={`mlf-card mlf-card-${card.id} absolute cursor-pointer`}
      href={`/inspiration/${card.id}`}
      data-astro-prefetch
      style={{
        top: `${cardTop}%`,
        left: `calc(${stackBaseLeft}% + ${cardLeft}%)`,
        width: `${cardWidth}%`,
        height: `${cardHeight}%`,
      }}
      aria-label={`Open inspiration card ${card.id}`}
      onClick={(event) => {
        if (typeof window === "undefined") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const payload = {
          id: card.id,
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          ts: Date.now(),
        };
        window.sessionStorage.setItem(OPEN_SNAPSHOT_KEY, JSON.stringify(payload));
      }}
    >
      <div className="mlf-card-inner absolute inset-0 transition-transform duration-200 ease-out">
        <div className="absolute inset-x-0 top-[10%] h-[18%] rounded-t-[0.75rem] border-2 border-b-0 border-black bg-white shadow-[0_2px_0_rgba(0,0,0,0.08)] dark:border-white/70 dark:bg-neutral-900 dark:shadow-[0_2px_0_rgba(255,255,255,0.08)]" />

        <div className="absolute inset-x-0 top-[28%] bottom-0 rounded-b-[0.95rem] border-2 border-black bg-white shadow-[0_12px_20px_rgba(0,0,0,0.12),0_2px_0_rgba(0,0,0,0.08)] dark:border-white/70 dark:bg-neutral-900 dark:shadow-[0_14px_24px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.08)]" />
        <div className="pointer-events-none absolute inset-x-[2px] top-[30%] h-[8%] rounded-full bg-black/5 blur-[1px] dark:bg-white/10" />
        <div className="pointer-events-none absolute inset-x-[4px] top-[32%] h-[1px] bg-white/70 dark:bg-white/25" />

        <div
          className={`absolute top-0 h-[30%] w-[28%] rounded-t-[0.7rem] border-2 border-b-0 border-black shadow-[0_4px_8px_rgba(0,0,0,0.12)] dark:border-white/80 dark:shadow-[0_4px_8px_rgba(0,0,0,0.38)] ${
            card.darkLabel
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white text-black dark:bg-neutral-900 dark:text-white"
          }`}
          style={{ left: `${tabLeft}%` }}
        />

        {card.label && (
          <p
            className={`absolute top-[6%] max-w-[24%] truncate text-[10px] md:text-xs ${
              card.darkLabel ? "font-semibold text-white dark:text-black" : "text-black/45 dark:text-white/60"
            }`}
            style={{ left: `calc(${tabLeft}% + 0.75rem)` }}
          >
            {card.label}
          </p>
        )}
      </div>
    </a>
  );
}

export default function MonochromeLineFlow({ className = "" }: MonochromeLineFlowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({
    width: DEFAULT_CONTAINER_WIDTH,
    height: DEFAULT_CONTAINER_HEIGHT,
  });

  useEffect(() => {
    if (!rootRef.current || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);

      if (width > 0 && height > 0) {
        setContainerSize({ width, height });
      }
    });

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    const widthFactor = clamp((containerSize.width - 640) / 560, 0, 1);
    const heightFactor = clamp((containerSize.height - 320) / 220, 0, 1);
    const factor = Math.min(widthFactor, heightFactor);

    const cardWidth = 46 + factor * 14;
    const cardHeight = 38 + factor * 7;
    const expandedTopStep = 4.2 + factor * 1.8;
    const expandedLeftStep = 0.8 + factor * 0.6;
    const collapsedTopStep = 1.4 + factor * 0.8;
    const collapsedLeftStep = 0.2 + factor * 0.15;
    const stackBaseLeft = 50 - cardWidth / 2;

    return {
      cardWidth,
      cardHeight,
      expandedTopStep,
      expandedLeftStep,
      collapsedTopStep,
      collapsedLeftStep,
      stackBaseLeft,
    };
  }, [containerSize.height, containerSize.width]);

  const topStep = isExpanded ? layout.expandedTopStep : layout.collapsedTopStep;
  const leftStep = isExpanded ? layout.expandedLeftStep : layout.collapsedLeftStep;
  const middleIndex = (INSPIRATION_CARDS.length - 1) / 2;

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden rounded-[1.6rem] border border-black/15 bg-[#f5f5f5] dark:border-white/20 dark:bg-neutral-900 ${className}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >

      {INSPIRATION_CARDS.map((card) => (
        <FolderCard
          key={card.id}
          card={card}
          topStep={topStep}
          leftStep={leftStep}
          middleIndex={middleIndex}
          cardWidth={layout.cardWidth}
          cardHeight={layout.cardHeight}
          stackBaseLeft={layout.stackBaseLeft}
        />
      ))}

      <style>{`
        .mlf-card {
          filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.12));
          animation-name: mlfFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          transition: top 320ms cubic-bezier(0.22, 1, 0.36, 1), left 320ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .dark .mlf-card {
          filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.5));
        }
        .mlf-card:hover .mlf-card-inner {
          transform: translateY(-14px);
        }
        ${INSPIRATION_CARDS.map(
          (card) => `.mlf-card-${card.id} { animation-duration: ${card.duration}s; animation-delay: ${card.delay}s; }`
        ).join("")}
        @keyframes mlfFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
