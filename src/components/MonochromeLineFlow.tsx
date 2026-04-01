import { useState } from "react";

type MonochromeLineFlowProps = {
  className?: string;
};

// 手动调整卡片尺寸只需要改这两个常量。
const CARD_WIDTH = 60;
const CARD_HEIGHT_PERCENT = 45;

// 手动调整“整齐斜排”布局：
// 以容器中心为锚点：无论收紧或展开，整组中心位置不变。
// top = STACK_CENTER_Y - CARD_HEIGHT_PERCENT / 2 + relativeIndex * topStep
// left = STACK_BASE_LEFT + relativeIndex * leftStep
const STACK_CENTER_Y = 50;
const STACK_TOP_STEP = 6;
const STACK_BASE_LEFT = 50 - CARD_WIDTH / 2;
const STACK_LEFT_STEP = 1.4;

// 收紧状态参数（鼠标离开大框时使用）
const COLLAPSED_TOP_STEP = 2.2;
const COLLAPSED_LEFT_STEP = 0.35;

type Card = {
  id: number;
  notch: number;
  label?: string;
  darkLabel?: boolean;
  duration: number;
  delay: number;
};

const CARDS: Card[] = [
  { id: 1, notch: 20, label: "229", duration: 8.6, delay: -1.8 },
  { id: 2, notch: 22, label: "belie", duration: 9.1, delay: -2.4 },
  { id: 3, notch: 16, label: "B115. Ba,Be", darkLabel: true, duration: 9.8, delay: -0.9 },
  { id: 4, notch: 18, label: "unfinished", duration: 10.3, delay: -1.5 },
  { id: 5, notch: 26, label: "DiDuTing", duration: 8.9, delay: -2.2 },
  { id: 6, notch: 23, label: "useful", duration: 9.5, delay: -1.1 },
  { id: 7, notch: 36, label: "Usually, learning a new language can expand possibilities.", duration: 10.8, delay: -2.8 },
  { id: 8, notch: 18, label: "229. Ug,Us", darkLabel: true, duration: 9.7, delay: -1.6 },
  { id: 9, notch: 20, label: "sad", duration: 8.4, delay: -0.7 },
//   { id: 10, top: 71, width: 82, left: 9, notch: 24, label: "spirit", duration: 9.9, delay: -2.6 },
//   { id: 11, top: 78, width: 80, left: 10, notch: 30, label: "student", duration: 8.8, delay: -1.9 },
//   { id: 12, top: 85, width: 78, left: 11, notch: 17, label: "757. Ha,He", darkLabel: true, duration: 10.2, delay: -2.1 },
];

function FolderCard({
  card,
  topStep,
  leftStep,
  middleIndex,
}: {
  card: Card;
  topStep: number;
  leftStep: number;
  middleIndex: number;
}) {
  const tabLeft = Math.max(5, Math.min(70, card.notch));
  const relativeIndex = card.id - 1 - middleIndex;
  const cardTop = STACK_CENTER_Y - CARD_HEIGHT_PERCENT / 2 + relativeIndex * topStep;
  const cardLeft = relativeIndex * leftStep;

  return (
    <div
      className={`mlf-card mlf-card-${card.id} absolute cursor-pointer`}
      style={{
        top: `${cardTop}%`,
        left: `calc(${STACK_BASE_LEFT}% + ${cardLeft}%)`,
        // 手动调整卡片宽度：改上面的 CARD_WIDTH。
        width: `${CARD_WIDTH}%`,
        // 手动调整卡片高度：改上面的 CARD_HEIGHT_PERCENT。
        height: `${CARD_HEIGHT_PERCENT}%`,
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
    </div>
  );
}

export default function MonochromeLineFlow({ className = "" }: MonochromeLineFlowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const topStep = isExpanded ? STACK_TOP_STEP : COLLAPSED_TOP_STEP;
  const leftStep = isExpanded ? STACK_LEFT_STEP : COLLAPSED_LEFT_STEP;
  const middleIndex = (CARDS.length - 1) / 2;

  return (
    <div
      className={`relative overflow-hidden rounded-[1.6rem] border border-black/15 bg-[#f5f5f5] dark:border-white/20 dark:bg-neutral-900 ${className}`}
      aria-hidden="true"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >

      {CARDS.map((card) => (
        <FolderCard
          key={card.id}
          card={card}
          topStep={topStep}
          leftStep={leftStep}
          middleIndex={middleIndex}
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
        ${CARDS.map(
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
