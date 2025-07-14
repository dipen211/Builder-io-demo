import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CurrencyFormatter,
  DateFormatter,
} from "../../../Common/Utils/Formatters";
import BillingApiService, {
  Customer,
  Invoice,
} from "../../../Common/Services/BillingApiService";
import { Routes } from "../../../Common/Constants/Routes";

const CustomerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerInvoices, setCustomerInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomerData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const [customerData, invoicesData] = await Promise.all([
          BillingApiService.getCustomer(parseInt(id)),
          BillingApiService.getCustomerInvoices(parseInt(id)),
        ]);

        setCustomer(customerData);
        setCustomerInvoices(invoicesData);
      } catch (err: any) {
        setError(err.message || "Failed to load customer");
        console.error("Customer load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [id]);

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
      <div className="customer-view">
        <div className="loading">Loading customer...</div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="customer-view">
        <div className="page-header">
          <h2 className="page-title">Customer Not Found</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(Routes.CUSTOMERS)}
          >
            Back to Customers
          </button>
        </div>
        <div className="error">{error || "Customer not found"}</div>
      </div>
    );
  }

  return (
    <div className="customer-view">
      <div className="page-header">
        <h2 className="page-title">{customer.name}</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`${Routes.CREATE_INVOICE}?customerId=${customer.id}`)
            }
          >
            Create Invoice
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`${Routes.CUSTOMERS}/edit/${customer.id}`)}
          >
            Edit Customer
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(Routes.CUSTOMERS)}
          >
            Back to Customers
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Customer Details</h3>
        </div>
        <div className="card-content">
          <div className="customer-details">
            <div className="detail-section">
              <h4>Contact Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Name:</strong>
                  <span>{customer.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Email:</strong>
                  <span>{customer.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Phone:</strong>
                  <span>{customer.phone}</span>
                </div>
                <div className="detail-item">
                  <strong>Address:</strong>
                  <span>{customer.address}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Summary</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Total Invoices:</strong>
                  <span>{customer.totalInvoices}</span>
                </div>
                <div className="detail-item">
                  <strong>Total Amount:</strong>
                  <span>{CurrencyFormatter.format(customer.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Customer Invoices</h3>
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`${Routes.CREATE_INVOICE}?customerId=${customer.id}`)
            }
          >
            Create New Invoice
          </button>
        </div>
        <div className="card-content">
          {customerInvoices.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>No invoices found for this customer.</p>
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`${Routes.CREATE_INVOICE}?customerId=${customer.id}`)
                }
              >
                Create First Invoice
              </button>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customerInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <strong>{invoice.invoiceNumber}</strong>
                    </td>
                    <td>{DateFormatter.format(invoice.date)}</td>
                    <td>{DateFormatter.format(invoice.dueDate)}</td>
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
                        style={{
                          marginRight: "0.5rem",
                          fontSize: "0.8rem",
                          padding: "0.5rem",
                        }}
                        onClick={() =>
                          navigate(`${Routes.INVOICES}/view/${invoice.id}`)
                        }
                      >
                        View
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.5rem",
                        }}
                        onClick={() =>
                          navigate(`${Routes.INVOICES}/edit/${invoice.id}`)
                        }
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

export default CustomerView;
