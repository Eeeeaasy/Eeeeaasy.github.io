import { useState, useEffect } from "react";

export default function ColorButton() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 组件挂载时：
    // 强制先重置你以前写在 body 上的 style 属性，让后面的 Tailwind class 生效
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    document.body.style.transition = "background-color 0.5s ease-in-out, color 0.5s ease-in-out";

    // 可以在这里判断当前系统的偏好，这里默认设置为白天 (浅色)
    // 初始状态下不要有 "dark" class
    document.documentElement.classList.remove("dark");
  }, []);

  const changeTheme = () => {
    // 如果当前是 暗色 -> 切换成亮色
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } 
    // 如果当前是 亮色 -> 切换成暗色
    else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
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