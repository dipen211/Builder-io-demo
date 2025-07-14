import React, { useState, useEffect } from "react";
import { CurrencyFormatter } from "../../../Common/Utils/Formatters";
import { Customer, CreateCustomerRequest } from "../Model/Billing.interfaces";
import { InvoiceStatus } from "../../../Common/Constants/Enums";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState<CreateCustomerRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demo
      const mockCustomers: Customer[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "555-0101",
          address: "123 Main St, City, State 12345",
          invoices: [
            { id: 1, total: 1250.0, status: InvoiceStatus.PAID } as any,
          ],
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "555-0102",
          address: "456 Oak Ave, City, State 12345",
          invoices: [
            { id: 2, total: 890.0, status: InvoiceStatus.SENT } as any,
          ],
        },
        {
          id: 3,
          name: "Acme Corp",
          email: "billing@acme.com",
          phone: "555-0103",
          address: "789 Business Blvd, City, State 12345",
          invoices: [
            { id: 3, total: 2350.0, status: InvoiceStatus.DRAFT } as any,
          ],
        },
        {
          id: 4,
          name: "XYZ Company",
          email: "finance@xyz.com",
          phone: "555-0104",
          address: "321 Corporate Dr, City, State 12345",
          invoices: [
            { id: 4, total: 500.0, status: InvoiceStatus.OVERDUE } as any,
          ],
        },
      ];

      setCustomers(mockCustomers);
    } catch (err) {
      setError("Failed to load customers");
      console.error("Customers error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock adding customer
      const mockNewCustomer: Customer = {
        id: customers.length + 1,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone || "",
        address: newCustomer.address || "",
        invoices: [],
      };

      setCustomers([...customers, mockNewCustomer]);
      setNewCustomer({ name: "", email: "", phone: "", address: "" });
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add customer");
      console.error("Add customer error:", err);
    }
  };

  const calculateCustomerTotal = (invoices?: any[]): number => {
    if (!invoices) return 0;
    return invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="customer-list">
      <div className="page-header">
        <h2 className="page-title">Customers</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "Add Customer"}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div className="card-header">
            <h3 className="card-title">Add New Customer</h3>
          </div>
          <div className="card-content">
            <form onSubmit={handleAddCustomer}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Add Customer
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-content">
          {customers.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Total Invoiced</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>
                      <div>
                        <div>{customer.email}</div>
                        <small style={{ color: "#666" }}>
                          {customer.phone}
                        </small>
                      </div>
                    </td>
                    <td>
                      <small style={{ color: "#666" }}>
                        {customer.address}
                      </small>
                    </td>
                    <td>
                      <strong>
                        {CurrencyFormatter.format(
                          calculateCustomerTotal(customer.invoices),
                        )}
                      </strong>
                      <br />
                      <small style={{ color: "#666" }}>
                        {customer.invoices?.length || 0} invoice
                        {(customer.invoices?.length || 0) !== 1 ? "s" : ""}
                      </small>
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

export default CustomerList;
