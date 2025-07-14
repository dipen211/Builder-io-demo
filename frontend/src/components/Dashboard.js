import React, { useState, useEffect } from "react";
import ApiService from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    totalCustomers: 0,
    overdueInvoices: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For demo purposes, we'll use mock data since the backend might not be running
      // In a real app, you'd use: const invoices = await ApiService.getInvoices();
      const mockInvoices = [
        {
          id: 1,
          invoiceNumber: "INV-20241201-1001",
          date: "2024-12-01",
          customer: { name: "John Doe" },
          total: 1250.0,
          status: "Paid",
        },
        {
          id: 2,
          invoiceNumber: "INV-20241202-1002",
          date: "2024-12-02",
          customer: { name: "Jane Smith" },
          total: 890.5,
          status: "Sent",
        },
        {
          id: 3,
          invoiceNumber: "INV-20241203-1003",
          date: "2024-12-03",
          customer: { name: "Acme Corp" },
          total: 2350.75,
          status: "Draft",
        },
      ];

      // Calculate stats from mock data
      const totalRevenue = mockInvoices
        .filter((inv) => inv.status === "Paid")
        .reduce((sum, inv) => sum + inv.total, 0);

      const pendingInvoices = mockInvoices.filter(
        (inv) => inv.status === "Sent",
      ).length;
      const overdueInvoices = mockInvoices.filter(
        (inv) => inv.status === "Overdue",
      ).length;

      setStats({
        totalRevenue,
        pendingInvoices,
        totalCustomers: 3, // Mock data
        overdueInvoices,
      });

      setRecentInvoices(mockInvoices.slice(0, 5));
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard</h2>

      <div className="dashboard-grid">
        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
        </div>

        <div className="stat-card pending">
          <h3>Pending Invoices</h3>
          <div className="stat-value">{stats.pendingInvoices}</div>
        </div>

        <div className="stat-card customers">
          <h3>Total Customers</h3>
          <div className="stat-value">{stats.totalCustomers}</div>
        </div>

        <div className="stat-card overdue">
          <h3>Overdue Invoices</h3>
          <div className="stat-value">{stats.overdueInvoices}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Invoices</h3>
        </div>
        <div className="card-content">
          {recentInvoices.length === 0 ? (
            <p>No invoices found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customer.name}</td>
                    <td>{formatDate(invoice.date)}</td>
                    <td>{formatCurrency(invoice.total)}</td>
                    <td>
                      <span
                        className={`status-badge status-${invoice.status.toLowerCase()}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
