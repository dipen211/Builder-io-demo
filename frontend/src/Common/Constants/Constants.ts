export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:7000/api",
  TIMEOUT: 10000, // Reduced timeout for faster fallback
  RETRY_ATTEMPTS: 1, // Reduced retries for faster fallback
} as const;

export const APP_CONFIG = {
  NAME: process.env.REACT_APP_APP_NAME || "Billing Management System",
  VERSION: process.env.REACT_APP_VERSION || "1.0.0",
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEMO_MODE: process.env.REACT_APP_DEMO_MODE === "true",
  BACKEND_AVAILABLE: process.env.REACT_APP_BACKEND_AVAILABLE === "true",
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
  MAX_RETRIES: 1, // Reduced retries
} as const;
