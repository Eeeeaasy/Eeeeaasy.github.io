import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

const navItems = [
  { label: "Home", href: "/" },         
  { label: "Skills", href: "/skills" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  // { label: "Contact", href: "#contact" },
];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll(); // 初始化

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
<header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "bg-gray-500/10 backdrop-blur-xl shadow-sm shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div
        className={`
          mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-10
          transition-all duration-500
          ${scrolled ? "h-14" : "h-16"}
        `}
      >
        {/* Logo */}
        <a href="/" className="text-sm font-medium tracking-[0.25em] opacity-80 uppercase">
          Eeeeaasy!
        </a>

        {/* Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
            key={item.href}
            href={item.href}
            className="relative text-sm opacity-50 transition hover:text-white"
            >
            {item.label}
            <span className="absolute left-0 -bottom-1 h-px w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Button */}
        <a
          href="/#contact"
          // 核心修改 4：Resume 按钮改为 border-current，依靠 opacity 控制层级
          className="rounded-full border border-current opacity-70 px-4 py-2 text-sm transition hover:opacity-100"
        >
          Resume
        </a>
      </div>
    </header>
  );
}