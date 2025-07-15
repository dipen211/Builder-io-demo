import React from "react";
import "./Card.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "small" | "medium" | "large";
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "small" | "medium" | "large";
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Content: React.FC<CardContentProps>;
  Title: React.FC<CardTitleProps>;
} = ({ children, className = "", padding = "medium" }) => {
  return (
    <div className={`card card-padding-${padding} ${className}`.trim()}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
  actions,
}) => {
  return (
    <div className={`card-header ${className}`.trim()}>
      <div className="card-header-content">{children}</div>
      {actions && <div className="card-header-actions">{actions}</div>}
    </div>
  );
};

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
  padding = "medium",
}) => {
  return (
    <div
      className={`card-content card-content-padding-${padding} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
  level = 3,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return <Tag className={`card-title ${className}`.trim()}>{children}</Tag>;
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;

export default Card;
