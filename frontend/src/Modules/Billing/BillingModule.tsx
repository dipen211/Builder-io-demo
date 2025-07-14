import React from "react";
import { useLocation } from "react-router-dom";
import InvoiceList from "./Components/InvoiceList";
import CustomerList from "./Components/CustomerList";
import CreateInvoice from "./Components/CreateInvoice";
import InvoiceView from "./Components/InvoiceView";
import InvoiceEdit from "./Components/InvoiceEdit";
import CustomerView from "./Components/CustomerView";
import CustomerEdit from "./Components/CustomerEdit";

const BillingModule: React.FC = () => {
  const location = useLocation();

  const getActiveComponent = () => {
    const path = location.pathname;

    // Invoice routes
    if (path.includes("/invoices/view/")) {
      return <InvoiceView />;
    }
    if (path.includes("/invoices/edit/")) {
      return <InvoiceEdit />;
    }
    if (path.includes("/invoices")) {
      return <InvoiceList />;
    }

    // Customer routes
    if (path.includes("/customers/view/")) {
      return <CustomerView />;
    }
    if (path.includes("/customers/edit/")) {
      return <CustomerEdit />;
    }
    if (path.includes("/customers")) {
      return <CustomerList />;
    }

    // Create invoice
    if (path.includes("create-invoice")) {
      return <CreateInvoice />;
    }

    // Default to invoices
    return <InvoiceList />;
  };

  return <div className="billing-module">{getActiveComponent()}</div>;
};

export default BillingModule;
