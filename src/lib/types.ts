export interface DrinkOption {
  type: string;
  label: string;
  price: number;
  hasMilk: boolean;
}

export interface NewDrinkInput {
  label: string;
  price: number;
  hasMilk: boolean;
}

export type MilkType = "normal" | "zero" | "vegetal";
export type OrderStatus = "pending" | "in_progress" | "completed";

export interface DrinkItem {
  id: string;
  type: string;
  label: string;
  quantity: number;
  milk: MilkType;
  notes: string;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: DrinkItem[];
  status: OrderStatus;
  total: number;
  createdAt: number;
}

export type ReportPeriod = "today" | "7d" | "30d";

export interface MetricComparison {
  value: number;
  previous: number;
  deltaPct: number | null;
}

export interface SummaryReport {
  period: ReportPeriod;
  from: number;
  to: number;
  orders: MetricComparison;
  revenue: MetricComparison;
  averageTicket: MetricComparison;
  topDrink: { type: string; label: string; quantity: number } | null;
}

export interface DailyOrders {
  date: string;
  orders: number;
  revenue: number;
}

export interface OrdersFilters {
  from?: string;
  to?: string;
  status?: OrderStatus;
  drink?: string;
  search?: string;
}

export interface OrdersPage {
  data: Order[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
