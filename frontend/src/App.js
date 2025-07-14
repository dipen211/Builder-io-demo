import React, { useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import InvoiceList from "./components/InvoiceList";
import CustomerList from "./components/CustomerList";
import CreateInvoice from "./components/CreateInvoice";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "invoices":
        return <InvoiceList />;
      case "customers":
        return <CustomerList />;
      case "create-invoice":
        return <CreateInvoice />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Billing Management System</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === "invoices" ? "active" : ""}`}
            onClick={() => setActiveTab("invoices")}
          >
            Invoices
          </button>
          <button
            className={`nav-tab ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            Customers
          </button>
          <button
            className={`nav-tab ${activeTab === "create-invoice" ? "active" : ""}`}
            onClick={() => setActiveTab("create-invoice")}
          >
            Create Invoice
          </button>
        </nav>
      </header>
      <main className="app-content">{renderContent()}</main>
    </div>
  );
}

export default App;
