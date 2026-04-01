import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Reveal from "../ui/Reveal";

const CharacterModel = lazy(() => import("./CharacterModel"));

const MODEL_PATHS = [
  "/models/stand.glb",
  "/models/stand2.glb",
  "/models/character.glb",
  "/models/guitar.glb",
] as const;

export default function Hero() {
  const [hitokoto, setHitokoto] = useState("Loading...");
  const [from, setFrom] = useState("");
  // 新增：记录是否喜欢、是否正在加载的状态
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelPath, setModelPath] = useState<(typeof MODEL_PATHS)[number]>(MODEL_PATHS[0]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasRequestIdleCallback = typeof window.requestIdleCallback === "function";
    const idleId = hasRequestIdleCallback
      ? window.requestIdleCallback(() => {
          MODEL_PATHS.slice(1).forEach((path) => {
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.as = "fetch";
            link.href = path;
            link.crossOrigin = "anonymous";
            document.head.appendChild(link);
          });
        })
      : window.setTimeout(() => {
          MODEL_PATHS.slice(1).forEach((path) => {
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.as = "fetch";
            link.href = path;
            link.crossOrigin = "anonymous";
            document.head.appendChild(link);
          });
        }, 1200);

    return () => {
      if (hasRequestIdleCallback && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as number);
      }
    };
  }, []);

  const handleRandomModel = useCallback(() => {
    setModelPath((current) => {
      if (MODEL_PATHS.length <= 1) return current;

      let next = current;
      while (next === current) {
        const randomIndex = Math.floor(Math.random() * MODEL_PATHS.length);
        next = MODEL_PATHS[randomIndex];
      }
      return next;
    });
  }, []);

  // 将提取数据逻辑封装为单一函数，便于复用
  const fetchHitokoto = useCallback(async () => {
    const allowedTypes = new Set(["d", "i"]);
    const maxRetry = 5;

    setIsLoading(true);

    try {
      for (let i = 0; i < maxRetry; i += 1) {
        const response = await fetch("https://v1.hitokoto.cn/?c=d&c=i");
        const data = await response.json();

        if (!allowedTypes.has(data?.type)) {
          continue;
        }

        setHitokoto(data.hitokoto);
        setFrom(data.from);
        setIsLiked(false); // 切换新句子时重置喜欢状态
        return;
      }

      throw new Error("未获取到 d/i 分类句子");
    } catch (error) {
      console.error("一言接口调用失败:", error);
      setHitokoto("oh,\maybe i need\repair my website."); // 失败时的降级方案
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 组件挂载时调用一次
  useEffect(() => {
    fetchHitokoto();
  }, [fetchHitokoto]);

  return (
    <section className="flex min-h-[85vh] items-center pt-20">
      <div className="grid w-full gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <Reveal className="max-w-3xl" delay={0}>
          <p className="mb-6 text-xs tracking-[0.4em] opacity-50 uppercase">
            收集无数灵感并将它们变成现实的过程，才是代码的灵魂。
          </p>

                    {/* 使用 font-serif (衬线体) 和 font-medium，适当减小一点点压迫感极强的字号，并放宽行高 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.2] tracking-wide text-neutral-800 dark:text-neutral-100">
            {hitokoto}
          </h1>
          {/* 在 h1 标签后面独立增加一行显示 from */}
          {from && (
            <p className="mt-4 text-right text-sm opacity-50 tracking-wider">
              —— {from}
            </p>
          )}

                    {/* 新增：来源标注与操作按钮 */}
          <div className="mt-3 flex items-center gap-4 text-xs opacity-60 transition-opacity hover:opacity-100">
            {/* 极小的字标注来源 */}
            <span className="text-[10px] tracking-wide opacity-50">
              数据来源「一言」
            </span>
            
            {/* 喜欢按钮 */}
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-1.5 transition-transform hover:scale-105 group"
              aria-label="喜欢"
            >
              {isLiked ? (
                // 喜欢的已填充红心图标
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              ) : (
                // 未喜欢的空心图标
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              )}
              <span className="text-[11px]">{isLiked ? "已喜欢" : "喜欢"}</span>
            </button>

            {/* 切换按钮 */}
            <button 
              onClick={fetchHitokoto}
              disabled={isLoading}
              className="flex items-center gap-1.5 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              aria-label="切换"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={isLoading ? "animate-spin" : ""}
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span className="text-[11px]">{isLoading ? "加载中" : "切换"}</span>
            </button>
          </div>

          <p className="mt-8 max-w-xl text-base leading-7 opacity-60 md:text-lg">
            I’m YiRui, you can call me Easy! 
          </p>

          <div className="mt-10 flex gap-4">
            <a
              href="#projects"
              className="rounded-full border-2 border-current px-6 py-3 text-sm font-medium transition hover:opacity-70"
            >
              一些想法
            </a>
            <button
              type="button"
              onClick={handleRandomModel}
              className="hidden rounded-full border border-current px-6 py-3 text-sm opacity-65 transition hover:opacity-100 md:inline-block"
            >
              更换形象
            </button>
          </div>
        </Reveal>

        <Reveal delay={140} y={30} className="hidden md:block">
          <Suspense fallback={<div className="h-[460px] w-full sm:h-[700px]" />}>
            <CharacterModel modelPath={modelPath} />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
}