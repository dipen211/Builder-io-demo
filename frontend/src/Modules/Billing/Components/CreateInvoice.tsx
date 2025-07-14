import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CurrencyFormatter } from "../../../Common/Utils/Formatters";
import { CURRENCY_CONFIG } from "../../../Common/Constants/Constants";
import { Routes } from "../../../Common/Constants/Routes";
import BillingApiService, {
  Customer,
  CreateInvoiceRequest,
  CreateInvoiceItemRequest,
} from "../../../Common/Services/BillingApiService";

interface InvoiceFormData {
  customerId: string;
  dueDate: string;
  items: CreateInvoiceItemRequest[];
  notes: string;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [invoice, setInvoice] = useState<InvoiceFormData>({
    customerId: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    notes: "",
  });

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all customers (no pagination for dropdown)
      const result = await BillingApiService.getCustomers(undefined, 1, 100);
      setCustomers(result.items);
    } catch (err: any) {
      setError("Failed to load customers: " + (err.message || "Unknown error"));
      console.error("Load customers error:", err);

      // Fallback to mock data if API fails
      setCustomers([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "555-0101",
          address: "123 Main St",
          totalInvoices: 0,
          totalAmount: 0,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "555-0102",
          address: "456 Oak Ave",
          totalInvoices: 0,
          totalAmount: 0,
        },
        {
          id: 3,
          name: "Acme Corp",
          email: "billing@acme.com",
          phone: "555-0103",
          address: "789 Business Blvd",
          totalInvoices: 0,
          totalAmount: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Initialize form with URL parameters and default values
  useEffect(() => {
    const customerId = searchParams.get("customerId");
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);

    setInvoice((prev) => ({
      ...prev,
      customerId: customerId || prev.customerId,
      dueDate: prev.dueDate || defaultDueDate.toISOString().split("T")[0],
    }));
  }, [searchParams]);

  const handleAddItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (invoice.items.length > 1) {
      const newItems = invoice.items.filter((_, i) => i !== index);
      setInvoice({ ...invoice, items: newItems });
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof CreateInvoiceItemRequest,
    value: string | number,
  ) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoice({ ...invoice, items: newItems });
  };

  const calculateItemTotal = (item: CreateInvoiceItemRequest): number => {
    return item.quantity * item.unitPrice;
  };

  const calculateSubTotal = (): number => {
    return invoice.items.reduce(
      (sum, item) => sum + calculateItemTotal(item),
      0,
    );
  };

  const calculateTax = (): number => {
    return calculateSubTotal() * CURRENCY_CONFIG.TAX_RATE;
  };

  const calculateTotal = (): number => {
    return calculateSubTotal() + calculateTax();
  };

  const validateForm = (): string | null => {
    if (!invoice.customerId) {
      return "Please select a customer";
    }

    if (!invoice.dueDate) {
      return "Please select a due date";
    }

    if (new Date(invoice.dueDate) < new Date()) {
      return "Due date must be today or in the future";
    }

    if (invoice.items.length === 0) {
      return "Please add at least one item";
    }

    for (let i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      if (!item.description.trim()) {
        return `Item ${i + 1}: Description is required`;
      }
      if (item.quantity <= 0) {
        return `Item ${i + 1}: Quantity must be greater than 0`;
      }
      if (item.unitPrice <= 0) {
        return `Item ${i + 1}: Unit price must be greater than 0`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const invoiceData: CreateInvoiceRequest = {
        customerId: parseInt(invoice.customerId),
        dueDate: invoice.dueDate,
        items: invoice.items,
        notes: invoice.notes.trim() || undefined,
      };

      const createdInvoice = await BillingApiService.createInvoice(invoiceData);

      // Reset form on success
      setInvoice({
        customerId: "",
        dueDate: "",
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
        notes: "",
      });

      setSuccess(
        `Invoice ${createdInvoice.invoiceNumber} created successfully!`,
      );

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to create invoice");
      console.error("Create invoice error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setInvoice({
      customerId: "",
      dueDate: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="create-invoice">
      <h2 className="page-title">Create New Invoice</h2>

      {error && (
        <div className="error">
          {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: "10px", padding: "5px 10px" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {success && (
        <div className="success">
          {success}
          <button
            onClick={() => setSuccess(null)}
            style={{ marginLeft: "10px", padding: "5px 10px" }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select
                className="form-select"
                value={invoice.customerId}
                onChange={(e) =>
                  setInvoice({ ...invoice, customerId: e.target.value })
                }
                required
                disabled={submitting || loading}
              >
                <option value="">
                  {loading ? "Loading customers..." : "Select a customer"}
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
              {customers.length === 0 && !loading && (
                <small style={{ color: "#666" }}>
                  No customers available. Please add a customer first.
                </small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input
                type="date"
                className="form-input"
                value={invoice.dueDate}
                onChange={(e) =>
                  setInvoice({ ...invoice, dueDate: e.target.value })
                }
                required
                disabled={submitting}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Optional notes for this invoice..."
                value={invoice.notes}
                onChange={(e) =>
                  setInvoice({ ...invoice, notes: e.target.value })
                }
                disabled={submitting}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Invoice Items</label>

              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          required
                          disabled={submitting}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          min="1"
                          max="10000"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          required
                          disabled={submitting}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "unitPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          required
                          disabled={submitting}
                        />
                      </td>
                      <td>
                        <strong>
                          {CurrencyFormatter.format(calculateItemTotal(item))}
                        </strong>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleRemoveItem(index)}
                          disabled={invoice.items.length === 1 || submitting}
                          style={{ fontSize: "0.8rem", padding: "0.5rem" }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddItem}
                style={{ marginTop: "1rem" }}
                disabled={submitting}
              >
                Add Item
              </button>
            </div>

            <div
              className="invoice-totals"
              style={{
                marginTop: "2rem",
                padding: "1rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                textAlign: "right",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>
                  Subtotal: {CurrencyFormatter.format(calculateSubTotal())}
                </strong>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>
                  Tax ({(CURRENCY_CONFIG.TAX_RATE * 100).toFixed(0)}%):{" "}
                  {CurrencyFormatter.format(calculateTax())}
                </strong>
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "2px solid #dee2e6",
                }}
              >
                <strong>
                  Total: {CurrencyFormatter.format(calculateTotal())}
                </strong>
              </div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || customers.length === 0}
              >
                {submitting ? "Creating Invoice..." : "Create Invoice"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={submitting}
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
