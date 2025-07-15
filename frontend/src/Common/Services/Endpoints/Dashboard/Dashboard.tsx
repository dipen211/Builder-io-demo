import httpRequest from "../../httpRequest";
import {
  DashboardData,
  DashboardStats,
} from "../../../../Modules/Dashboard/Model/Dashboard.interfaces";

// API Response interface matching backend
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: string[];
}

export class DashboardService {
  private static readonly BASE_PATH = "/api/dashboard";

  static async getDashboardData(): Promise<DashboardData> {
    const response = await httpRequest.get<ApiResponse<DashboardData>>(
      this.BASE_PATH,
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch dashboard data",
      );
    }

    return response.data.data;
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await httpRequest.get<ApiResponse<DashboardStats>>(
      `${this.BASE_PATH}/stats`,
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch dashboard stats",
      );
    }

    return response.data.data;
  }

  static async getRecentActivity(limit: number = 10): Promise<any[]> {
    const response = await httpRequest.get<ApiResponse<any[]>>(
      `${this.BASE_PATH}/activity?limit=${limit}`,
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch recent activity",
      );
    }

    return response.data.data;
  }

  static async refreshDashboard(): Promise<DashboardData> {
    const response = await httpRequest.post<ApiResponse<DashboardData>>(
      `${this.BASE_PATH}/refresh`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to refresh dashboard");
    }

    return response.data.data;
  }
}

export default DashboardService;
