import React from "react";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "revenue" | "pending" | "customers" | "overdue";
  className?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  variant = "default",
  className = "",
  onClick,
}) => {
  const cardClass = `
    stat-card 
    stat-card-${variant} 
    ${onClick ? "stat-card-clickable" : ""} 
    ${className}
  `.trim();

  return (
    <div className={cardClass} onClick={onClick}>
      <h3 className="stat-card-title">{title}</h3>
      <div className="stat-card-value">{value}</div>
      {subtitle && <small className="stat-card-subtitle">{subtitle}</small>}
    </div>
  );
};

export default StatCard;
