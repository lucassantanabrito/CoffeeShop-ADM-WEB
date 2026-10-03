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
