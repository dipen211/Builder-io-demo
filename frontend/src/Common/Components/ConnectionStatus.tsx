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

  if (isConnected === null) {
    return (
      <div className={`connection-status checking ${className}`}>
        <span className="status-indicator">🔄</span>
        <span className="status-text">Checking connection...</span>
      </div>
    );
  }

  return (
    <div
      className={`connection-status ${isConnected ? "connected" : "disconnected"} ${className}`}
    >
      <span className="status-indicator">{isConnected ? "🟢" : "🔴"}</span>
      <span className="status-text">
        {isConnected ? "Backend Connected" : "Backend Disconnected"}
      </span>
      {lastChecked && (
        <small className="last-checked">
          Last checked: {lastChecked.toLocaleTimeString()}
        </small>
      )}
      <button
        className="refresh-btn"
        onClick={checkConnection}
        title="Check connection now"
      >
        🔄
      </button>

      <style jsx>{`
        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .connection-status.connected {
          color: #4caf50;
        }

        .connection-status.disconnected {
          color: #f44336;
        }

        .connection-status.checking {
          color: #ff9800;
        }

        .status-indicator {
          font-size: 0.8rem;
        }

        .last-checked {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
        }

        .refresh-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          color: inherit;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .refresh-btn:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ConnectionStatus;
