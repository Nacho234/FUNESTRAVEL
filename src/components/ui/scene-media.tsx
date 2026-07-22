"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { VideoAsset } from "@/data/video";

type SceneMediaProps = {
  /** Poster image — always rendered; shown when no video is ready or motion is reduced. */
  img: ImageProps["src"];
  alt: string;
  /** Optional Higgsfield clip. When `ready`, it plays over the poster image. */
  video?: VideoAsset;
  /** Object-fit / object-position classes applied to BOTH the image and the video. */
  className?: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  /** Overrides the <video> preload hint. Defaults to "metadata" (light). */
  preload?: "none" | "metadata" | "auto";
};

/**
 * A full-bleed media layer for hero/section backgrounds. Renders the poster
 * <Image> as the base and, when a clip is `ready` and motion is allowed, layers
 * a muted loop on top. It self-manages playback with an IntersectionObserver:
 * plays while on screen, pauses while off screen — reliable autoplay inside any
 * layout and no wasted decoding. If the video errors it hides itself and the
 * poster remains, so the section never goes blank.
 *
 * The parent must be `position: relative` (both layers use `fill` / inset-0).
 */
export function SceneMedia({ img, alt, video, className, sizes = "100vw", quality, priority, preload = "metadata" }: SceneMediaProps) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const show = !!video?.ready && !reduce && !failed;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (v.paused) void v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [show]);

  return (
    <>
      <Image src={img} alt={alt} fill sizes={sizes} quality={quality} priority={priority} className={className} />
      {show && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full ${className ?? ""}`}
          muted
          loop
          playsInline
          preload={preload}
          poster={typeof img === "string" ? img : undefined}
          onError={() => setFailed(true)}
          aria-hidden
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.src} type="video/mp4" />
        </video>
      )}
    </>
  );
}
