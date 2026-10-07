"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL } from "./config";

export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(API_URL, { transports: ["websocket"] });
    const invalidate = (key: string) => () =>
      queryClient.invalidateQueries({ queryKey: [key] });

    for (const event of ["drink:created", "drink:updated", "drink:deleted"]) {
      socket.on(event, invalidate("drinks"));
    }
    for (const event of ["order:created", "order:updated", "order:deleted"]) {
      socket.on(event, invalidate("orders"));
      socket.on(event, invalidate("reports"));
    }

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
