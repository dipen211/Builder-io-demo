import React from "react";
import "./Loading.css";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
  overlay?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  text = "Loading...",
  overlay = false,
  className = "",
}) => {
  const loadingClass = `
    loading-container 
    loading-${size} 
    ${overlay ? "loading-overlay" : ""} 
    ${className}
  `.trim();

  return (
    <div className={loadingClass}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default Loading;
