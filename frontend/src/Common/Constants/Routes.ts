export const Routes = {
  DASHBOARD: "/dashboard",
  BILLING: "/billing",
  INVOICES: "/billing/invoices",
  CUSTOMERS: "/billing/customers",
  CREATE_INVOICE: "/billing/create-invoice",
  PROFILE: "/profile",
  HOME: "/",
} as const;

export type RouteType = (typeof Routes)[keyof typeof Routes];
