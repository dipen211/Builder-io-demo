import React from "react";
import "./Button.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const buttonClass = `
    btn 
    btn-${variant} 
    btn-${size} 
    ${loading ? "btn-loading" : ""} 
    ${className}
  `.trim();

  return (
    <button className={buttonClass} disabled={disabled || loading} {...props}>
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
