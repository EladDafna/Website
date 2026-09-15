"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/** Maximum rotation, in degrees, at the far edge of the card. */
const MAX_TILT = 9;

/**
 * Leans its child toward the pointer in 3D and tracks a light source across the
 * surface. Touch devices never fire pointermove without a press, so they simply
 * get the flat card.
 */
export default function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--rx", `${(0.5 - y) * MAX_TILT}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * MAX_TILT}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className ?? ""}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
