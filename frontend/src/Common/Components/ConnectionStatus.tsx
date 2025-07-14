import React, { useState, useEffect } from "react";
import { CONNECTION_CONFIG } from "../Constants/Constants";

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = "",
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      const response = await fetch(CONNECTION_CONFIG.BACKEND_HEALTH_CHECK, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        // Don't cache health checks
        cache: "no-cache",
      });

      setIsConnected(response.ok);
      setLastChecked(new Date());
    } catch (error) {
      console.log("Backend connection check failed:", error);
      setIsConnected(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const statusStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem",
    borderRadius: "4px",
    fontSize: "0.85rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  };

  const indicatorStyles: React.CSSProperties = {
    fontSize: "0.8rem",
  };

  const lastCheckedStyles: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.75rem",
  };

  const refreshBtnStyles: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.8rem",
    color: "inherit",
    opacity: 0.7,
    transition: "opacity 0.2s",
  };

  if (isConnected === null) {
    return (
      <div
        className={`connection-status checking ${className}`}
        style={statusStyles}
      >
        <span style={indicatorStyles}>🔄</span>
        <span>Checking connection...</span>
      </div>
    );
  }

  return (
    <div
      className={`connection-status ${isConnected ? "connected" : "disconnected"} ${className}`}
      style={{
        ...statusStyles,
        color: isConnected ? "#4CAF50" : "#F44336",
      }}
    >
      <span style={indicatorStyles}>{isConnected ? "🟢" : "🔴"}</span>
      <span>{isConnected ? "Backend Connected" : "Backend Disconnected"}</span>
      {lastChecked && (
        <small style={lastCheckedStyles}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </small>
      )}
      <button
        style={refreshBtnStyles}
        onClick={checkConnection}
        title="Check connection now"
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
      >
        🔄
      </button>
    </div>
  );
};

export default ConnectionStatus;
