import React, { useState, useEffect } from "react";
import {
  CurrencyFormatter,
  DateFormatter,
} from "../../../Common/Utils/Formatters";
import { InvoiceStatus } from "../../../Common/Constants/Enums";
import BillingApiService, {
  Invoice,
} from "../../../Common/Services/BillingApiService";

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadInvoices();
  }, [pageNumber]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await BillingApiService.getInvoices({
        pageNumber,
        pageSize,
      });

      setInvoices(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err: any) {
      setError(err.message || "Failed to load invoices");
      console.error("Invoices error:", err);

      // Fallback to mock data if API fails
      setInvoices([
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
          items: [
            {
              id: 1,
              description: "Web Development Services",
              quantity: 40,
              unitPrice: 25.0,
              total: 1000.0,
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
            totalInvoices: 1,
            totalAmount: 890.0,
          },
          subTotal: 809.09,
          taxAmount: 80.91,
          total: 890.0,
          status: "Sent",
          items: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (invoiceId: number, newStatus: string) => {
    try {
      await BillingApiService.updateInvoiceStatus(invoiceId, newStatus);
      // Reload invoices to get updated data
      loadInvoices();
    } catch (err: any) {
      setError(err.message || "Failed to update invoice status");
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

  if (loading) {
    return (
      <div className="invoice-list">
        <div className="loading">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="invoice-list">
      <div className="page-header">
        <h2 className="page-title">Invoices</h2>
        <button className="btn btn-primary">Create New Invoice</button>
      </div>

      {error && (
        <div className="error">
          {error}
          <button
            onClick={loadInvoices}
            style={{ marginLeft: "10px", padding: "5px 10px" }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-content">
          {invoices.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>No invoices found.</p>
              <button className="btn btn-primary" onClick={loadInvoices}>
                Refresh
              </button>
            </div>
          ) : (
            <>
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
                        <strong>
                          {CurrencyFormatter.format(invoice.total)}
                        </strong>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(invoice.status)}>
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
                          onClick={() => {
                            // In a real app, this would navigate to invoice detail
                            console.log("View invoice:", invoice.id);
                          }}
                        >
                          View
                        </button>
                        {invoice.status.toLowerCase() === "draft" && (
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: "0.8rem", padding: "0.5rem" }}
                            onClick={() =>
                              handleStatusUpdate(invoice.id, "Sent")
                            }
                          >
                            Send
                          </button>
                        )}
                        {invoice.status.toLowerCase() === "sent" && (
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: "0.8rem", padding: "0.5rem" }}
                            onClick={() =>
                              handleStatusUpdate(invoice.id, "Paid")
                            }
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                    padding: "1rem 0",
                  }}
                >
                  <div>
                    Showing {invoices.length} of {totalCount} invoices
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setPageNumber((prev) => Math.max(1, prev - 1))
                      }
                      disabled={pageNumber === 1}
                    >
                      Previous
                    </button>
                    <span style={{ padding: "0.5rem 1rem" }}>
                      Page {pageNumber} of {totalPages}
                    </span>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setPageNumber((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={pageNumber === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
