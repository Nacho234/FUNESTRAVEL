import type { ReactNode } from "react";

type Tone = "teal" | "coral" | "sand" | "petrol" | "positive" | "warning" | "danger" | "neutral";

const tones: Record<Tone, string> = {
  teal: "bg-teal-50 text-teal-600",
  coral: "bg-coral-50 text-coral-700",
  sand: "bg-sand-100 text-graphite-600",
  petrol: "bg-petrol-50 text-petrol-800",
  positive: "bg-positive-100 text-positive-700",
  warning: "bg-warning-100 text-warning-700",
  danger: "bg-danger-100 text-danger-700",
  neutral: "bg-graphite-100 text-graphite-600",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
