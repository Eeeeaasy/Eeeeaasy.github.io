import { useEffect, useMemo, useState } from "react";
import { INSPIRATION_CARDS } from "../../data/inspirationCards";

type Props = {
  cardId: number;
  defaultTitle: string;
  defaultBody: string;
  notch: number;
  darkLabel?: boolean;
  prevHref: string;
  nextHref: string;
  backHref: string;
};

type Draft = {
  title: string;
  body: string;
};

const STORAGE_KEY = "mlf-card-drafts-v1";
const OPEN_SNAPSHOT_KEY = "inspiration-open-snapshot-v1";
const OPEN_ANIM_MS = 320;
const SETTLE_DELAY_MS = 170;

const AVATAR_POOL = ["/pictures/站着.png", "/pictures/坐着.png", "/pictures/坐在往上看.png"] as const;
type AvatarSrc = (typeof AVATAR_POOL)[number];

const AVATAR_CONFIGS: Record<
  AvatarSrc,
  {
    wrapperLeft: string;
    wrapperTop: string;
    wrapperWidth: string;
    wrapperHeight: string;
    imageBottom: string;
    imageHeight: string;
  }
> = {
  "/pictures/站着.png": {
    wrapperLeft: "-19%",
    wrapperTop: "78%",
    wrapperWidth: "28.5%",
    wrapperHeight: "22%",
    imageBottom: "-2%",
    imageHeight: "250%",
  },
  "/pictures/坐着.png": {
    wrapperLeft: "62%",
    wrapperTop: "6.5%",
    wrapperWidth: "26%",
    wrapperHeight: "22%",
    imageBottom: "-8%",
    imageHeight: "180%",
  },
  "/pictures/坐在往上看.png": {
    wrapperLeft: "83%",
    wrapperTop: "76%",
    wrapperWidth: "26%",
    wrapperHeight: "22%",
    imageBottom: "-10%",
    imageHeight: "186%",
  },
};

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type OpenSnapshot = Rect & {
  id: number;
  ts: number;
  mode?: "from-card" | "detail-nav";
};

const getTargetRect = (): Rect => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const sidePadding = viewportWidth < 768 ? 12 : 24;
  const width = Math.min(Math.max(viewportWidth * 0.64, 560), viewportWidth - sidePadding * 2);
  const height = Math.min(Math.max(viewportHeight * 0.72, 500), viewportHeight - sidePadding * 2);

  return {
    width,
    height,
    left: (viewportWidth - width) / 2,
    top: (viewportHeight - height) / 2,
  };
};

const getOvershootRect = (target: Rect): Rect => {
  const scale = 1.035;
  const width = target.width * scale;
  const height = target.height * scale;
  return {
    width,
    height,
    left: target.left - (width - target.width) / 2,
    top: target.top - (height - target.height) / 2 - 6,
  };
};

const readDrafts = (): Record<number, Draft> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<number, Draft>;
  } catch {
    return {};
  }
};

export default function InspirationCardEditor({
  cardId,
  defaultTitle,
  defaultBody,
  notch,
  darkLabel = false,
  prevHref,
  nextHref,
  backHref,
}: Props) {
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(defaultBody);
  const [panelRect, setPanelRect] = useState<Rect | null>(null);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"opening" | "settling" | "idle">("idle");
  const avatarSrc = AVATAR_POOL[(cardId - 1) % AVATAR_POOL.length];
  const avatarConfig = AVATAR_CONFIGS[avatarSrc];

  const primeDetailNavigation = (href: string) => {
    if (typeof window === "undefined") return;
    const match = href.match(/\/inspiration\/(\d+)$/);
    if (!match) return;

    const nextId = Number(match[1]);
    const rect = panelRect ?? getTargetRect();
    const snapshot: OpenSnapshot = {
      id: nextId,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      ts: Date.now(),
      mode: "detail-nav",
    };

    window.sessionStorage.setItem(OPEN_SNAPSHOT_KEY, JSON.stringify(snapshot));
  };

  const resetAllTitles = () => {
    if (typeof window === "undefined") return;
    const drafts = readDrafts();

    INSPIRATION_CARDS.forEach((card) => {
      const existing = drafts[card.id] ?? { body: "" };
      drafts[card.id] = {
        title: card.label || `Card ${card.id}`,
        body: existing.body || "",
      };
    });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));

    const current = drafts[cardId];
    if (current?.title) {
      setTitle(current.title);
    }
  };

  useEffect(() => {
    const drafts = readDrafts();
    const current = drafts[cardId];
    if (!current) {
      setTitle(defaultTitle);
      setBody(defaultBody);
      return;
    }
    setTitle(current.title || defaultTitle);
    setBody(current.body || defaultBody);
  }, [cardId, defaultBody, defaultTitle]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const drafts = readDrafts();
    drafts[cardId] = { title, body };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }, [body, cardId, title]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const target = getTargetRect();
    const overshoot = getOvershootRect(target);
    let start = target;
    let settleTimer: number | null = null;

    try {
      const raw = window.sessionStorage.getItem(OPEN_SNAPSHOT_KEY);
      if (raw) {
        const snapshot = JSON.parse(raw) as OpenSnapshot;
        const isFresh = Date.now() - snapshot.ts < 2500;
        if (snapshot.id === cardId && isFresh) {
          start = {
            left: snapshot.left,
            top: snapshot.top,
            width: snapshot.width,
            height: snapshot.height,
          };

          if (snapshot.mode === "detail-nav") {
            setPanelRect(start);
            setOpen(true);
            setPhase("idle");
            window.sessionStorage.removeItem(OPEN_SNAPSHOT_KEY);

            const onResize = () => {
              setPanelRect(getTargetRect());
            };
            window.addEventListener("resize", onResize);
            return () => {
              window.removeEventListener("resize", onResize);
            };
          }
        }
      }
    } catch {
      // ignore malformed snapshot
    }

    window.sessionStorage.removeItem(OPEN_SNAPSHOT_KEY);

    setPanelRect(start);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("opening");
        setPanelRect(overshoot);
        setOpen(true);
        settleTimer = window.setTimeout(() => {
          setPhase("settling");
          setPanelRect(target);
          window.setTimeout(() => {
            setPhase("idle");
          }, OPEN_ANIM_MS);
        }, SETTLE_DELAY_MS);
      });
    });

    const onResize = () => {
      setPanelRect(getTargetRect());
    };

    window.addEventListener("resize", onResize);
    return () => {
      if (settleTimer) {
        window.clearTimeout(settleTimer);
      }
      window.removeEventListener("resize", onResize);
    };
  }, [cardId]);

  const tabLeft = useMemo(() => Math.max(5, Math.min(70, notch)), [notch]);
  const tabTitle = useMemo(() => {
    const raw = title.trim();
    if (!raw) return "Untitled";
    return raw.length > 26 ? `${raw.slice(0, 25)}...` : raw;
  }, [title]);
  const isLongTabTitle = tabTitle.length > 14;

  if (!panelRect) {
    return null;
  }

  return (
    <section className="fixed inset-0 z-[130]">
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-[3px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <article
        className="fixed select-text"
        style={{
          left: `${panelRect.left}px`,
          top: `${panelRect.top}px`,
          width: `${panelRect.width}px`,
          height: `${panelRect.height}px`,
          transition:
            phase === "opening"
              ? `left ${OPEN_ANIM_MS}ms cubic-bezier(0.16,1.2,0.3,1), top ${OPEN_ANIM_MS}ms cubic-bezier(0.16,1.2,0.3,1), width ${OPEN_ANIM_MS}ms cubic-bezier(0.16,1.2,0.3,1), height ${OPEN_ANIM_MS}ms cubic-bezier(0.16,1.2,0.3,1)`
              : `left ${OPEN_ANIM_MS}ms cubic-bezier(0.22,1,0.36,1), top ${OPEN_ANIM_MS}ms cubic-bezier(0.22,1,0.36,1), width ${OPEN_ANIM_MS}ms cubic-bezier(0.22,1,0.36,1), height ${OPEN_ANIM_MS}ms cubic-bezier(0.22,1,0.36,1)`,
        }}
      >
        <div
          className="pointer-events-none absolute z-10"
          style={{
            left: avatarConfig.wrapperLeft,
            top: avatarConfig.wrapperTop,
            width: avatarConfig.wrapperWidth,
            height: avatarConfig.wrapperHeight,
          }}
        >
          <img
            src={avatarSrc}
            alt="Character"
            className="absolute left-1/2 w-auto -translate-x-1/2 select-none object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.2)]"
            style={{
              bottom: avatarConfig.imageBottom,
              height: avatarConfig.imageHeight,
            }}
            loading="lazy"
          />
        </div>

        <div className="absolute inset-x-0 top-[8%] h-[14%] rounded-t-[1.25rem] border-2 border-b-0 border-black bg-white shadow-[0_2px_0_rgba(0,0,0,0.08)] dark:border-white/75 dark:bg-neutral-900 dark:shadow-[0_2px_0_rgba(255,255,255,0.08)]" />

        <div className="absolute inset-x-0 top-[21%] bottom-0 rounded-b-[1.4rem] border-2 border-black bg-white p-4 shadow-[0_26px_52px_rgba(0,0,0,0.22)] dark:border-white/75 dark:bg-neutral-900 dark:shadow-[0_30px_54px_rgba(0,0,0,0.55)] md:p-6">
          <div className="flex h-full flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] opacity-45">Inspiration Card #{cardId}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAllTitles}
                  aria-label="重置标题"
                  title="重置标题"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/25 text-[11px] transition hover:bg-black/5 dark:border-white/30 dark:hover:bg-white/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v4h4" />
                  </svg>
                </button>
                <a
                  href={prevHref}
                  data-astro-prefetch
                  onClick={() => primeDetailNavigation(prevHref)}
                  className="rounded-full border border-black/25 px-3 py-1 text-xs transition hover:bg-black/5 dark:border-white/30 dark:hover:bg-white/10"
                >
                  Prev
                </a>
                <a
                  href={nextHref}
                  data-astro-prefetch
                  onClick={() => primeDetailNavigation(nextHref)}
                  className="rounded-full border border-black/25 px-3 py-1 text-xs transition hover:bg-black/5 dark:border-white/30 dark:hover:bg-white/10"
                >
                  Next
                </a>
                <a
                  href={backHref}
                  data-astro-prefetch
                  className="rounded-full border border-black bg-black px-3 py-1 text-xs text-white transition hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85"
                >
                  Back
                </a>
              </div>
            </div>

            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              className="w-full rounded-xl border border-black/20 bg-transparent px-3 py-2 text-lg font-semibold outline-none transition focus:border-black dark:border-white/25 dark:focus:border-white"
              placeholder="Card title"
            />

            <textarea
              value={body}
              onChange={(event) => {
                setBody(event.target.value);
              }}
              className="mt-3 h-full w-full resize-none rounded-2xl border border-black/15 bg-black/[0.02] p-4 text-sm leading-7 outline-none transition focus:border-black/35 dark:border-white/20 dark:bg-white/[0.03] dark:focus:border-white/45"
              placeholder="写点什么好呢..."
            />
          </div>
        </div>

        <div
          className={`absolute top-0 h-[24%] w-[32%] rounded-t-[1rem] border-2 border-b-0 border-black shadow-[0_5px_12px_rgba(0,0,0,0.15)] dark:border-white/80 dark:shadow-[0_5px_12px_rgba(0,0,0,0.45)] ${
            darkLabel
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white text-black dark:bg-neutral-900 dark:text-white"
          }`}
          style={{ left: `${tabLeft}%` }}
        >
          <p
            className={`h-full w-full truncate px-3 text-center leading-[1.05] flex items-center justify-center font-semibold ${
              isLongTabTitle
                ? "text-[clamp(12px,1.05vw,18px)] tracking-[0.025em]"
                : "text-[clamp(16px,1.45vw,27px)] tracking-[0.045em]"
            } ${
              darkLabel ? "text-white dark:text-black" : "text-black/75 dark:text-white/75"
            }`}
            style={{ fontFamily: '"Bodoni Moda", "Didot", "Times New Roman", serif' }}
            title={title}
          >
            {tabTitle}
          </p>
        </div>
      </article>

    </section>
  );
}
