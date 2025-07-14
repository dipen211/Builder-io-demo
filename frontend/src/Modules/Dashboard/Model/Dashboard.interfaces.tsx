import { InvoiceStatus } from "../../../Common/Constants/Enums";

export interface DashboardStats {
  totalRevenue: number;
  pendingInvoices: number;
  totalCustomers: number;
  overdueInvoices: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  customer: Customer;
  total: number;
  status: InvoiceStatus;
}

export interface DashboardData {
  stats: DashboardStats;
  recentInvoices: Invoice[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: "invoice_created" | "invoice_paid" | "customer_added";
  description: string;
  timestamp: string;
  relatedId?: number;
}
