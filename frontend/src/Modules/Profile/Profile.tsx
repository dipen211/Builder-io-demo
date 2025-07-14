import React, { useState } from "react";
import { APP_CONFIG } from "@/Common/Constants/Constants";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  taxId: string;
  currency: string;
  timezone: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Administrator",
    email: "admin@billing.com",
    phone: "555-0199",
    company: "Billing Solutions Inc.",
    address: "123 Business Center, Suite 100",
    taxId: "TX-123456789",
    currency: "USD",
    timezone: "America/New_York",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock save operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset to original values in a real app
  };

  return (
    <div className="profile">
      <h2 className="page-title">Profile Settings</h2>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Personal Information</h3>
          <button
            className="btn btn-primary"
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
          >
            {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="card-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-input"
                value={profile.company}
                onChange={(e) =>
                  setProfile({ ...profile, company: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Address</label>
              <textarea
                className="form-textarea"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                disabled={!editing}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tax ID</label>
              <input
                type="text"
                className="form-input"
                value={profile.taxId}
                onChange={(e) =>
                  setProfile({ ...profile, taxId: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                value={profile.currency}
                onChange={(e) =>
                  setProfile({ ...profile, currency: e.target.value })
                }
                disabled={!editing}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select
                className="form-select"
                value={profile.timezone}
                onChange={(e) =>
                  setProfile({ ...profile, timezone: e.target.value })
                }
                disabled={!editing}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          {editing && (
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        <div className="card-header">
          <h3 className="card-title">Application Information</h3>
        </div>
        <div className="card-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <strong>Application Name:</strong>
              <p>{APP_CONFIG.NAME}</p>
            </div>
            <div>
              <strong>Version:</strong>
              <p>{APP_CONFIG.VERSION}</p>
            </div>
            <div>
              <strong>Last Login:</strong>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <strong>Account Type:</strong>
              <p>Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
