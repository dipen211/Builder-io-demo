export const ValidationRules = {
  required: (value: any): string | null => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return "This field is required";
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : "Please enter a valid email address";
  },

  phone: (value: string): string | null => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, "");
    return phoneRegex.test(cleanPhone)
      ? null
      : "Please enter a valid phone number";
  },

  minLength:
    (min: number) =>
    (value: string): string | null => {
      if (!value) return null;
      return value.length >= min
        ? null
        : `Must be at least ${min} characters long`;
    },

  maxLength:
    (max: number) =>
    (value: string): string | null => {
      if (!value) return null;
      return value.length <= max
        ? null
        : `Must be no more than ${max} characters long`;
    },

  minValue:
    (min: number) =>
    (value: number): string | null => {
      if (value === null || value === undefined) return null;
      return value >= min ? null : `Must be at least ${min}`;
    },

  maxValue:
    (max: number) =>
    (value: number): string | null => {
      if (value === null || value === undefined) return null;
      return value <= max ? null : `Must be no more than ${max}`;
    },

  positiveNumber: (value: number): string | null => {
    if (value === null || value === undefined) return null;
    return value > 0 ? null : "Must be a positive number";
  },

  nonNegativeNumber: (value: number): string | null => {
    if (value === null || value === undefined) return null;
    return value >= 0 ? null : "Must be zero or positive";
  },

  integer: (value: number): string | null => {
    if (value === null || value === undefined) return null;
    return Number.isInteger(value) ? null : "Must be a whole number";
  },

  date: (value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    return !isNaN(date.getTime()) ? null : "Please enter a valid date";
  },

  futureDate: (value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today ? null : "Date must be today or in the future";
  },

  pastDate: (value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today ? null : "Date must be today or in the past";
  },

  url: (value: string): string | null => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  },

  alphanumeric: (value: string): string | null => {
    if (!value) return null;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value)
      ? null
      : "Must contain only letters and numbers";
  },

  noSpecialChars: (value: string): string | null => {
    if (!value) return null;
    const noSpecialCharsRegex = /^[a-zA-Z0-9\s]+$/;
    return noSpecialCharsRegex.test(value)
      ? null
      : "Must not contain special characters";
  },

  strongPassword: (value: string): string | null => {
    if (!value) return null;

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (value.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }

    return null;
  },

  matchField:
    (fieldName: string, otherValue: any) =>
    (value: any): string | null => {
      return value === otherValue ? null : `Must match ${fieldName}`;
    },

  custom:
    (validator: (value: any) => boolean, message: string) =>
    (value: any): string | null => {
      return validator(value) ? null : message;
    },
};

// Composite validators
export const createCompositeValidator = (
  ...validators: Array<(value: any) => string | null>
) => {
  return (value: any): string | null => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

// Common validation combinations
export const CommonValidators = {
  requiredEmail: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.email,
  ),

  requiredPhone: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.phone,
  ),

  requiredPositiveNumber: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.positiveNumber,
  ),

  requiredInteger: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.integer,
    ValidationRules.positiveNumber,
  ),

  requiredFutureDate: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.date,
    ValidationRules.futureDate,
  ),

  currencyAmount: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.nonNegativeNumber,
    ValidationRules.custom(
      (value) => value < 1000000,
      "Amount must be less than $1,000,000",
    ),
  ),

  invoiceDescription: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.minLength(3),
    ValidationRules.maxLength(200),
    ValidationRules.noSpecialChars,
  ),

  customerName: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.minLength(2),
    ValidationRules.maxLength(100),
  ),

  taxId: (value: string): string | null => {
    if (!value) return null;
    // Simple tax ID validation (can be customized per country)
    const taxIdRegex = /^[A-Z0-9\-]{5,20}$/;
    return taxIdRegex.test(value.toUpperCase())
      ? null
      : "Please enter a valid tax ID";
  },
};

// Form validation helper
export class FormValidator {
  private rules: Record<string, (value: any) => string | null>;

  constructor(rules: Record<string, (value: any) => string | null>) {
    this.rules = rules;
  }

  validate(data: Record<string, any>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    Object.keys(this.rules).forEach((field) => {
      const validator = this.rules[field];
      const error = validator(data[field]);
      if (error) {
        errors[field] = error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateField(field: string, value: any): string | null {
    const validator = this.rules[field];
    return validator ? validator(value) : null;
  }

  addRule(field: string, validator: (value: any) => string | null): void {
    this.rules[field] = validator;
  }

  removeRule(field: string): void {
    delete this.rules[field];
  }
}

// Billing-specific validators
export const BillingValidators = {
  invoiceNumber: (value: string): string | null => {
    if (!value) return ValidationRules.required(value);
    const invoiceNumberRegex = /^INV-\d{8}-\d{4}$/;
    return invoiceNumberRegex.test(value)
      ? null
      : "Invalid invoice number format (e.g., INV-20240101-1001)";
  },

  quantity: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.integer,
    ValidationRules.minValue(1),
    ValidationRules.maxValue(10000),
  ),

  unitPrice: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.nonNegativeNumber,
    ValidationRules.maxValue(100000),
  ),

  dueDate: createCompositeValidator(
    ValidationRules.required,
    ValidationRules.date,
    ValidationRules.futureDate,
  ),

  notes: ValidationRules.maxLength(500),
};
