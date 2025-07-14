import { API_CONFIG } from "@/Common/Constants/Constants";
import { HttpMethod } from "@/Common/Constants/Enums";
import {
  SessionStorageUtil,
  SESSION_STORAGE_KEYS,
} from "@/Common/Constants/SessionStorage";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

class HttpRequestService {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  private getAuthToken(): string | null {
    return SessionStorageUtil.get(SESSION_STORAGE_KEYS.USER_TOKEN);
  }

  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async makeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const {
      method,
      url,
      data,
      headers = {},
      timeout = this.timeout,
      retries = this.retryAttempts,
    } = config;

    const requestUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;
    const requestHeaders = { ...this.getDefaultHeaders(), ...headers };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    };

    if (data && method !== HttpMethod.GET) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(requestUrl, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      return {
        data: responseData,
        status: response.status,
        success: true,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (retries > 0 && error.name !== "AbortError") {
        await this.delay(1000);
        return this.makeRequest({ ...config, retries: retries - 1 });
      }

      throw this.handleError(error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private handleError(error: any): ApiError {
    if (error.name === "AbortError") {
      return {
        message: "Request timed out",
        status: 408,
      };
    }

    return {
      message: error.message || "An unexpected error occurred",
      status: error.status || 500,
    };
  }

  // Public HTTP methods
  async get<T>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.GET,
      url,
      headers,
    });
  }

  async post<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.POST,
      url,
      data,
      headers,
    });
  }

  async put<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.PUT,
      url,
      data,
      headers,
    });
  }

  async patch<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.PATCH,
      url,
      data,
      headers,
    });
  }

  async delete<T>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.DELETE,
      url,
      headers,
    });
  }

  // Utility methods
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  setRetryAttempts(attempts: number): void {
    this.retryAttempts = attempts;
  }
}

export const httpRequest = new HttpRequestService();
export default httpRequest;
