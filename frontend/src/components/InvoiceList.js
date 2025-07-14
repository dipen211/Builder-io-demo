import React, { useState, useEffect } from "react";
import ApiService from "../services/api";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demo - replace with: const invoices = await ApiService.getInvoices();
      const mockInvoices = [
        {
          id: 1,
          invoiceNumber: "INV-20241201-1001",
          date: "2024-12-01",
          dueDate: "2024-12-31",
          customer: { name: "John Doe", email: "john@example.com" },
          subTotal: 1136.36,
          taxAmount: 113.64,
          total: 1250.0,
          status: "Paid",
          items: [
            {
              description: "Web Development Services",
              quantity: 40,
              unitPrice: 25.0,
              total: 1000.0,
            },
            {
              description: "Domain Registration",
              quantity: 1,
              unitPrice: 136.36,
              total: 136.36,
            },
          ],
        },
        {
          id: 2,
          invoiceNumber: "INV-20241202-1002",
          date: "2024-12-02",
          dueDate: "2025-01-01",
          customer: { name: "Jane Smith", email: "jane@example.com" },
          subTotal: 809.09,
          taxAmount: 80.91,
          total: 890.0,
          status: "Sent",
          items: [
            {
              description: "Logo Design",
              quantity: 1,
              unitPrice: 500.0,
              total: 500.0,
            },
            {
              description: "Business Cards",
              quantity: 1,
              unitPrice: 309.09,
              total: 309.09,
            },
          ],
        },
        {
          id: 3,
          invoiceNumber: "INV-20241203-1003",
          date: "2024-12-03",
          dueDate: "2025-01-02",
          customer: { name: "Acme Corp", email: "billing@acme.com" },
          subTotal: 2136.36,
          taxAmount: 213.64,
          total: 2350.0,
          status: "Draft",
          items: [
            {
              description: "Software Development",
              quantity: 80,
              unitPrice: 25.0,
              total: 2000.0,
            },
            {
              description: "Testing Services",
              quantity: 1,
              unitPrice: 136.36,
              total: 136.36,
            },
          ],
        },
        {
          id: 4,
          invoiceNumber: "INV-20241130-1000",
          date: "2024-11-30",
          dueDate: "2024-12-30",
          customer: { name: "XYZ Company", email: "finance@xyz.com" },
          subTotal: 454.55,
          taxAmount: 45.45,
          total: 500.0,
          status: "Overdue",
          items: [
            {
              description: "Consultation Services",
              quantity: 5,
              unitPrice: 90.91,
              total: 454.55,
            },
          ],
        },
      ];

      setInvoices(mockInvoices);
    } catch (err) {
      setError("Failed to load invoices");
      console.error("Invoices error:", err);
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
    return <div className="loading">Loading invoices...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="invoice-list">
      <div className="page-header">
        <h2 className="page-title">Invoices</h2>
        <button className="btn btn-primary">Create New Invoice</button>
      </div>

      <div className="card">
        <div className="card-content">
          {invoices.length === 0 ? (
            <p>No invoices found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
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
                    <td>{formatDate(invoice.date)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td>
                      <strong>{formatCurrency(invoice.total)}</strong>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${invoice.status.toLowerCase()}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{
                          marginRight: "0.5rem",
                          fontSize: "0.8rem",
                          padding: "0.5rem",
                        }}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: "0.8rem", padding: "0.5rem" }}
                      >
                        Edit
                      </button>
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

export default InvoiceList;
