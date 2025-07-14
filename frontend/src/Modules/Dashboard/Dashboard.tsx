import React, { useState, useEffect } from "react";
import {
  CurrencyFormatter,
  DateFormatter,
} from "../../Common/Utils/Formatters";
import { APP_CONFIG } from "../../Common/Constants/Constants";
import BillingApiService, {
  DashboardStats,
  Invoice,
} from "../../Common/Services/BillingApiService";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    pendingInvoices: 0,
    totalCustomers: 0,
    overdueInvoices: 0,
    pendingAmount: 0,
    overdueAmount: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await BillingApiService.getDashboardData();
      setStats(dashboardData.stats);
      setRecentInvoices(dashboardData.recentInvoices);
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "paid":
        return "status-badge status-paid";
      case "sent":
        return "status-badge status-sent";
      case "draft":
        return "status-badge status-draft";
      case "overdue":
        return "status-badge status-overdue";
      case "cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge status-draft";
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 className="page-title">Dashboard</h2>
        <button
          className="btn btn-secondary"
          onClick={refreshData}
          style={{ fontSize: "0.9rem" }}
        >
          Refresh Data
        </button>
      </div>

      {APP_CONFIG.DEMO_MODE && (
        <div
          className="info"
          style={{
            marginBottom: "2rem",
            backgroundColor: "#e3f2fd",
            color: "#1976d2",
            padding: "1rem",
            borderRadius: "6px",
            borderLeft: "4px solid #2196f3",
          }}
        >
          🎮 <strong>Demo Mode:</strong> You're viewing sample data. The backend
          API is not connected. All changes are temporary and will reset on
          refresh.
        </div>
      )}

      {error && (
        <div className="error" style={{ marginBottom: "2rem" }}>
          {error}
          <button
            onClick={refreshData}
            style={{ marginLeft: "10px", padding: "5px 10px" }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <div className="stat-value">
            {CurrencyFormatter.format(stats.totalRevenue)}
          </div>
        </div>

        <div className="stat-card pending">
          <h3>Pending Invoices</h3>
          <div className="stat-value">{stats.pendingInvoices}</div>
          <small style={{ color: "#666", fontSize: "0.8rem" }}>
            {CurrencyFormatter.format(stats.pendingAmount)}
          </small>
        </div>

        <div className="stat-card customers">
          <h3>Total Customers</h3>
          <div className="stat-value">{stats.totalCustomers}</div>
        </div>

        <div className="stat-card overdue">
          <h3>Overdue Invoices</h3>
          <div className="stat-value">{stats.overdueInvoices}</div>
          <small style={{ color: "#666", fontSize: "0.8rem" }}>
            {CurrencyFormatter.format(stats.overdueAmount)}
          </small>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Invoices</h3>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.hash = "#/billing/invoices")}
            style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
          >
            View All
          </button>
        </div>
        <div className="card-content">
          {recentInvoices.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>No invoices found.</p>
              <button
                className="btn btn-primary"
                onClick={() =>
                  (window.location.hash = "#/billing/create-invoice")
                }
              >
                Create Your First Invoice
              </button>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <strong>{invoice.invoiceNumber}</strong>
                    </td>
                    <td>
                      <div>
                        <div>{invoice.customer.name}</div>
                        <small style={{ color: "#666" }}>
                          {invoice.customer.email}
                        </small>
                      </div>
                    </td>
                    <td>{DateFormatter.format(invoice.date)}</td>
                    <td>
                      <strong>{CurrencyFormatter.format(invoice.total)}</strong>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(invoice.status)}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: "0.8rem", padding: "0.5rem" }}
                        onClick={() => {
                          // In a real app, this would navigate to invoice detail
                          console.log("View invoice:", invoice.id);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="card-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() =>
                (window.location.hash = "#/billing/create-invoice")
              }
              style={{ padding: "1rem" }}
            >
              Create New Invoice
            </button>
            <button
              className="btn btn-primary"
              onClick={() => (window.location.hash = "#/billing/customers")}
              style={{ padding: "1rem" }}
            >
              Manage Customers
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => (window.location.hash = "#/billing/invoices")}
              style={{ padding: "1rem" }}
            >
              View All Invoices
            </button>
            <button
              className="btn btn-secondary"
              onClick={refreshData}
              style={{ padding: "1rem" }}
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
