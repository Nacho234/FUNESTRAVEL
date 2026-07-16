import { formatArs, formatMoney } from "@/lib/format";
import type { Money } from "@/lib/types";

/**
 * Commercial price block with the hierarchy required across the site:
 * big "Desde USD X por persona", base + taxes below, installments last.
 */
export function PriceBlock({
  price,
  installments,
  taxesIncluded,
  size = "md",
  align = "left",
}: {
  price: Money;
  installments?: { count: number; approxArs: number };
  taxesIncluded: boolean;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
}) {
  const amountClass = size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-xl";
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="text-xs text-graphite-500">Desde</p>
      <p className={`${amountClass} font-bold text-petrol-900 tabular leading-tight font-display`}>
        {formatMoney(price)}
        <span className="text-sm font-normal text-graphite-500 font-sans"> por persona</span>
      </p>
      <p className="text-xs text-graphite-500 mt-0.5">
        En base doble · {taxesIncluded ? "impuestos incluidos" : "más impuestos"}
      </p>
      {installments && (
        <p className="text-xs font-semibold text-positive-700 mt-1 tabular">
          {installments.count} cuotas desde {formatArs(installments.approxArs)}
        </p>
      )}
    </div>
  );
}
