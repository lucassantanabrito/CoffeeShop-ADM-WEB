"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useRealtimeSync } from "@/lib/useRealtimeSync";

function RealtimeSync() {
  useRealtimeSync();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 10_000 } } }),
  );
  return (
    <QueryClientProvider client={client}>
      <RealtimeSync />
      {children}
    </QueryClientProvider>
  );
}
