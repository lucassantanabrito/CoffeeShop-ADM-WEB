"use client";

import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Coffee, Milk, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { DeleteDrinkModal } from "@/components/DeleteDrinkModal";
import { DrinkFormModal } from "@/components/DrinkFormModal";
import { drinksKey, fetchDrinks } from "@/lib/drinks";
import { formatBRL } from "@/lib/format";
import type { DrinkOption } from "@/lib/types";

type FormState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; drink: DrinkOption };

export default function BebidasPage() {
  const { data: drinks, isPending, isError, error, refetch } = useQuery({
    queryKey: drinksKey,
    queryFn: fetchDrinks,
  });
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>({ mode: "closed" });
  const [toDelete, setToDelete] = useState<DrinkOption | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (drinks ?? []).filter((d) => d.label.toLowerCase().includes(term));
  }, [drinks, search]);

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Bebidas</h1>
          <p className="text-sm text-muted">
            Gerencie o cardápio de bebidas disponíveis para pedidos
          </p>
        </div>
        <Button onPress={() => setForm({ mode: "create" })}>
          <Plus className="size-4" aria-hidden />
          Nova Bebida
        </Button>
      </header>

      <label className="flex w-80 items-center gap-2 rounded-2xl border border-border bg-field-background px-3.5 py-2.5">
        <Search className="size-4 text-field-placeholder" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar bebida..."
          aria-label="Buscar bebida"
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-field-placeholder"
        />
      </label>

      <section className="rounded-3xl bg-surface p-6 shadow-sm">
        {isPending && <p className="py-8 text-center text-sm text-muted">Carregando bebidas...</p>}

        {isError && (
          <div role="alert" className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-danger">
              Não foi possível carregar as bebidas ({error.message}).
            </p>
            <Button variant="secondary" onPress={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {drinks && filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            {drinks.length === 0
              ? "Nenhuma bebida cadastrada ainda."
              : "Nenhuma bebida encontrada para essa busca."}
          </p>
        )}

        {filtered.length > 0 && (
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-separator text-xs text-muted">
                <th className="pb-2 font-semibold">Bebida</th>
                <th className="w-25 pb-2 font-semibold">Leite</th>
                <th className="w-32.5 pb-2 font-semibold">Preço</th>
                <th className="w-25 pb-2 font-semibold">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((drink) => (
                <tr key={drink.type} className="h-14 border-b border-separator last:border-0">
                  <td>
                    <span className="flex items-center gap-2.5 font-semibold">
                      <Coffee className="size-4.5 text-muted" aria-hidden />
                      {drink.label}
                    </span>
                  </td>
                  <td>
                    {drink.hasMilk ? (
                      <Milk className="size-4 text-muted" aria-label="Com leite" />
                    ) : (
                      <span className="text-muted" aria-label="Sem leite">
                        —
                      </span>
                    )}
                  </td>
                  <td className="font-bold">{formatBRL(drink.price)}</td>
                  <td>
                    <span className="flex items-center gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={`Editar ${drink.label}`}
                        onPress={() => setForm({ mode: "edit", drink })}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={`Excluir ${drink.label}`}
                        onPress={() => setToDelete(drink)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {form.mode !== "closed" && (
        <DrinkFormModal
          key={form.mode === "edit" ? form.drink.type : "new"}
          drink={form.mode === "edit" ? form.drink : null}
          onClose={() => setForm({ mode: "closed" })}
        />
      )}
      {toDelete && <DeleteDrinkModal drink={toDelete} onClose={() => setToDelete(null)} />}
    </>
  );
}
