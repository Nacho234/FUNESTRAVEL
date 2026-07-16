import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

/** Native-details accordion: accessible, keyboard-friendly, zero JS. */
export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b border-graphite-100 last:border-0">
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-left font-semibold text-graphite-800 list-none [&::-webkit-details-marker]:hidden hover:text-petrol-800 transition-colors">
        {title}
        <CaretDownIcon className="size-4 shrink-0 text-graphite-400 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pb-5 text-[0.9375rem] leading-relaxed text-graphite-600 max-w-[70ch]">{children}</div>
    </details>
  );
}
