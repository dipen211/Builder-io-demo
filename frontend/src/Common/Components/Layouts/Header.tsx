import React from "react";
import { APP_CONFIG } from "../../Constants/Constants";
import { Navigation } from "../Navigation";
import ConnectionStatus from "../ConnectionStatus";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-top">
          <h1 className="header-title">{APP_CONFIG.NAME}</h1>
          <ConnectionStatus />
        </div>
        <Navigation className="header-navigation" />
      </div>
    </header>
  );
};

export default Header;
