import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes } from "../../Constants/Routes";
import { NavigationTabs } from "../../Constants/Enums";
import { APP_CONFIG } from "../../Constants/Constants";
import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<NavigationTabs>(
    getActiveTabFromPath(location.pathname),
  );

  function getActiveTabFromPath(pathname: string): NavigationTabs {
    if (pathname === Routes.DASHBOARD || pathname === Routes.HOME) {
      return NavigationTabs.DASHBOARD;
    }
    if (pathname.startsWith("/billing")) {
      if (pathname.includes("create-invoice")) {
        return NavigationTabs.CREATE_INVOICE;
      }
      if (pathname.includes("customers")) {
        return NavigationTabs.CUSTOMERS;
      }
      if (pathname.includes("invoices")) {
        return NavigationTabs.INVOICES;
      }
      return NavigationTabs.INVOICES;
    }
    if (pathname === Routes.PROFILE) {
      return NavigationTabs.PROFILE;
    }
    return NavigationTabs.DASHBOARD;
  }

  const handleTabClick = (tab: NavigationTabs) => {
    setActiveTab(tab);

    switch (tab) {
      case NavigationTabs.DASHBOARD:
        navigate(Routes.DASHBOARD);
        break;
      case NavigationTabs.INVOICES:
        navigate(Routes.INVOICES);
        break;
      case NavigationTabs.CUSTOMERS:
        navigate(Routes.CUSTOMERS);
        break;
      case NavigationTabs.CREATE_INVOICE:
        navigate(Routes.CREATE_INVOICE);
        break;
      case NavigationTabs.PROFILE:
        navigate(Routes.PROFILE);
        break;
      default:
        navigate(Routes.DASHBOARD);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{APP_CONFIG.NAME}</h1>
        <nav className="header-navigation">
          <button
            className={`nav-tab ${activeTab === NavigationTabs.DASHBOARD ? "active" : ""}`}
            onClick={() => handleTabClick(NavigationTabs.DASHBOARD)}
          >
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === NavigationTabs.INVOICES ? "active" : ""}`}
            onClick={() => handleTabClick(NavigationTabs.INVOICES)}
          >
            Invoices
          </button>
          <button
            className={`nav-tab ${activeTab === NavigationTabs.CUSTOMERS ? "active" : ""}`}
            onClick={() => handleTabClick(NavigationTabs.CUSTOMERS)}
          >
            Customers
          </button>
          <button
            className={`nav-tab ${activeTab === NavigationTabs.CREATE_INVOICE ? "active" : ""}`}
            onClick={() => handleTabClick(NavigationTabs.CREATE_INVOICE)}
          >
            Create Invoice
          </button>
          <button
            className={`nav-tab ${activeTab === NavigationTabs.PROFILE ? "active" : ""}`}
            onClick={() => handleTabClick(NavigationTabs.PROFILE)}
          >
            Profile
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
