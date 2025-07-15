import React from "react";
import "./NotificationBanner.css";

interface NotificationBannerProps {
  type: "error" | "success" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  children,
  className = "",
  onDismiss,
  dismissible = false,
}) => {
  const bannerClass =
    `notification-banner notification-${type} ${className}`.trim();

  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return "❌";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "";
    }
  };

  return (
    <div className={bannerClass}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon(type)}</span>
        <div className="notification-message">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          className="notification-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;
