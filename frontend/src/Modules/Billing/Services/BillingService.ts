import httpRequest from "@/Common/Services/httpRequest";
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

export class BillingService {
  private static readonly INVOICES_PATH = "/invoices";
  private static readonly CUSTOMERS_PATH = "/customers";

  // Invoice endpoints
  static async getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    const queryParams = filters
      ? new URLSearchParams(filters as any).toString()
      : "";
    const url = queryParams
      ? `${this.INVOICES_PATH}?${queryParams}`
      : this.INVOICES_PATH;
    const response = await httpRequest.get<Invoice[]>(url);
    return response.data;
  }

  static async getInvoice(id: number): Promise<Invoice> {
    const response = await httpRequest.get<Invoice>(
      `${this.INVOICES_PATH}/${id}`,
    );
    return response.data;
  }

  static async createInvoice(
    invoiceData: CreateInvoiceRequest,
  ): Promise<Invoice> {
    const response = await httpRequest.post<Invoice>(
      this.INVOICES_PATH,
      invoiceData,
    );
    return response.data;
  }

  static async updateInvoiceStatus(
    request: UpdateInvoiceStatusRequest,
  ): Promise<Invoice> {
    const response = await httpRequest.patch<Invoice>(
      `${this.INVOICES_PATH}/${request.invoiceId}/status`,
      request,
    );
    return response.data;
  }

  static async deleteInvoice(id: number): Promise<void> {
    await httpRequest.delete(`${this.INVOICES_PATH}/${id}`);
  }

  // Customer endpoints
  static async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    const queryParams = filters
      ? new URLSearchParams(filters as any).toString()
      : "";
    const url = queryParams
      ? `${this.CUSTOMERS_PATH}?${queryParams}`
      : this.CUSTOMERS_PATH;
    const response = await httpRequest.get<Customer[]>(url);
    return response.data;
  }

  static async getCustomer(id: number): Promise<Customer> {
    const response = await httpRequest.get<Customer>(
      `${this.CUSTOMERS_PATH}/${id}`,
    );
    return response.data;
  }

  static async createCustomer(
    customerData: CreateCustomerRequest,
  ): Promise<Customer> {
    const response = await httpRequest.post<Customer>(
      this.CUSTOMERS_PATH,
      customerData,
    );
    return response.data;
  }

  static async updateCustomer(
    id: number,
    customerData: Partial<CreateCustomerRequest>,
  ): Promise<Customer> {
    const response = await httpRequest.put<Customer>(
      `${this.CUSTOMERS_PATH}/${id}`,
      customerData,
    );
    return response.data;
  }

  static async deleteCustomer(id: number): Promise<void> {
    await httpRequest.delete(`${this.CUSTOMERS_PATH}/${id}`);
  }

  // Analytics endpoints
  static async getBillingStats(): Promise<BillingStats> {
    const response = await httpRequest.get<BillingStats>("/billing/stats");
    return response.data;
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
    return response.blob();
  }

  static async sendInvoiceEmail(
    invoiceId: number,
    emailAddress?: string,
  ): Promise<void> {
    await httpRequest.post(`${this.INVOICES_PATH}/${invoiceId}/send`, {
      emailAddress,
    });
  }
}

export default BillingService;
