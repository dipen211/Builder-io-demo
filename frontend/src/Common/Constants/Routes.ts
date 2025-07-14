export const Routes = {
  DASHBOARD: "/dashboard",
  BILLING: "/billing",
  INVOICES: "/billing/invoices",
  CUSTOMERS: "/billing/customers",
  CREATE_INVOICE: "/billing/create-invoice",
  INVOICE_VIEW: "/billing/invoices/view",
  INVOICE_EDIT: "/billing/invoices/edit",
  CUSTOMER_VIEW: "/billing/customers/view",
  CUSTOMER_EDIT: "/billing/customers/edit",
  PROFILE: "/profile",
  HOME: "/",
} as const;

export type RouteType = (typeof Routes)[keyof typeof Routes];
