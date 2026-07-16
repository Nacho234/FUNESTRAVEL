import type { Money } from "./types";

export function formatMoney(money: Money): string {
  const formatted = new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
  }).format(money.amount);
  return `${money.currency} ${formatted}`;
}

export function formatArs(amount: number): string {
  return `ARS ${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function plural(n: number, singular: string, pluralForm: string): string {
  return n === 1 ? `${n} ${singular}` : `${n} ${pluralForm}`;
}
