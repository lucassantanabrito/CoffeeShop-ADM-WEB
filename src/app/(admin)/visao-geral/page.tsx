"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { AsyncState } from "@/components/AsyncState";
import { MetricCard } from "@/components/MetricCard";
import { OrdersChart } from "@/components/OrdersChart";
import { OrdersTable } from "@/components/OrdersTable";
import { formatBRL } from "@/lib/format";
import {
  fetchOrdersByDay,
  fetchOrdersPage,
  fetchSummary,
  reportsKey,
} from "@/lib/reports";
import type { ReportPeriod } from "@/lib/types";

const PERIODS: { value: ReportPeriod; label: string; suffix: string; caption: string }[] = [
  { value: "today", label: "Hoje", suffix: "hoje", caption: "vs. ontem" },
  { value: "7d", label: "7 dias", suffix: "(7 dias)", caption: "vs. 7 dias anteriores" },
  { value: "30d", label: "30 dias", suffix: "(30 dias)", caption: "vs. 30 dias anteriores" },
];

export default function VisaoGeralPage() {
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const current = PERIODS.find((p) => p.value === period) ?? PERIODS[0];

  const summary = useQuery({
    queryKey: [...reportsKey, "summary", period],
    queryFn: () => fetchSummary(period),
  });
  const byDay = useQuery({
    queryKey: [...reportsKey, "orders-by-day", 7],
    queryFn: () => fetchOrdersByDay(7),
  });
  const recent = useQuery({
    queryKey: [...reportsKey, "orders", "recent"],
    queryFn: () => fetchOrdersPage({}, 1, 5),
  });

  const data = summary.data;

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Visão Geral</h1>
          <p className="text-sm text-muted">Acompanhe o desempenho da sua cafeteria</p>
        </div>
        <div
          role="radiogroup"
          aria-label="Período"
          className="flex gap-1 rounded-2xl border border-border bg-surface p-1"
        >
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={period === p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors ${
                period === p.value
                  ? "bg-accent-soft font-semibold text-accent"
                  : "text-muted hover:bg-default"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>

      <AsyncState
        isPending={summary.isPending}
        isError={summary.isError}
        error={summary.error}
        onRetry={() => summary.refetch()}
        loadingLabel="Carregando métricas..."
        errorLabel="Não foi possível carregar as métricas"
      >
        {data && (
          <section aria-label="Métricas" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label={`Pedidos ${current.suffix}`}
              value={String(data.orders.value)}
              deltaPct={data.orders.deltaPct}
              deltaCaption={current.caption}
            />
            <MetricCard
              label={`Receita ${current.suffix}`}
              value={formatBRL(data.revenue.value)}
              deltaPct={data.revenue.deltaPct}
              deltaCaption={current.caption}
            />
            <MetricCard
              label="Ticket Médio"
              value={formatBRL(data.averageTicket.value)}
              deltaPct={data.averageTicket.deltaPct}
              deltaCaption={current.caption}
            />
            <MetricCard
              label="Bebida Mais Vendida"
              value={data.topDrink?.label ?? "—"}
              note={data.topDrink ? `${data.topDrink.quantity} vendidos` : "Sem vendas"}
            />
          </section>
        )}
      </AsyncState>

      <section className="flex flex-col gap-4 rounded-3xl bg-surface p-6 shadow-sm">
        <h2 className="text-base font-bold">Pedidos nos últimos 7 dias</h2>
        <AsyncState
          isPending={byDay.isPending}
          isError={byDay.isError}
          error={byDay.error}
          onRetry={() => byDay.refetch()}
          loadingLabel="Carregando gráfico..."
          errorLabel="Não foi possível carregar o gráfico"
        >
          {byDay.data && <OrdersChart days={byDay.data} />}
        </AsyncState>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Pedidos Recentes</h2>
          <Link href="/historico" className="text-[13px] font-semibold text-accent">
            Ver todos
          </Link>
        </div>
        <AsyncState
          isPending={recent.isPending}
          isError={recent.isError}
          error={recent.error}
          onRetry={() => recent.refetch()}
          loadingLabel="Carregando pedidos..."
          errorLabel="Não foi possível carregar os pedidos"
        >
          {recent.data && recent.data.data.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Nenhum pedido ainda.</p>
          ) : (
            recent.data && <OrdersTable orders={recent.data.data} />
          )}
        </AsyncState>
      </section>
    </>
  );
}
