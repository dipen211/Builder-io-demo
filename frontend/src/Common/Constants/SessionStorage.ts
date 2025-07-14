export const SESSION_STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_DATA: "user_data",
  THEME: "theme",
  LANGUAGE: "language",
  LAST_VISITED_PAGE: "last_visited_page",
  INVOICE_DRAFT: "invoice_draft",
  CUSTOMER_FILTERS: "customer_filters",
} as const;

export type SessionStorageKey =
  (typeof SESSION_STORAGE_KEYS)[keyof typeof SESSION_STORAGE_KEYS];

export const SessionStorageUtil = {
  get: (key: SessionStorageKey): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error("Error getting session storage item:", error);
      return null;
    }
  },

  set: (key: SessionStorageKey, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting session storage item:", error);
    }
  },

  remove: (key: SessionStorageKey): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing session storage item:", error);
    }
  },

  clear: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing session storage:", error);
    }
  },
};
