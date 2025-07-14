import { useState, useEffect, useCallback } from "react";
import { LoadingState } from "@/Common/Constants/Enums";

// Generic async data fetching hook
export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(LoadingState.LOADING);
      setError(null);
      const result = await asyncFunction();
      setData(result);
      setLoading(LoadingState.SUCCESS);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(LoadingState.ERROR);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    isLoading: loading === LoadingState.LOADING,
    isError: loading === LoadingState.ERROR,
    isSuccess: loading === LoadingState.SUCCESS,
  };
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key "' + key + '":', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage key "' + key + '":', error);
    }
  };

  return [storedValue, setValue] as const;
}

// Debounced value hook
export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Window size hook
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState<T>(value);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}

// Toggle hook
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
}

// Form validation hook
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (name: keyof T, value: any) => {
    const rule = validationRules[name];
    return rule ? rule(value) : null;
  };

  const setValue = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const setFieldTouched = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as Partial<Record<keyof T, boolean>>,
      ),
    );

    return !hasErrors;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// API loading states hook
export function useApiState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = async <T,>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await apiCall();

      setSuccess(true);
      return result;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    execute,
    reset,
  };
}
