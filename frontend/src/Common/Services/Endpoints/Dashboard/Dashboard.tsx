import httpRequest from "../../httpRequest";
import {
  DashboardData,
  DashboardStats,
} from "../../../../Modules/Dashboard/Model/Dashboard.interfaces";

export class DashboardService {
  private static readonly BASE_PATH = "/dashboard";

  static async getDashboardData(): Promise<DashboardData> {
    const response = await httpRequest.get<DashboardData>(this.BASE_PATH);
    return response.data;
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await httpRequest.get<DashboardStats>(
      `${this.BASE_PATH}/stats`,
    );
    return response.data;
  }

  static async getRecentActivity(limit: number = 10): Promise<any[]> {
    const response = await httpRequest.get<any[]>(
      `${this.BASE_PATH}/activity?limit=${limit}`,
    );
    return response.data;
  }

  static async refreshDashboard(): Promise<DashboardData> {
    const response = await httpRequest.post<DashboardData>(
      `${this.BASE_PATH}/refresh`,
    );
    return response.data;
  }
}

export default DashboardService;
