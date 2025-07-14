import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BillingApiService, {
  Customer,
  CreateCustomerRequest,
} from "../../../Common/Services/BillingApiService";
import { Routes } from "../../../Common/Constants/Routes";

const CustomerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const customer = await BillingApiService.getCustomer(parseInt(id));
        setFormData({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load customer");
        console.error("Load customer error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (id) {
        // For editing, we'd need an update endpoint
        await BillingApiService.updateCustomer(parseInt(id), formData);
        navigate(`${Routes.CUSTOMERS}/view/${id}`);
      } else {
        const newCustomer = await BillingApiService.createCustomer(formData);
        navigate(`${Routes.CUSTOMERS}/view/${newCustomer.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save customer");
      console.error("Save customer error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-edit">
        <div className="loading">Loading customer...</div>
      </div>
    );
  }

  return (
    <div className="customer-edit">
      <div className="page-header">
        <h2 className="page-title">
          {id ? "Edit Customer" : "Create Customer"}
        </h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(Routes.CUSTOMERS)}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Customer Information</h3>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={submitting}
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={submitting}
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={submitting}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className="form-textarea"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={submitting}
                placeholder="Enter address"
                rows={3}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(Routes.CUSTOMERS)}
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
                    ? "Update Customer"
                    : "Create Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerEdit;
