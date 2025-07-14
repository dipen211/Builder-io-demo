import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/Common/Components/Layouts/Layout";
import Dashboard from "@/Modules/Dashboard/Dashboard";
import BillingModule from "@/Modules/Billing/BillingModule";
import Profile from "@/Modules/Profile/Profile";
import { Routes as AppRoutes } from "@/Common/Constants/Routes";
import "@/Assets/Styles/Styles.css";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
          <Route path={AppRoutes.BILLING} element={<BillingModule />} />
          <Route path={AppRoutes.PROFILE} element={<Profile />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
