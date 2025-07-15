import React from "react";
import "./PageHeader.css";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  children,
  className = "",
}) => {
  return (
    <div className={`page-header ${className}`.trim()}>
      <div className="page-header-content">
        <div className="page-header-text">
          <h2 className="page-title">{title}</h2>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
      {children && <div className="page-header-extra">{children}</div>}
    </div>
  );
};

export default PageHeader;
