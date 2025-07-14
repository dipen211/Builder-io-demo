import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import InvoiceList from "./Components/InvoiceList";
import CustomerList from "./Components/CustomerList";
import CreateInvoice from "./Components/CreateInvoice";

const BillingModule: React.FC = () => {
  const location = useLocation();

  const getActiveComponent = () => {
    const path = location.pathname;

    if (path.includes("customers")) {
      return <CustomerList />;
    }
    if (path.includes("create-invoice")) {
      return <CreateInvoice />;
    }
    // Default to invoices
    return <InvoiceList />;
  };

  return <div className="billing-module">{getActiveComponent()}</div>;
};

export default BillingModule;
