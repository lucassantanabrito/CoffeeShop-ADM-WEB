"use client";

import { Button } from "@heroui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AsyncState } from "@/components/AsyncState";
import { OrdersTable } from "@/components/OrdersTable";
import { Pagination } from "@/components/Pagination";
import { STATUS_LABEL } from "@/components/StatusBadge";
import { drinksKey, fetchDrinks } from "@/lib/drinks";
import { fetchOrdersPage, ordersCsvUrl, reportsKey } from "@/lib/reports";
import type { OrdersFilters, OrderStatus } from "@/lib/types";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

const PAGE_SIZE = 10;

const controlClass =
  "h-11 rounded-2xl border border-border bg-surface px-3.5 text-[13px] font-medium outline-none focus-visible:border-accent";

const selectClass = `${controlClass} appearance-none pr-9`;

const selectStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
} as const;

interface FilterState {
  search: string;
  from: string;
  to: string;
  status: "" | OrderStatus;
  drink: string;
}

const EMPTY_FILTERS: FilterState = { search: "", from: "", to: "", status: "", drink: "" };

export default function HistoricoPage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(filters.search.trim());

  const apiFilters: OrdersFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      status: filters.status || undefined,
      drink: filters.drink || undefined,
    }),
    [debouncedSearch, filters.from, filters.to, filters.status, filters.drink],
  );

  const orders = useQuery({
    queryKey: [...reportsKey, "orders", "history", apiFilters, page],
    queryFn: () => fetchOrdersPage(apiFilters, page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
  const drinks = useQuery({ queryKey: drinksKey, queryFn: fetchDrinks });

  // Mudar qualquer filtro volta para a primeira página.
  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  const hasFilters = Object.values(filters).some(Boolean);
  const result = orders.data;

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Histórico de Pedidos</h1>
          <p className="text-sm text-muted">Consulte e filtre todos os pedidos já realizados</p>
        </div>
        <Button onPress={() => window.location.assign(ordersCsvUrl(apiFilters))}>
          <Download className="size-4" aria-hidden />
          Exportar
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex w-72 items-center gap-2 h-11 rounded-2xl border border-border bg-field-background px-3.5">
          <Search className="size-4 text-field-placeholder" aria-hidden />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Buscar por cliente ou nº do pedido"
            aria-label="Buscar por cliente ou número do pedido"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-field-placeholder"
          />
        </label>

        <label className="flex items-center gap-2 text-[13px] text-muted">
          De
          <input
            type="date"
            value={filters.from}
            max={filters.to || undefined}
            onChange={(e) => update("from", e.target.value)}
            className={controlClass}
          />
        </label>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          Até
          <input
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => update("to", e.target.value)}
            className={controlClass}
          />
        </label>

        <select
          aria-label="Status"
          style={selectStyle}
          value={filters.status}
          onChange={(e) => update("status", e.target.value as FilterState["status"])}
          className={selectClass}
        >
          <option value="">Todos os status</option>
          {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>

        <select
          aria-label="Bebida"
          style={selectStyle}
          value={filters.drink}
          onChange={(e) => update("drink", e.target.value)}
          className={selectClass}
        >
          <option value="">Todas as bebidas</option>
          {drinks.data?.map((drink) => (
            <option key={drink.type} value={drink.type}>
              {drink.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setFilters(EMPTY_FILTERS);
              setPage(1);
            }}
            className="text-[13px] font-semibold text-accent"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <section className="flex flex-col rounded-3xl bg-surface p-6 shadow-sm">
        <AsyncState
          isPending={orders.isPending}
          isError={orders.isError}
          error={orders.error}
          onRetry={() => orders.refetch()}
          loadingLabel="Carregando pedidos..."
          errorLabel="Não foi possível carregar os pedidos"
        >
          {result && result.data.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              {hasFilters
                ? "Nenhum pedido encontrado para esses filtros."
                : "Nenhum pedido ainda."}
            </p>
          ) : (
            result && (
              <>
                <OrdersTable orders={result.data} showDate />
                <Pagination
                  page={result.page}
                  pageSize={result.pageSize}
                  total={result.total}
                  totalPages={result.totalPages}
                  onPageChange={setPage}
                />
              </>
            )
          )}
        </AsyncState>
      </section>
    </>
  );
}
