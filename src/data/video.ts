// Central video registry (Higgsfield-generated clips). Mirrors src/data/img.ts:
// every motion asset lives in one place so a file can be swapped once.
//
// Workflow:
//  1. Generate the clip in Higgsfield and export it as .mp4 (H.264, muted).
//  2. Drop the file into /public/videos/ with the name below.
//  3. Flip `ready` to true. Until then the UI falls back to its poster image,
//     so the site keeps working with zero broken <video> tags.
//
// Keep clips short (4–8s), silent, and seamlessly loopable. A .webm (VP9) is
// optional but gives smaller files for browsers that support it.

export type VideoAsset = {
  /** .mp4 path under /public/videos (H.264 for broad support). */
  src: string;
  /** Optional smaller .webm/VP9 served first when the browser supports it. */
  webm?: string;
  /** Flip to true once the file exists in /public/videos. */
  ready: boolean;
};

export const VIDEO = {
  // "Acompañamiento real" section (home HumanTouch) — montage loop, falls back
  // to IMG.humanScene.
  humanTouch: { src: "/videos/human-touch.mp4", ready: true },

  // Takeoff scroll scene (home) — mirrors IMG.takeoffAirport/Runway/Flight.
  takeoffAirport: { src: "/videos/takeoff-airport.mp4", ready: true },
  takeoffRunway: { src: "/videos/takeoff-runway.mp4", ready: true },
  takeoffFlight: { src: "/videos/takeoff-flight.mp4", ready: true },
} satisfies Record<string, VideoAsset>;
