import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "destructive" | "success";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-control)] transition-all duration-200 cursor-pointer select-none active:translate-y-px disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-coral-500 text-white hover:bg-coral-600 shadow-[0_1px_2px_rgb(178_62_28_/_0.3)]",
  secondary: "bg-petrol-900 text-ivory hover:bg-petrol-800",
  tertiary: "bg-white text-petrol-900 border border-graphite-200 hover:border-petrol-600 hover:text-petrol-700",
  ghost: "text-petrol-800 hover:bg-petrol-50",
  destructive: "bg-danger-700 text-white hover:opacity-90",
  success: "bg-positive-700 text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2",
  md: "text-[0.9375rem] px-5 py-2.5",
  lg: "text-base px-6 py-3",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

function Spinner() {
  return (
    <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className = "",
  ...props
}: BaseProps & ComponentProps<"button">) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link {...props} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  );
}
