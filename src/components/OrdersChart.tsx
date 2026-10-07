import { formatBRL } from "@/lib/format";
import type { DailyOrders } from "@/lib/types";

const CHART_HEIGHT = 160;

// 'YYYY-MM-DD' -> "Qui" (a data já está no fuso do estabelecimento, então
// o dia da semana é calculado em UTC para não sofrer deslocamento).
function weekdayLabel(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const label = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("pt-BR", {
    weekday: "short",
    timeZone: "UTC",
  });
  const clean = label.replace(".", "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function OrdersChart({ days }: { days: DailyOrders[] }) {
  const max = Math.max(1, ...days.map((d) => d.orders));

  return (
    <ul className="flex items-end justify-between gap-3" aria-label="Pedidos por dia">
      {days.map((day, index) => {
        const isToday = index === days.length - 1;
        const height = Math.max(6, Math.round((day.orders / max) * CHART_HEIGHT));
        return (
          <li
            key={day.date}
            className="flex flex-1 flex-col items-center justify-end gap-2"
            title={`${day.orders} pedidos · ${formatBRL(day.revenue)} concluídos`}
          >
            <span className="text-xs font-semibold">{day.orders}</span>
            <div
              className={`w-7 rounded-full ${isToday ? "bg-accent" : "bg-accent-soft"}`}
              style={{ height }}
            />
            <span className={`text-xs ${isToday ? "font-bold" : "text-muted"}`}>
              {weekdayLabel(day.date)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
