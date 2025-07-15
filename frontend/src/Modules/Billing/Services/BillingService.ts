import httpRequest from "../../../Common/Services/httpRequest";
import {
  Invoice,
  Customer,
  CreateInvoiceRequest,
  CreateCustomerRequest,
  UpdateInvoiceStatusRequest,
  InvoiceFilters,
  CustomerFilters,
  BillingStats,
} from "../Model/Billing.interfaces";

// API Response interface matching backend
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: string[];
}

// Paginated result interface matching backend
interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class BillingService {
  private static readonly INVOICES_PATH = "/invoices";
  private static readonly CUSTOMERS_PATH = "/customers";

  // Invoice endpoints
  static async getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.INVOICES_PATH}?${queryParams.toString()}`
      : this.INVOICES_PATH;

    const response =
      await httpRequest.get<ApiResponse<PaginatedResult<Invoice>>>(url);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch invoices");
    }

    return response.data.data.items;
  }

  static async getInvoice(id: number): Promise<Invoice> {
    const response = await httpRequest.get<ApiResponse<Invoice>>(
      `${this.INVOICES_PATH}/${id}`,
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
      this.INVOICES_PATH,
      invoiceData,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create invoice");
    }

    return response.data.data;
  }

  static async updateInvoiceStatus(
    request: UpdateInvoiceStatusRequest,
  ): Promise<Invoice> {
    const response = await httpRequest.patch<ApiResponse<Invoice>>(
      `${this.INVOICES_PATH}/${request.invoiceId}/status`,
      request.status,
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to update invoice status",
      );
    }

    return response.data.data;
  }

  static async deleteInvoice(id: number): Promise<void> {
    const response = await httpRequest.delete<ApiResponse<void>>(
      `${this.INVOICES_PATH}/${id}`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete invoice");
    }
  }

  // Customer endpoints
  static async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.CUSTOMERS_PATH}?${queryParams.toString()}`
      : this.CUSTOMERS_PATH;

    const response =
      await httpRequest.get<ApiResponse<PaginatedResult<Customer>>>(url);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch customers");
    }

    return response.data.data.items;
  }

  static async getCustomer(id: number): Promise<Customer> {
    const response = await httpRequest.get<ApiResponse<Customer>>(
      `${this.CUSTOMERS_PATH}/${id}`,
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
      this.CUSTOMERS_PATH,
      customerData,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create customer");
    }

    return response.data.data;
  }

  static async updateCustomer(
    id: number,
    customerData: Partial<CreateCustomerRequest>,
  ): Promise<Customer> {
    const response = await httpRequest.put<ApiResponse<Customer>>(
      `${this.CUSTOMERS_PATH}/${id}`,
      customerData,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update customer");
    }

    return response.data.data;
  }

  static async deleteCustomer(id: number): Promise<void> {
    const response = await httpRequest.delete<ApiResponse<void>>(
      `${this.CUSTOMERS_PATH}/${id}`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete customer");
    }
  }

  // Analytics endpoints
  static async getBillingStats(): Promise<BillingStats> {
    const response =
      await httpRequest.get<ApiResponse<BillingStats>>("/billing/stats");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch billing stats");
    }

    return response.data.data;
  }

  static async exportInvoices(format: "csv" | "pdf" = "csv"): Promise<Blob> {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/invoices/export?format=${format}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("user_token")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to export invoices: ${response.statusText}`);
    }

    return response.blob();
  }

  static async sendInvoiceEmail(
    invoiceId: number,
    emailAddress?: string,
  ): Promise<void> {
    const response = await httpRequest.post<ApiResponse<void>>(
      `${this.INVOICES_PATH}/${invoiceId}/send`,
      {
        emailAddress,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send invoice email");
    }
  }
}

export default BillingService;
