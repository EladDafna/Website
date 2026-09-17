"use client";

import { useEffect, useRef, useState } from "react";

type Provider = "gmail" | "outlook";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "gmail", label: "Gmail" },
  { id: "outlook", label: "Outlook" },
];

function composeUrl(provider: Provider, email: string): string {
  const to = encodeURIComponent(email);
  return provider === "gmail"
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${to}`
    : `https://outlook.live.com/mail/0/deeplink/compose?to=${to}`;
}

/**
 * Renders like any other link in `socialLinks`, but a bare `mailto:` silently
 * does nothing on a machine with no desktop mail client configured, which is
 * most of them today. This asks which webmail to use and deep-links straight
 * to a compose window addressed to `email`, opened in a new tab.
 */
export default function EmailButton({
  email,
  label = "Email",
  className,
}: {
  email: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (provider: Provider) => {
    window.open(composeUrl(provider, email), "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={className}
      >
        {label}
        <span aria-hidden="true" className={`ml-1 inline-block text-[10px] transition-transform ${open ? "-scale-y-100" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Choose an email provider"
          className="glass absolute left-1/2 top-full z-20 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-xl p-1.5 text-left"
        >
          <p className="px-3 pb-1 pt-1 text-[11px] uppercase tracking-wider text-muted">
            Open with
          </p>
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              role="menuitem"
              onClick={() => choose(provider.id)}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-raised hover:text-neon-cyan"
            >
              {provider.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
