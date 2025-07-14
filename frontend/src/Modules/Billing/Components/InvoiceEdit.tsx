import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BillingApiService, {
  Customer,
  CreateInvoiceRequest,
  InvoiceItem,
} from "../../../Common/Services/BillingApiService";
import { Routes } from "../../../Common/Constants/Routes";

const InvoiceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    customerId: 0,
    date: "",
    dueDate: "",
    items: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load customers for dropdown
        const customersResult = await BillingApiService.getCustomers();
        setCustomers(customersResult.items);

        // If editing, load the invoice
        if (id) {
          const invoice = await BillingApiService.getInvoice(parseInt(id));
          setFormData({
            customerId: invoice.customer.id,
            date: invoice.date,
            dueDate: invoice.dueDate,
            items: invoice.items.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data");
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerId || !formData.date || !formData.dueDate) {
      setError("Please fill in all required fields");
      return;
    }

    if (
      formData.items.some(
        (item) =>
          !item.description.trim() || item.quantity <= 0 || item.unitPrice < 0,
      )
    ) {
      setError(
        "Please ensure all items have valid descriptions, quantities, and prices",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (id) {
        // For editing, we'd need an update endpoint
        console.log("Update invoice:", id, formData);
        // For now, just navigate back
        navigate(`${Routes.INVOICES}/view/${id}`);
      } else {
        const newInvoice = await BillingApiService.createInvoice(formData);
        navigate(`${Routes.INVOICES}/view/${newInvoice.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save invoice");
      console.error("Save error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="invoice-edit">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="invoice-edit">
      <div className="page-header">
        <h2 className="page-title">{id ? "Edit Invoice" : "Create Invoice"}</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(Routes.INVOICES)}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Invoice Details</h3>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select
                className="form-input"
                value={formData.customerId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerId: parseInt(e.target.value),
                  })
                }
                required
                disabled={submitting}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Invoice Items</h3>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addItem}
              disabled={submitting}
            >
              Add Item
            </button>
          </div>
          <div className="card-content">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="invoice-item"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    placeholder="Item description"
                    required
                    disabled={submitting}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "1rem",
                    alignItems: "end",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      min="1"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Price *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitPrice",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      min="0"
                      step="0.01"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total</label>
                    <input
                      type="text"
                      className="form-input"
                      value={`$${(item.quantity * item.unitPrice).toFixed(2)}`}
                      readOnly
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                  </div>

                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => removeItem(index)}
                      disabled={submitting}
                      style={{ height: "fit-content" }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div
              className="invoice-totals"
              style={{ marginTop: "2rem", textAlign: "right" }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Subtotal: ${calculateSubtotal().toFixed(2)}</strong>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Tax (10%): ${calculateTax().toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Total: ${calculateTotal().toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(Routes.INVOICES)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : id
                ? "Update Invoice"
                : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceEdit;
