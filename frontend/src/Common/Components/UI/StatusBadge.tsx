import React from "react";
import "./StatusBadge.css";

interface StatusBadgeProps {
  status: "paid" | "sent" | "draft" | "overdue" | "cancelled" | string;
  className?: string;
  size?: "small" | "medium" | "large";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "medium",
}) => {
  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "paid":
        return "status-paid";
      case "sent":
        return "status-sent";
      case "draft":
        return "status-draft";
      case "overdue":
        return "status-overdue";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-draft";
    }
  };

  const badgeClass = `
    status-badge 
    status-badge-${size} 
    ${getStatusClass(status)} 
    ${className}
  `.trim();

  return <span className={badgeClass}>{status}</span>;
};

export default StatusBadge;
