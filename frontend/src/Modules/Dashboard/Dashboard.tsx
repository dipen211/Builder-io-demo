import React, { useState, useEffect } from "react";
import {
  CurrencyFormatter,
  DateFormatter,
} from "../../Common/Utils/Formatters";
import { InvoiceStatus } from "../../Common/Constants/Enums";
import { DashboardStats, Invoice } from "./Model/Dashboard.interfaces";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    pendingInvoices: 0,
    totalCustomers: 0,
    overdueInvoices: 0,
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

      // Mock data for demo
      const mockInvoices: Invoice[] = [
        {
          id: 1,
          invoiceNumber: "INV-20241201-1001",
          date: "2024-12-01",
          customer: { id: 1, name: "John Doe", email: "john@example.com" },
          total: 1250.0,
          status: InvoiceStatus.PAID,
        },
        {
          id: 2,
          invoiceNumber: "INV-20241202-1002",
          date: "2024-12-02",
          customer: { id: 2, name: "Jane Smith", email: "jane@example.com" },
          total: 890.5,
          status: InvoiceStatus.SENT,
        },
        {
          id: 3,
          invoiceNumber: "INV-20241203-1003",
          date: "2024-12-03",
          customer: { id: 3, name: "Acme Corp", email: "billing@acme.com" },
          total: 2350.75,
          status: InvoiceStatus.DRAFT,
        },
      ];

      // Calculate stats from mock data
      const totalRevenue = mockInvoices
        .filter((inv) => inv.status === InvoiceStatus.PAID)
        .reduce((sum, inv) => sum + inv.total, 0);

      const pendingInvoices = mockInvoices.filter(
        (inv) => inv.status === InvoiceStatus.SENT,
      ).length;
      const overdueInvoices = mockInvoices.filter(
        (inv) => inv.status === InvoiceStatus.OVERDUE,
      ).length;

      setStats({
        totalRevenue,
        pendingInvoices,
        totalCustomers: 3,
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
          <div className="stat-value">
            {CurrencyFormatter.format(stats.totalRevenue)}
          </div>
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
                    <td>{DateFormatter.format(invoice.date)}</td>
                    <td>{CurrencyFormatter.format(invoice.total)}</td>
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
