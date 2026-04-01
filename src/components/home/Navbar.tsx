import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Skills", href: "/skills" },
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
  ];

  const resumeItems = [
    { label: "Skills", href: "/skills" },
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
  ];

  const setMenuHash = (open: boolean) => {
    if (typeof window === "undefined") return;
    if (open) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#menu`);
      return;
    }
    if (window.location.hash === "#menu") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll(); // 初始化

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!resumeRef.current) return;
      if (!resumeRef.current.contains(event.target as Node)) {
        setResumeOpen(false);
        setMenuHash(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setResumeOpen(false);
        setMobileOpen(false);
        setMenuHash(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      setMenuHash(false);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "bg-slate-900/35 backdrop-blur-xl shadow-sm shadow-black/10"
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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm opacity-60 transition hover:opacity-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop Resume Dropdown */}
          <div ref={resumeRef} className="relative hidden md:block">
            <button
              type="button"
              onClick={() => {
                setResumeOpen((prev) => {
                  const next = !prev;
                  setMenuHash(next);
                  return next;
                });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-current px-4 py-2 text-sm opacity-80 transition hover:opacity-100"
              aria-haspopup="menu"
              aria-expanded={resumeOpen}
            >
              Menu
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`h-3.5 w-3.5 transition-transform ${resumeOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {resumeOpen && (
              <div className="absolute left-1/2 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-slate-900/95 p-1 text-sm shadow-lg shadow-black/30">
                {resumeItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setResumeOpen(false);
                      setMenuHash(false);
                    }}
                    className="block rounded-xl px-3 py-2 text-center text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Trigger */}
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-white/30 px-3 py-2 text-sm opacity-85 transition hover:opacity-100 md:hidden"
            onClick={() => {
              setMobileOpen((prev) => {
                const next = !prev;
                setMenuHash(next);
                return next;
              });
            }}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              {mobileOpen ? <path d="M6 18 18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Panel */}
      <div
        className={`md:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-300`}
      >
        <div
          className="fixed inset-0 top-16 bg-slate-950/55 backdrop-blur-sm"
          onClick={() => {
            setMobileOpen(false);
            setMenuHash(false);
          }}
        />
        <div className="absolute left-4 right-4 top-[4.5rem] rounded-2xl border border-white/15 bg-slate-900/95 p-4 shadow-xl shadow-black/30">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setMobileOpen(false);
                  setMenuHash(false);
                }}
                className="rounded-xl px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}