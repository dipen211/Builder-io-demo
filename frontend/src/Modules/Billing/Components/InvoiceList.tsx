import React, { useState, useEffect } from "react";
import { CurrencyFormatter, DateFormatter } from "@/Common/Utils/Formatters";
import { InvoiceStatus } from "@/Common/Constants/Enums";
import { Invoice } from "../Model/Billing.interfaces";

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demo
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
          },
          subTotal: 1136.36,
          taxAmount: 113.64,
          total: 1250.0,
          status: InvoiceStatus.PAID,
          items: [
            {
              id: 1,
              description: "Web Development Services",
              quantity: 40,
              unitPrice: 25.0,
              total: 1000.0,
            },
            {
              id: 2,
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
          customer: {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "555-0102",
            address: "456 Oak Ave",
          },
          subTotal: 809.09,
          taxAmount: 80.91,
          total: 890.0,
          status: InvoiceStatus.SENT,
          items: [
            {
              id: 3,
              description: "Logo Design",
              quantity: 1,
              unitPrice: 500.0,
              total: 500.0,
            },
            {
              id: 4,
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
          customer: {
            id: 3,
            name: "Acme Corp",
            email: "billing@acme.com",
            phone: "555-0103",
            address: "789 Business Blvd",
          },
          subTotal: 2136.36,
          taxAmount: 213.64,
          total: 2350.0,
          status: InvoiceStatus.DRAFT,
          items: [
            {
              id: 5,
              description: "Software Development",
              quantity: 80,
              unitPrice: 25.0,
              total: 2000.0,
            },
            {
              id: 6,
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
          customer: {
            id: 4,
            name: "XYZ Company",
            email: "finance@xyz.com",
            phone: "555-0104",
            address: "321 Corporate Dr",
          },
          subTotal: 454.55,
          taxAmount: 45.45,
          total: 500.0,
          status: InvoiceStatus.OVERDUE,
          items: [
            {
              id: 7,
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
                    <td>{DateFormatter.format(invoice.date)}</td>
                    <td>{DateFormatter.format(invoice.dueDate)}</td>
                    <td>
                      <strong>{CurrencyFormatter.format(invoice.total)}</strong>
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
