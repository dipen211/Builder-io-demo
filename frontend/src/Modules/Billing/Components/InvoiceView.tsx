import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CurrencyFormatter,
  DateFormatter,
} from "../../../Common/Utils/Formatters";
import BillingApiService, {
  Invoice,
} from "../../../Common/Services/BillingApiService";
import { Routes } from "../../../Common/Constants/Routes";

const InvoiceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const invoiceData = await BillingApiService.getInvoice(parseInt(id));
        setInvoice(invoiceData);
      } catch (err: any) {
        setError(err.message || "Failed to load invoice");
        console.error("Invoice load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!invoice) return;

    try {
      await BillingApiService.updateInvoiceStatus(invoice.id, newStatus);
      setInvoice({ ...invoice, status: newStatus });
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
      <div className="invoice-view">
        <div className="loading">Loading invoice...</div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="invoice-view">
        <div className="page-header">
          <h2 className="page-title">Invoice Not Found</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(Routes.INVOICES)}
          >
            Back to Invoices
          </button>
        </div>
        <div className="error">{error || "Invoice not found"}</div>
      </div>
    );
  }

  return (
    <div className="invoice-view">
      <div className="page-header">
        <h2 className="page-title">Invoice {invoice.invoiceNumber}</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`${Routes.INVOICES}/edit/${invoice.id}`)}
          >
            Edit Invoice
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(Routes.INVOICES)}
          >
            Back to Invoices
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Invoice Details</h3>
          <span className={getStatusBadgeClass(invoice.status)}>
            {invoice.status}
          </span>
        </div>
        <div className="card-content">
          <div className="invoice-details">
            <div className="detail-section">
              <h4>Invoice Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Invoice Number:</strong>
                  <span>{invoice.invoiceNumber}</span>
                </div>
                <div className="detail-item">
                  <strong>Date:</strong>
                  <span>{DateFormatter.format(invoice.date)}</span>
                </div>
                <div className="detail-item">
                  <strong>Due Date:</strong>
                  <span>{DateFormatter.format(invoice.dueDate)}</span>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong>
                  <span className={getStatusBadgeClass(invoice.status)}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Customer Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Name:</strong>
                  <span>{invoice.customer.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Email:</strong>
                  <span>{invoice.customer.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Phone:</strong>
                  <span>{invoice.customer.phone}</span>
                </div>
                <div className="detail-item">
                  <strong>Address:</strong>
                  <span>{invoice.customer.address}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Invoice Items</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{CurrencyFormatter.format(item.unitPrice)}</td>
                      <td>{CurrencyFormatter.format(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="detail-section">
              <h4>Payment Summary</h4>
              <div className="payment-summary">
                <div className="summary-item">
                  <strong>Subtotal:</strong>
                  <span>{CurrencyFormatter.format(invoice.subTotal)}</span>
                </div>
                <div className="summary-item">
                  <strong>Tax:</strong>
                  <span>{CurrencyFormatter.format(invoice.taxAmount)}</span>
                </div>
                <div className="summary-item total">
                  <strong>Total:</strong>
                  <strong>{CurrencyFormatter.format(invoice.total)}</strong>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Actions</h4>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {invoice.status.toLowerCase() === "draft" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStatusUpdate("Sent")}
                  >
                    Send Invoice
                  </button>
                )}
                {invoice.status.toLowerCase() === "sent" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStatusUpdate("Paid")}
                  >
                    Mark as Paid
                  </button>
                )}
                {(invoice.status.toLowerCase() === "draft" ||
                  invoice.status.toLowerCase() === "sent") && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleStatusUpdate("Cancelled")}
                  >
                    Cancel Invoice
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate(`${Routes.INVOICES}/edit/${invoice.id}`)
                  }
                >
                  Edit Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
