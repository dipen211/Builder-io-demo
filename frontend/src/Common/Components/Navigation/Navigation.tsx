import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes } from "../../Constants/Routes";
import { NavigationTabs } from "../../Constants/Enums";
import NavTab from "./NavTab";
import "./Navigation.css";

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTabFromPath = (pathname: string): NavigationTabs => {
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
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const handleTabClick = (tab: NavigationTabs) => {
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

  const navigationItems = [
    { tab: NavigationTabs.DASHBOARD, label: "Dashboard" },
    { tab: NavigationTabs.INVOICES, label: "Invoices" },
    { tab: NavigationTabs.CUSTOMERS, label: "Customers" },
    { tab: NavigationTabs.CREATE_INVOICE, label: "Create Invoice" },
    { tab: NavigationTabs.PROFILE, label: "Profile" },
  ];

  return (
    <nav className={`navigation ${className}`.trim()}>
      {navigationItems.map(({ tab, label }) => (
        <NavTab
          key={tab}
          active={activeTab === tab}
          onClick={() => handleTabClick(tab)}
        >
          {label}
        </NavTab>
      ))}
    </nav>
  );
};

export default Navigation;
