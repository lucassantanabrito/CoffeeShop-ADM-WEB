import { Button } from "@heroui/react";
import type { ReactNode } from "react";

interface Props {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  loadingLabel?: string;
  errorLabel?: string;
  children: ReactNode;
}

// Mostra carregando/erro no lugar do conteúdo de uma seção.
export function AsyncState({
  isPending,
  isError,
  error,
  onRetry,
  loadingLabel = "Carregando...",
  errorLabel = "Não foi possível carregar os dados",
  children,
}: Props) {
  if (isPending) {
    return <p className="py-8 text-center text-sm text-muted">{loadingLabel}</p>;
  }
  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-8">
        <p className="text-sm text-danger">
          {errorLabel}
          {error ? ` (${error.message})` : ""}.
        </p>
        <Button variant="secondary" onPress={onRetry}>
          Tentar novamente
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}
