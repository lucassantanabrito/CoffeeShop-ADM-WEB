import { TIMEZONE } from "./config";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatBRL = (value: number) => brl.format(value);

export function parsePrice(raw: string): number {
  const normalized = raw.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  return Number(normalized);
}

export function maskBRL(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  if (!digits) {
    return "";
  }
  return formatBRL(Number(digits) / 100);
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIMEZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
});
const percentFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export const formatDate = (ts: number) => dateFormatter.format(ts);
export const formatTime = (ts: number) => timeFormatter.format(ts);

export function formatDeltaPct(pct: number): string {
  return `${pct > 0 ? "+" : ""}${percentFormatter.format(pct)}%`;
}
