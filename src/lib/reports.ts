import { API_URL } from "./config";
import { request } from "./api";
import type {
  DailyOrders,
  OrdersFilters,
  OrdersPage,
  ReportPeriod,
  SummaryReport,
} from "./types";

export const reportsKey = ["reports"] as const;

function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const fetchSummary = (period: ReportPeriod) =>
  request<SummaryReport>(`/reports/summary${toQuery({ period })}`);

export const fetchOrdersByDay = (days: number) =>
  request<DailyOrders[]>(`/reports/orders-by-day${toQuery({ days })}`);

export const fetchOrdersPage = (
  filters: OrdersFilters,
  page: number,
  pageSize: number,
) =>
  request<OrdersPage>(
    `/reports/orders${toQuery({ ...filters, page, pageSize })}`,
  );

export const ordersCsvUrl = (filters: OrdersFilters) =>
  `${API_URL}/reports/orders.csv${toQuery({ ...filters })}`;
