import { StarIcon } from "@phosphor-icons/react/dist/ssr";

export function Rating({
  value,
  count,
  className = "",
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${className}`}
      aria-label={`Puntuación ${value} de 5${count ? `, ${count} opiniones` : ""}`}
    >
      <StarIcon weight="fill" className="size-4 text-warning-700" aria-hidden />
      <span className="font-semibold text-graphite-800 tabular">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-graphite-500">({count})</span>}
    </span>
  );
}
