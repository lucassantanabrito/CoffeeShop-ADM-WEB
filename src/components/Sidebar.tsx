"use client";

import { Coffee, History, LayoutDashboard, CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/visao-geral", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/historico", label: "Histórico de Pedidos", icon: History },
  { href: "/bebidas", label: "Bebidas", icon: Coffee },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-65 shrink-0 flex-col justify-between border-r border-border bg-surface px-5 py-6">
      <div className="flex flex-col gap-7">
        <div className="flex items-center gap-2.5 px-1">
          <Coffee className="size-6 text-accent" aria-hidden />
          <span className="text-lg font-bold">CoffeeShop</span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft font-semibold text-accent"
                    : "font-medium text-muted hover:bg-default"
                }`}
              >
                <Icon className="size-4.5" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 border-t border-separator px-1 pt-4">
        <CircleUser className="size-7 text-muted" aria-hidden />
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold">Admin</span>
          <span className="text-xs text-muted">admin@coffeeshop.com</span>
        </div>
      </div>
    </aside>
  );
}
