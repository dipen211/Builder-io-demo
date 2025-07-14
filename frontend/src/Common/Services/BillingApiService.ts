import httpRequest from "./httpRequest";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalInvoices: number;
  totalAmount: number;
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
  status: string;
  items: InvoiceItem[];
  notes?: string;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
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
  phone: string;
  address: string;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingInvoices: number;
  totalCustomers: number;
  overdueInvoices: number;
  pendingAmount: number;
  overdueAmount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class BillingApiService {
  // Dashboard endpoints
  static async getDashboardStats(): Promise<DashboardStats> {
    const response =
      await httpRequest.get<ApiResponse<DashboardStats>>("/dashboard/stats");
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch dashboard stats",
      );
    }
    return response.data.data;
  }

  static async getRecentInvoices(count: number = 5): Promise<Invoice[]> {
    const response = await httpRequest.get<ApiResponse<Invoice[]>>(
      `/dashboard/recent-invoices?count=${count}`,
    );
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch recent invoices",
      );
    }
    return response.data.data;
  }

  static async getDashboardData(): Promise<{
    stats: DashboardStats;
    recentInvoices: Invoice[];
  }> {
    const response =
      await httpRequest.get<
        ApiResponse<{ stats: DashboardStats; recentInvoices: Invoice[] }>
      >("/dashboard");
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch dashboard data",
      );
    }
    return response.data.data;
  }

  // Invoice endpoints
  static async getInvoices(filters?: {
    status?: string;
    customerId?: number;
    dateFrom?: string;
    dateTo?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<Invoice>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response =
      await httpRequest.get<ApiResponse<PaginatedResult<Invoice>>>(url);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch invoices");
    }
    return response.data.data;
  }

  static async getInvoice(id: number): Promise<Invoice> {
    const response = await httpRequest.get<ApiResponse<Invoice>>(
      `/invoices/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch invoice");
    }
    return response.data.data;
  }

  static async createInvoice(
    invoiceData: CreateInvoiceRequest,
  ): Promise<Invoice> {
    const response = await httpRequest.post<ApiResponse<Invoice>>(
      "/invoices",
      invoiceData,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create invoice");
    }
    return response.data.data;
  }

  static async updateInvoiceStatus(
    id: number,
    status: string,
  ): Promise<Invoice> {
    const response = await httpRequest.patch<ApiResponse<Invoice>>(
      `/invoices/${id}/status`,
      status,
    );
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to update invoice status",
      );
    }
    return response.data.data;
  }

  // Customer endpoints
  static async getCustomers(
    search?: string,
    pageNumber?: number,
    pageSize?: number,
  ): Promise<PaginatedResult<Customer>> {
    const queryParams = new URLSearchParams();

    if (search) queryParams.append("search", search);
    if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
    if (pageSize) queryParams.append("pageSize", pageSize.toString());

    const url = `/customers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response =
      await httpRequest.get<ApiResponse<PaginatedResult<Customer>>>(url);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch customers");
    }
    return response.data.data;
  }

  static async getCustomer(id: number): Promise<Customer> {
    const response = await httpRequest.get<ApiResponse<Customer>>(
      `/customers/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch customer");
    }
    return response.data.data;
  }

  static async createCustomer(
    customerData: CreateCustomerRequest,
  ): Promise<Customer> {
    const response = await httpRequest.post<ApiResponse<Customer>>(
      "/customers",
      customerData,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create customer");
    }
    return response.data.data;
  }

  static async updateCustomer(
    id: number,
    customerData: CreateCustomerRequest,
  ): Promise<Customer> {
    const response = await httpRequest.put<ApiResponse<Customer>>(
      `/customers/${id}`,
      customerData,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update customer");
    }
    return response.data.data;
  }

  static async deleteCustomer(id: number): Promise<void> {
    const response = await httpRequest.delete<ApiResponse<void>>(
      `/customers/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete customer");
    }
  }

  static async getCustomerInvoices(id: number): Promise<Invoice[]> {
    const response = await httpRequest.get<ApiResponse<Invoice[]>>(
      `/customers/${id}/invoices`,
    );
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch customer invoices",
      );
    }
    return response.data.data;
  }
}

export default BillingApiService;
