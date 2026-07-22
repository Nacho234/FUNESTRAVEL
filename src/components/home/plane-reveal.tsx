"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Cinematic brand-band airplane:
 *  - Outer layer: right-to-left fly-in on scroll (blur + slight zoom resolving).
 *  - Inner layer: an endless in-flight drift (gentle vertical bob + micro pitch)
 *    so the plane never looks static.
 * Both collapse gracefully under prefers-reduced-motion.
 */
export function PlaneReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 200, scale: 1.08, filter: "blur(8px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={reduce ? { duration: 0 } : { duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        className="h-full w-full"
        animate={reduce ? undefined : { y: [0, -12, 0, 10, 0], rotate: [0, -0.9, 0, 0.7, 0] }}
        transition={reduce ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
