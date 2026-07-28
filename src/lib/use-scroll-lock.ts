"use client";

import { useEffect } from "react";

/**
 * Freezes the page behind a full-screen overlay while `locked` is true.
 *
 * Uses `position: fixed` on the body rather than `overflow: hidden`, which iOS
 * Safari ignores for touch scrolling. The current offset is parked in `top` and
 * restored on unlock, so the page does not jump back to the top. The width of
 * the scrollbar, once it disappears, is compensated with padding so the layout
 * underneath does not shift sideways either.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    return () => {
      Object.assign(body.style, previous);
      // Instant, so unlocking never animates the page back into place.
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [locked]);
}
