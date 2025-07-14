import httpRequest from "./httpRequest";
import { APP_CONFIG } from "../Constants/Constants";
import DemoDataService from "./DemoDataService";

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
  private static async tryApiCall<T>(
    apiCall: () => Promise<T>,
    fallback: () => Promise<T>,
  ): Promise<T> {
    if (APP_CONFIG.DEMO_MODE || !APP_CONFIG.BACKEND_AVAILABLE) {
      console.log("🎮 Demo mode: Using demo data instead of API");
      return fallback();
    }

    try {
      return await apiCall();
    } catch (error) {
      console.warn("⚠️ API call failed, falling back to demo data:", error);
      return fallback();
    }
  }

  // Dashboard endpoints
  static async getDashboardStats(): Promise<DashboardStats> {
    return this.tryApiCall(
      async () => {
        const response =
          await httpRequest.get<ApiResponse<DashboardStats>>(
            "/dashboard/stats",
          );
        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to fetch dashboard stats",
          );
        }
        return response.data.data;
      },
      () => DemoDataService.getDashboardStats(),
    );
  }

  static async getRecentInvoices(count: number = 5): Promise<Invoice[]> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.get<ApiResponse<Invoice[]>>(
          `/dashboard/recent-invoices?count=${count}`,
        );
        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to fetch recent invoices",
          );
        }
        return response.data.data;
      },
      () => DemoDataService.getRecentInvoices(count),
    );
  }

  static async getDashboardData(): Promise<{
    stats: DashboardStats;
    recentInvoices: Invoice[];
  }> {
    return this.tryApiCall(
      async () => {
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
      },
      () => DemoDataService.getDashboardData(),
    );
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
    return this.tryApiCall(
      async () => {
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
      },
      () => DemoDataService.getInvoices(filters),
    );
  }

  static async getInvoice(id: number): Promise<Invoice> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.get<ApiResponse<Invoice>>(
          `/invoices/${id}`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch invoice");
        }
        return response.data.data;
      },
      async () => {
        const invoices = await DemoDataService.getInvoices();
        const invoice = invoices.items.find((i) => i.id === id);
        if (!invoice) {
          throw new Error("Invoice not found");
        }
        return invoice;
      },
    );
  }

  static async createInvoice(
    invoiceData: CreateInvoiceRequest,
  ): Promise<Invoice> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.post<ApiResponse<Invoice>>(
          "/invoices",
          invoiceData,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create invoice");
        }
        return response.data.data;
      },
      () => DemoDataService.createInvoice(invoiceData),
    );
  }

  static async updateInvoiceStatus(
    id: number,
    status: string,
  ): Promise<Invoice> {
    return this.tryApiCall(
      async () => {
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
      },
      () => DemoDataService.updateInvoiceStatus(id, status),
    );
  }

  // Customer endpoints
  static async getCustomers(
    search?: string,
    pageNumber?: number,
    pageSize?: number,
  ): Promise<PaginatedResult<Customer>> {
    return this.tryApiCall(
      async () => {
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
      },
      () => DemoDataService.getCustomers(search, pageNumber, pageSize),
    );
  }

  static async getCustomer(id: number): Promise<Customer> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.get<ApiResponse<Customer>>(
          `/customers/${id}`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch customer");
        }
        return response.data.data;
      },
      async () => {
        const customers = await DemoDataService.getCustomers();
        const customer = customers.items.find((c) => c.id === id);
        if (!customer) {
          throw new Error("Customer not found");
        }
        return customer;
      },
    );
  }

  static async createCustomer(
    customerData: CreateCustomerRequest,
  ): Promise<Customer> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.post<ApiResponse<Customer>>(
          "/customers",
          customerData,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create customer");
        }
        return response.data.data;
      },
      () => DemoDataService.createCustomer(customerData),
    );
  }

  static async updateCustomer(
    id: number,
    customerData: CreateCustomerRequest,
  ): Promise<Customer> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.put<ApiResponse<Customer>>(
          `/customers/${id}`,
          customerData,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to update customer");
        }
        return response.data.data;
      },
      async () => {
        // For demo, just return the updated customer data
        const customers = await DemoDataService.getCustomers();
        const customer = customers.items.find((c) => c.id === id);
        if (!customer) {
          throw new Error("Customer not found");
        }
        Object.assign(customer, customerData);
        return customer;
      },
    );
  }

  static async deleteCustomer(id: number): Promise<void> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.delete<ApiResponse<void>>(
          `/customers/${id}`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to delete customer");
        }
      },
      () => DemoDataService.deleteCustomer(id),
    );
  }

  static async getCustomerInvoices(id: number): Promise<Invoice[]> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.get<ApiResponse<Invoice[]>>(
          `/customers/${id}/invoices`,
        );
        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to fetch customer invoices",
          );
        }
        return response.data.data;
      },
      async () => {
        const invoices = await DemoDataService.getInvoices();
        return invoices.items.filter((invoice) => invoice.customer.id === id);
      },
    );
  }

  // Individual invoice operations
  static async getInvoice(id: number): Promise<Invoice> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.get<ApiResponse<Invoice>>(
          `/invoices/${id}`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch invoice");
        }
        return response.data.data;
      },
      () => DemoDataService.getInvoice(id),
    );
  }

  // Individual customer operations
  static async getCustomer(id: number): Promise<Customer> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.get<ApiResponse<Customer>>(
          `/customers/${id}`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch customer");
        }
        return response.data.data;
      },
      () => DemoDataService.getCustomer(id),
    );
  }

  static async updateCustomer(
    id: number,
    customerData: CreateCustomerRequest,
  ): Promise<Customer> {
    return this.tryApiCall(
      async () => {
        const response = await httpRequest.put<ApiResponse<Customer>>(
          `/customers/${id}`,
          customerData,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to update customer");
        }
        return response.data.data;
      },
      () => DemoDataService.updateCustomer(id, customerData),
    );
  }
}

export default BillingApiService;
