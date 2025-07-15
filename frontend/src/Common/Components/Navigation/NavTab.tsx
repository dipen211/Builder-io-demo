import React from "react";
import "./NavTab.css";

interface NavTabProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const NavTab: React.FC<NavTabProps> = ({
  children,
  active = false,
  onClick,
  className = "",
  disabled = false,
}) => {
  const tabClass = `
    nav-tab 
    ${active ? "nav-tab-active" : ""} 
    ${disabled ? "nav-tab-disabled" : ""} 
    ${className}
  `.trim();

  return (
    <button
      className={tabClass}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

export default NavTab;
