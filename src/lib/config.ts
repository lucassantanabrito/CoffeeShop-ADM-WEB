export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

// Fuso usado para mostrar data/hora dos pedidos (o mesmo do backend).
export const TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE ?? "America/Sao_Paulo";
