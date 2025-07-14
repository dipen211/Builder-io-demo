import React, { useState, useEffect } from "react";
import ApiService from "../services/api";

const CreateInvoice = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState({
    customerId: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      // Mock data for demo - replace with: const customers = await ApiService.getCustomers();
      const mockCustomers = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Acme Corp" },
        { id: 4, name: "XYZ Company" },
      ];

      setCustomers(mockCustomers);
    } catch (err) {
      setError("Failed to load customers");
      console.error("Load customers error:", err);
    }
  };

  const handleAddItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    if (invoice.items.length > 1) {
      const newItems = invoice.items.filter((_, i) => i !== index);
      setInvoice({ ...invoice, items: newItems });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoice({ ...invoice, items: newItems });
  };

  const calculateItemTotal = (item) => {
    return item.quantity * item.unitPrice;
  };

  const calculateSubTotal = () => {
    return invoice.items.reduce(
      (sum, item) => sum + calculateItemTotal(item),
      0,
    );
  };

  const calculateTax = () => {
    return calculateSubTotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubTotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Mock creating invoice - replace with: await ApiService.createInvoice(invoice);
      console.log("Creating invoice:", invoice);

      // Reset form
      setInvoice({
        customerId: "",
        dueDate: "",
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
      });

      alert("Invoice created successfully!");
    } catch (err) {
      setError("Failed to create invoice");
      console.error("Create invoice error:", err);
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

  return (
    <div className="create-invoice">
      <h2 className="page-title">Create New Invoice</h2>

      {error && <div className="error">{error}</div>}

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
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
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
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          required
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
                        />
                      </td>
                      <td>
                        <strong>
                          {formatCurrency(calculateItemTotal(item))}
                        </strong>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleRemoveItem(index)}
                          disabled={invoice.items.length === 1}
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
                <strong>Subtotal: {formatCurrency(calculateSubTotal())}</strong>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Tax (10%): {formatCurrency(calculateTax())}</strong>
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "2px solid #dee2e6",
                }}
              >
                <strong>Total: {formatCurrency(calculateTotal())}</strong>
              </div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Invoice"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setInvoice({
                    customerId: "",
                    dueDate: "",
                    items: [{ description: "", quantity: 1, unitPrice: 0 }],
                  });
                }}
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
