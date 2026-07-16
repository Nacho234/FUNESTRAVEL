"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Soft enter-on-scroll used for section content. Under reduced motion the
 * transition duration collapses to zero (content appears instantly) instead of
 * branching the tree, so server and client HTML always match.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
