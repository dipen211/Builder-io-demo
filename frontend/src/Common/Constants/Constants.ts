export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:7195/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const APP_CONFIG = {
  NAME: process.env.REACT_APP_APP_NAME || "Billing Management System",
  VERSION: process.env.REACT_APP_VERSION || "1.0.0",
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const CURRENCY_CONFIG = {
  LOCALE: "en-US",
  CURRENCY: "USD",
  TAX_RATE: 0.1, // 10%
} as const;

export const DATE_FORMATS = {
  DISPLAY: "MM/dd/yyyy",
  ISO: "yyyy-MM-dd",
  TIMESTAMP: "yyyy-MM-dd HH:mm:ss",
} as const;

// Backend connection status
export const CONNECTION_CONFIG = {
  BACKEND_HEALTH_CHECK: `${API_CONFIG.BASE_URL.replace("/api", "")}/health`,
  RETRY_DELAY: 2000,
  MAX_RETRIES: 3,
} as const;
