"use client";

import { useId, type ComponentProps, type ReactNode } from "react";

interface FieldWrapperProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (id: string, describedBy: string | undefined) => ReactNode;
}

function FieldWrapper({ label, hint, error, required, children }: FieldWrapperProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-graphite-800">
        {label}
        {required && <span className="text-coral-600 ml-0.5" aria-hidden>*</span>}
      </label>
      {children(id, describedBy)}
      {hint && !error && (
        <p id={hintId} className="text-xs text-graphite-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger-700">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (error?: string) =>
  `w-full rounded-[var(--radius-control)] border bg-white px-3.5 py-2.5 text-[0.9375rem] text-graphite-800 placeholder:text-graphite-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25 ${
    error ? "border-danger-700" : "border-graphite-200"
  }`;

export function TextField({
  label,
  hint,
  error,
  required,
  className = "",
  ...props
}: { label: string; hint?: string; error?: string } & ComponentProps<"input">) {
  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      {(id, describedBy) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
          {...props}
          className={`${inputClass(error)} ${className}`}
        />
      )}
    </FieldWrapper>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  children,
  className = "",
  ...props
}: { label: string; hint?: string; error?: string } & ComponentProps<"select">) {
  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      {(id, describedBy) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
          {...props}
          className={`${inputClass(error)} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%234b565d%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpath%20d%3D%22M213.66%2C101.66l-80%2C80a8%2C8%2C0%2C0%2C1-11.32%2C0l-80-80A8%2C8%2C0%2C0%2C1%2C53.66%2C90.34L128%2C164.69l74.34-74.35a8%2C8%2C0%2C0%2C1%2C11.32%2C11.32Z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${className}`}
        >
          {children}
        </select>
      )}
    </FieldWrapper>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  className = "",
  ...props
}: { label: string; hint?: string; error?: string } & ComponentProps<"textarea">) {
  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      {(id, describedBy) => (
        <textarea
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
          rows={4}
          {...props}
          className={`${inputClass(error)} resize-y ${className}`}
        />
      )}
    </FieldWrapper>
  );
}
