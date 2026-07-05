"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { site } from "@/data/site";

/**
 * The current theme lives on <html data-theme="…"> (set pre-hydration by the
 * inline script in layout.tsx). Subscribe to attribute changes so the toggle
 * icon stays in sync without hydration mismatches.
 */
function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function useTheme(): "dark" | "light" {
  return useSyncExternalStore(
    subscribeToTheme,
    () =>
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark",
    () => "dark"
  );
}

const NAV_LINKS = [
  { label: "home", href: "/#top", match: "/" },
  { label: "projects", href: "/#projects", match: "/projects" },
  { label: "contact", href: "/#contact", match: "__contact" },
  { label: "blog", href: "/blog", match: "/blog" },
  { label: "about", href: "/about", match: "/about" },
  // Recommendations are disabled for now — re-enable by uncommenting this
  // link and removing the notFound() guard in src/app/recommendations/page.tsx.
  // { label: "recommendations", href: "/recommendations", match: "/recommendations" },
];

function isActive(pathname: string, match: string) {
  if (match === "/") return pathname === "/";
  if (match === "__contact") return false;
  return pathname === match || pathname.startsWith(match + "/");
}

function Logo() {
  return (
    <Link
      className="flex items-center gap-2.5 font-mono text-[15px] font-semibold tracking-tight text-[var(--text-bright)] no-underline"
      href="/"
    >
      <span
        className="size-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)] animate-[blip-pulse_2.4s_ease-in-out_infinite]"
        aria-hidden="true"
      ></span>
      <span>{site.handle}</span>
      <span className="font-normal text-[var(--text-dim)]">
        {site.domainSuffix}
      </span>
    </Link>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const projectDetail = pathname.startsWith("/project/");

  const linkColor = (match: string) =>
    isActive(pathname, match) ||
    (match === "/projects" && (pathname === "/projects" || projectDetail))
      ? "text-[var(--accent)]"
      : "text-[var(--text-dim)]";

  return (
    <>
      <header className="topbar sticky top-0 z-50 backdrop-blur-[12px] border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
          <Logo />
          <nav className="hidden lg:flex gap-1 items-center" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                className={`py-2 px-[14px] font-[family-name:var(--font-mono)] text-[13px] rounded-[6px] transition-[color,background] duration-150 hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] before:content-['~/'] before:opacity-40 before:mr-px ${linkColor(l.match)}`}
                href={l.href}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center w-9 h-9 p-0 border border-[var(--border)] rounded-lg text-[var(--text-dim)] shrink-0 transition-[border-color,color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <button
              className="flex items-center justify-center w-9 h-9 p-0 border border-[var(--border)] rounded-lg text-[var(--text-dim)] shrink-0 transition-[border-color,color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[280px] z-[101] lg:hidden flex flex-col border-l border-[var(--border)] transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "var(--bg)" }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <Logo />
          <button
            className="p-2 rounded-[6px] text-[var(--text-dim)] hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] transition-[color,background] duration-150"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              className={`block py-3 px-4 font-[family-name:var(--font-mono)] text-[14px] rounded-[6px] transition-[color,background] duration-150 hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] before:content-['~/'] before:opacity-40 before:mr-px ${linkColor(l.match)}`}
              href={l.href}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
