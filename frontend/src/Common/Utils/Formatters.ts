import { CURRENCY_CONFIG, DATE_FORMATS } from "@/Common/Constants/Constants";

export const CurrencyFormatter = {
  format: (amount: number): string => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
      style: "currency",
      currency: CURRENCY_CONFIG.CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  parse: (value: string): number => {
    const cleanValue = value.replace(/[^0-9.-]/g, "");
    return parseFloat(cleanValue) || 0;
  },

  formatWithoutSymbol: (amount: number): string => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },
};

export const DateFormatter = {
  format: (
    date: Date | string,
    format: string = DATE_FORMATS.DISPLAY,
  ): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "";
    }

    switch (format) {
      case DATE_FORMATS.DISPLAY:
        return dateObj.toLocaleDateString();
      case DATE_FORMATS.ISO:
        return dateObj.toISOString().split("T")[0];
      case DATE_FORMATS.TIMESTAMP:
        return dateObj.toLocaleString();
      default:
        return dateObj.toLocaleDateString();
    }
  },

  parse: (dateString: string): Date | null => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  },

  isValid: (date: Date | string): boolean => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  },

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  getDaysDifference: (date1: Date, date2: Date): number => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  },
};

export const NumberFormatter = {
  format: (value: number, decimals: number = 0): string => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  formatPercentage: (value: number, decimals: number = 1): string => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  },

  formatCompact: (value: number): string => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  },
};

export const StringFormatter = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  camelCase: (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  },

  kebabCase: (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();
  },

  truncate: (str: string, length: number, suffix: string = "..."): string => {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  removeSpecialChars: (str: string): string => {
    return str.replace(/[^a-zA-Z0-9\s]/g, "");
  },
};
