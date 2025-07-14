import React, { useState, useEffect } from "react";
import {
  CurrencyFormatter,
  DateFormatter,
} from "../../Common/Utils/Formatters";
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

      // Try to load real data from API
      const dashboardData = await BillingApiService.getDashboardData();
      setStats(dashboardData.stats);
      setRecentInvoices(dashboardData.recentInvoices);
    } catch (err: any) {
      console.error("Dashboard API error:", err);
      setError("Unable to connect to server. Showing demo data.");

      // Fallback to mock data if API fails
      const mockStats: DashboardStats = {
        totalRevenue: 4490.5,
        pendingInvoices: 2,
        totalCustomers: 4,
        overdueInvoices: 1,
        pendingAmount: 3240.5,
        overdueAmount: 500.0,
      };

      const mockInvoices: Invoice[] = [
        {
          id: 1,
          invoiceNumber: "INV-20241201-1001",
          date: "2024-12-01",
          dueDate: "2024-12-31",
          customer: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "555-0101",
            address: "123 Main St",
            totalInvoices: 1,
            totalAmount: 1250.0,
          },
          subTotal: 1136.36,
          taxAmount: 113.64,
          total: 1250.0,
          status: "Paid",
          items: [],
        },
        {
          id: 2,
          invoiceNumber: "INV-20241202-1002",
          date: "2024-12-02",
          dueDate: "2025-01-01",
          customer: {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "555-0102",
            address: "456 Oak Ave",
            totalInvoices: 1,
            totalAmount: 890.0,
          },
          subTotal: 809.09,
          taxAmount: 80.91,
          total: 890.0,
          status: "Sent",
          items: [],
        },
        {
          id: 3,
          invoiceNumber: "INV-20241203-1003",
          date: "2024-12-03",
          dueDate: "2025-01-02",
          customer: {
            id: 3,
            name: "Acme Corp",
            email: "billing@acme.com",
            phone: "555-0103",
            address: "789 Business Blvd",
            totalInvoices: 1,
            totalAmount: 2350.0,
          },
          subTotal: 2136.36,
          taxAmount: 213.64,
          total: 2350.0,
          status: "Draft",
          items: [],
        },
      ];

      setStats(mockStats);
      setRecentInvoices(mockInvoices);
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

      {error && (
        <div className="warning" style={{ marginBottom: "2rem" }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: "10px", padding: "5px 10px" }}
          >
            Dismiss
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
