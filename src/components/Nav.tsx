"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/lib/config";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes. Adjusting state during
  // render is the supported pattern here; an effect would cause a second pass.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass border-b border-border-subtle/70" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-surface-raised text-neon-cyan ring-1 ring-border-subtle transition-transform duration-300 group-hover:scale-105">
            <span className="font-mono text-[13px]">ED</span>
          </span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {isActive(link.href) && (
                  <span className="absolute inset-0 rounded-full bg-surface-raised ring-1 ring-border-subtle" />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="rounded-lg p-2 text-muted ring-1 ring-border-subtle transition-colors hover:text-foreground sm:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="glass border-t border-border-subtle/70 px-5 pb-4 sm:hidden">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block rounded-lg px-3 py-3 text-sm ${
                  isActive(link.href) ? "text-neon-cyan" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
