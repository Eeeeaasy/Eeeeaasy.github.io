import { useState, useEffect } from "react";

export default function ColorButton() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 组件挂载时：
    // 强制先重置你以前写在 body 上的 style 属性，让后面的 Tailwind class 生效
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    document.body.style.transition = "background-color 0.5s ease-in-out, color 0.5s ease-in-out";

    const root = document.documentElement;
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextIsDark =
      savedTheme === "dark"
        ? true
        : savedTheme === "light"
          ? false
          : root.classList.contains("dark") || prefersDark;

    root.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  }, []);

  const changeTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  };

  return (
    <button
      onClick={changeTheme}
      className={`
        fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center 
        rounded-full shadow-lg transition-transform active:scale-95 text-lg
        ${
          isDark 
            ? "bg-white text-black hover:bg-gray-200" 
            : "bg-neutral-900 text-white hover:bg-neutral-800"
        }
      `}
      aria-label="Toggle Theme"
      title={isDark ? "切换到白天模式" : "切换到黑夜模式"}
    >
      {/* 白天显示月亮（暗示点击切换到黑夜），黑夜显示太阳 */}
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}