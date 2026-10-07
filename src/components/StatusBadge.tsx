import { Chip } from "@heroui/react";
import type { OrderStatus } from "@/lib/types";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendente",
  in_progress: "Em preparo",
  completed: "Concluído",
};

const STATUS_COLOR = {
  pending: "warning",
  in_progress: "accent",
  completed: "success",
} as const;

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Chip color={STATUS_COLOR[status]} variant="soft" size="sm">
      {STATUS_LABEL[status]}
    </Chip>
  );
}
