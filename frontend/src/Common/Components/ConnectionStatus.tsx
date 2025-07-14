import React, { useState, useEffect } from "react";
import { CONNECTION_CONFIG, APP_CONFIG } from "../Constants/Constants";

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = "",
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(APP_CONFIG.DEMO_MODE);

  const checkConnection = async () => {
    if (APP_CONFIG.DEMO_MODE) {
      setIsConnected(false);
      setLastChecked(new Date());
      setIsDemoMode(true);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(CONNECTION_CONFIG.BACKEND_HEALTH_CHECK, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-cache",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setIsConnected(response.ok);
      setLastChecked(new Date());
      setIsDemoMode(false);
    } catch (error) {
      console.log(
        "Backend connection check failed (expected in demo mode):",
        error,
      );
      setIsConnected(false);
      setLastChecked(new Date());
      setIsDemoMode(true);
    }
  };

  useEffect(() => {
    checkConnection();

    // Check connection every 60 seconds (less frequent to avoid spam)
    const interval = setInterval(checkConnection, 60000);

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

  const statusColor = isDemoMode
    ? "#FF9800"
    : isConnected
      ? "#4CAF50"
      : "#F44336";
  const statusText = isDemoMode
    ? "Demo Mode"
    : isConnected
      ? "Backend Connected"
      : "Backend Offline";
  const statusIcon = isDemoMode ? "🎮" : isConnected ? "🟢" : "🔴";

  return (
    <div
      className={`connection-status ${isDemoMode ? "demo" : isConnected ? "connected" : "disconnected"} ${className}`}
      style={{
        ...statusStyles,
        color: statusColor,
      }}
    >
      <span style={indicatorStyles}>{statusIcon}</span>
      <span>{statusText}</span>
      {!isDemoMode && lastChecked && (
        <small style={lastCheckedStyles}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </small>
      )}
      <button
        style={refreshBtnStyles}
        onClick={checkConnection}
        title={isDemoMode ? "Demo mode active" : "Check connection now"}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
      >
        {isDemoMode ? "⚙️" : "🔄"}
      </button>
    </div>
  );
};

export default ConnectionStatus;
