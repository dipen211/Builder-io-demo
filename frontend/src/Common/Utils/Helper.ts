import { InvoiceStatus } from "@/Common/Constants/Enums";

export const UtilityHelper = {
  generateId: (): string => {
    return Math.random().toString(36).substr(2, 9);
  },

  generateInvoiceNumber: (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `INV-${year}${month}${day}-${random}`;
  },

  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number,
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array)
      return obj.map((item) => UtilityHelper.deepClone(item)) as unknown as T;
    if (typeof obj === "object") {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = UtilityHelper.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  },

  isEmpty: (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  },

  calculateAge: (birthDate: Date): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  },

  getInvoiceStatusColor: (status: InvoiceStatus): string => {
    switch (status) {
      case InvoiceStatus.DRAFT:
        return "#2196F3";
      case InvoiceStatus.SENT:
        return "#FF9800";
      case InvoiceStatus.PAID:
        return "#4CAF50";
      case InvoiceStatus.OVERDUE:
        return "#F44336";
      case InvoiceStatus.CANCELLED:
        return "#9E9E9E";
      default:
        return "#9E9E9E";
    }
  },

  sortArray: <T>(
    array: T[],
    key: keyof T,
    direction: "asc" | "desc" = "asc",
  ): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  },

  filterArray: <T>(
    array: T[],
    searchTerm: string,
    searchKeys: (keyof T)[],
  ): T[] => {
    if (!searchTerm.trim()) return array;

    const lowerSearchTerm = searchTerm.toLowerCase();

    return array.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowerSearchTerm);
        }
        if (typeof value === "number") {
          return value.toString().includes(lowerSearchTerm);
        }
        return false;
      }),
    );
  },
};

export const StorageHelper = {
  setItem: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue || null;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};
