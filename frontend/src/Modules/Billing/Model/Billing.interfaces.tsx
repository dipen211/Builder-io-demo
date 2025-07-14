import {
  InvoiceStatus,
  CustomerType,
  PaymentMethod,
} from "../../../Common/Constants/Enums";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  type?: CustomerType;
  taxId?: string;
  invoices?: Invoice[];
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: Customer;
  subTotal: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  notes?: string;
  paymentMethod?: PaymentMethod;
  paidDate?: string;
}

export interface CreateInvoiceRequest {
  customerId: number;
  dueDate: string;
  items: CreateInvoiceItemRequest[];
  notes?: string;
}

export interface CreateInvoiceItemRequest {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type?: CustomerType;
  taxId?: string;
}

export interface UpdateInvoiceStatusRequest {
  invoiceId: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paidDate?: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  customerId?: number;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

export interface CustomerFilters {
  type?: CustomerType;
  searchTerm?: string;
}

export interface BillingStats {
  totalInvoices: number;
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidInvoices: number;
  unpaidInvoices: number;
}

export interface PaymentRecord {
  id: number;
  invoiceId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
}
