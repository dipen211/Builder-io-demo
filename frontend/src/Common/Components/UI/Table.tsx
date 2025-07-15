import React from "react";
import "./Table.css";

interface TableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
  align?: "left" | "center" | "right";
}

const Table: React.FC<TableProps> & {
  Header: React.FC<TableHeaderProps>;
  Body: React.FC<TableBodyProps>;
  Row: React.FC<TableRowProps>;
  Cell: React.FC<TableCellProps>;
} = ({ children, className = "", striped = false, hoverable = true }) => {
  const tableClass = `
    table 
    ${striped ? "table-striped" : ""} 
    ${hoverable ? "table-hoverable" : ""} 
    ${className}
  `.trim();

  return (
    <div className="table-container">
      <table className={tableClass}>{children}</table>
    </div>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <thead className={`table-header ${className}`.trim()}>{children}</thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children, className = "" }) => {
  return <tbody className={`table-body ${className}`.trim()}>{children}</tbody>;
};

const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
  onClick,
}) => {
  const rowClass =
    `table-row ${onClick ? "table-row-clickable" : ""} ${className}`.trim();

  return (
    <tr className={rowClass} onClick={onClick}>
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  header = false,
  align = "left",
}) => {
  const cellClass = `table-cell table-cell-${align} ${className}`.trim();

  if (header) {
    return <th className={cellClass}>{children}</th>;
  }

  return <td className={cellClass}>{children}</td>;
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
