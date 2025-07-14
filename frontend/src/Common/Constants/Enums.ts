/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */

export enum InvoiceStatus {
  DRAFT = "Draft",
  SENT = "Sent",
  PAID = "Paid",
  OVERDUE = "Overdue",
  CANCELLED = "Cancelled",
}

export enum CustomerType {
  INDIVIDUAL = "Individual",
  BUSINESS = "Business",
}

export enum PaymentMethod {
  CASH = "Cash",
  CHECK = "Check",
  CREDIT_CARD = "Credit Card",
  BANK_TRANSFER = "Bank Transfer",
  ONLINE = "Online",
}

export enum NavigationTabs {
  DASHBOARD = "dashboard",
  INVOICES = "invoices",
  CUSTOMERS = "customers",
  CREATE_INVOICE = "create-invoice",
  PROFILE = "profile",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum LoadingState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}
