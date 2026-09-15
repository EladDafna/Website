"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before this element animates in. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts its children into view the first time they are scrolled to.
 *
 * Under reduced motion it still renders a motion element that animates
 * immediately to the visible state. Returning a plain div instead would leave
 * the server-rendered `opacity: 0` inline style untouched, hiding the content
 * until a client-side navigation remounted the tree.
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? {
        initial: false as const,
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
