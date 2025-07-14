import React, { useState, useEffect, useCallback } from "react";
import { CurrencyFormatter } from "../../../Common/Utils/Formatters";
import BillingApiService, {
  Customer,
  CreateCustomerRequest,
} from "../../../Common/Services/BillingApiService";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [newCustomer, setNewCustomer] = useState<CreateCustomerRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await BillingApiService.getCustomers(
        searchTerm || undefined,
        pageNumber,
        pageSize,
      );

      setCustomers(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err: any) {
      setError(err.message || "Failed to load customers");
      console.error("Customers error:", err);

      // Fallback to mock data if API fails
      setCustomers([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "555-0101",
          address: "123 Main St, City, State 12345",
          totalInvoices: 1,
          totalAmount: 1250.0,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "555-0102",
          address: "456 Oak Ave, City, State 12345",
          totalInvoices: 1,
          totalAmount: 890.0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, searchTerm, pageSize]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCustomer.name.trim() || !newCustomer.email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await BillingApiService.createCustomer(newCustomer);

      // Reset form and reload customers
      setNewCustomer({ name: "", email: "", phone: "", address: "" });
      setShowAddForm(false);
      setPageNumber(1); // Go to first page to see new customer
      loadCustomers();
    } catch (err: any) {
      setError(err.message || "Failed to add customer");
      console.error("Add customer error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (
    customerId: number,
    customerName: string,
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to delete customer "${customerName}"?`,
      )
    ) {
      return;
    }

    try {
      await BillingApiService.deleteCustomer(customerId);
      loadCustomers(); // Reload the list
    } catch (err: any) {
      setError(err.message || "Failed to delete customer");
      console.error("Delete customer error:", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1); // Reset to first page when searching
    loadCustomers();
  };

  if (loading && customers.length === 0) {
    return (
      <div className="customer-list">
        <div className="loading">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="customer-list">
      <div className="page-header">
        <h2 className="page-title">Customers</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={submitting}
        >
          {showAddForm ? "Cancel" : "Add Customer"}
        </button>
      </div>

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

      {/* Search Form */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-content">
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: "1rem", alignItems: "center" }}
          >
            <div className="form-group" style={{ margin: 0, flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setPageNumber(1);
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add Customer"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-content">
          {customers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>No customers found.</p>
              <button className="btn btn-primary" onClick={loadCustomers}>
                Refresh
              </button>
            </div>
          ) : (
            <>
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
                          {CurrencyFormatter.format(customer.totalAmount)}
                        </strong>
                        <br />
                        <small style={{ color: "#666" }}>
                          {customer.totalInvoices} invoice
                          {customer.totalInvoices !== 1 ? "s" : ""}
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
                          onClick={() => {
                            // In a real app, this would navigate to customer detail
                            console.log("View customer:", customer.id);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{
                            marginRight: "0.5rem",
                            fontSize: "0.8rem",
                            padding: "0.5rem",
                          }}
                          onClick={() => {
                            // In a real app, this would open edit form
                            console.log("Edit customer:", customer.id);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{
                            fontSize: "0.8rem",
                            padding: "0.5rem",
                            backgroundColor: "#dc3545",
                            color: "white",
                          }}
                          onClick={() =>
                            handleDeleteCustomer(customer.id, customer.name)
                          }
                        >
                          Delete
                        </button>
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
                    Showing {customers.length} of {totalCount} customers
                    {searchTerm && <span> (filtered by "{searchTerm}")</span>}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setPageNumber((prev) => Math.max(1, prev - 1))
                      }
                      disabled={pageNumber === 1 || loading}
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
                      disabled={pageNumber === totalPages || loading}
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

export default CustomerList;
