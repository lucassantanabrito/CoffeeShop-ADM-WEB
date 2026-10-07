import { TrendingDown, TrendingUp } from "lucide-react";
import { formatDeltaPct } from "@/lib/format";

interface Props {
  label: string;
  value: string;
  // Variação vs. período anterior; null quando não há base de comparação.
  deltaPct?: number | null;
  deltaCaption?: string;
  // Texto fixo no lugar da variação (ex.: "32 vendidos").
  note?: string;
}

export function MetricCard({ label, value, deltaPct, deltaCaption, note }: Props) {
  const hasDelta = typeof deltaPct === "number";
  const positive = hasDelta && deltaPct >= 0;

  return (
    <div className="flex flex-col gap-2.5 rounded-3xl bg-surface p-5 shadow-sm">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <span className="text-[28px] leading-tight font-bold">{value}</span>
      <div className="flex items-center gap-2">
        {note ? (
          <span className="rounded-full bg-default px-2 py-1 text-xs font-semibold text-muted">
            {note}
          </span>
        ) : hasDelta ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              positive ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
            }`}
          >
            {positive ? (
              <TrendingUp className="size-3" aria-hidden />
            ) : (
              <TrendingDown className="size-3" aria-hidden />
            )}
            {formatDeltaPct(deltaPct)}
          </span>
        ) : (
          <span className="rounded-full bg-default px-2 py-1 text-xs font-semibold text-muted">
            Sem comparação
          </span>
        )}
        {hasDelta && deltaCaption && (
          <span className="text-xs text-muted">{deltaCaption}</span>
        )}
      </div>
    </div>
  );
}
