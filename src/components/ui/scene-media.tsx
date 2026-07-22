"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
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
  /**
   * Autoplay on its own. Set false when a parent orchestrates play/pause
   * imperatively (e.g. scroll-driven scenes that should decode one clip at a
   * time). Defaults true for standalone use like a hero background.
   */
  autoPlay?: boolean;
  /** Overrides the <video> preload hint. Defaults to "metadata" (light). */
  preload?: "none" | "metadata" | "auto";
};

/**
 * A full-bleed media layer for scroll/hero scenes. Renders the poster <Image>
 * as the base and, only when a Higgsfield clip is `ready` and the user allows
 * motion, layers an autoplaying muted loop on top. If the video fails to load
 * it hides itself and the poster remains — the scene never goes blank.
 *
 * The parent must be `position: relative` (both layers use `fill` / inset-0).
 */
export function SceneMedia({
  img,
  alt,
  video,
  className,
  sizes = "100vw",
  quality,
  priority,
  autoPlay = true,
  preload = "metadata",
}: SceneMediaProps) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const playVideo = !!video?.ready && !reduce && !failed;

  return (
    <>
      <Image src={img} alt={alt} fill sizes={sizes} quality={quality} priority={priority} className={className} />
      {video?.ready && !reduce && (
        <video
          className={`absolute inset-0 h-full w-full ${className ?? ""}`}
          autoPlay={autoPlay}
          muted
          loop
          playsInline
          preload={preload}
          poster={typeof img === "string" ? img : undefined}
          onError={() => setFailed(true)}
          style={playVideo ? undefined : { display: "none" }}
          aria-hidden
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.src} type="video/mp4" />
        </video>
      )}
    </>
  );
}
