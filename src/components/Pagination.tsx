import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Até 5 páginas visíveis, centradas na atual.
function visiblePages(page: number, totalPages: number): number[] {
  const size = Math.min(5, totalPages);
  const start = Math.min(Math.max(1, page - Math.floor(size / 2)), totalPages - size + 1);
  return Array.from({ length: size }, (_, i) => start + i);
}

const baseButton =
  "flex size-8 items-center justify-center rounded-2xl text-[13px] font-semibold transition-colors";

export function Pagination({ page, pageSize, total, totalPages, onPageChange }: Props) {
  if (total === 0) {
    return null;
  }
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-[13px] text-muted">
        Mostrando {first}-{last} de {total} pedidos
      </p>
      <nav aria-label="Paginação" className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`${baseButton} border border-border disabled:text-muted/50`}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        {visiblePages(page, totalPages).map((p) => (
          <button
            key={p}
            type="button"
            aria-label={`Página ${p}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={`${baseButton} ${
              p === page ? "bg-accent text-accent-foreground" : "text-muted hover:bg-default"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`${baseButton} border border-border disabled:text-muted/50`}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </nav>
    </div>
  );
}
