import { formatBRL, formatDate, formatTime } from "@/lib/format";
import type { Order } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

function describeItems(order: Order): string {
  return order.items
    .map((item) => {
      const milk = item.milk === "normal" ? "" : ` (leite ${item.milk})`;
      return `${item.quantity}x ${item.label}${milk}`;
    })
    .join(", ");
}

interface Props {
  orders: Order[];
  showDate?: boolean;
}

export function OrdersTable({ orders, showDate = false }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-170 text-left text-[13px]">
        <thead>
          <tr className="border-b border-separator text-xs text-muted">
            <th className="w-20 pb-2 font-semibold">Pedido</th>
            <th className="w-44 pb-2 font-semibold">Cliente</th>
            <th className="pb-2 font-semibold">Itens</th>
            <th className="w-28 pb-2 font-semibold">Total</th>
            <th className="w-36 pb-2 font-semibold">Status</th>
            {showDate && <th className="w-28 pb-2 font-semibold">Data</th>}
            <th className="w-20 pb-2 font-semibold">Horário</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="h-13 border-b border-separator last:border-0">
              <td className="font-semibold">#{order.id}</td>
              <td className="pr-3 text-muted">{order.customerName}</td>
              <td className="pr-3 text-muted">{describeItems(order)}</td>
              <td className="font-bold">{formatBRL(order.total)}</td>
              <td>
                <StatusBadge status={order.status} />
              </td>
              {showDate && <td className="text-muted">{formatDate(order.createdAt)}</td>}
              <td className="text-muted">{formatTime(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
