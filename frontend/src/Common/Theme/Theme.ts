export const theme = {
  colors: {
    primary: {
      main: "#667eea",
      light: "#9aa7f0",
      dark: "#4c63d2",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    secondary: {
      main: "#764ba2",
      light: "#9575cd",
      dark: "#512da8",
    },
    success: {
      main: "#4CAF50",
      light: "#81c784",
      dark: "#388e3c",
    },
    warning: {
      main: "#FF9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    error: {
      main: "#F44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    info: {
      main: "#2196F3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
      card: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
      disabled: "#999999",
    },
    border: {
      light: "#e1e5e9",
      main: "#dee2e6",
      dark: "#adb5bd",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  borderRadius: {
    sm: "4px",
    md: "6px",
    lg: "12px",
    round: "50%",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    md: "0 2px 8px rgba(0,0,0,0.1)",
    lg: "0 4px 12px rgba(102, 126, 234, 0.4)",
    xl: "0 8px 25px rgba(0,0,0,0.15)",
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      xxl: "1.5rem",
      xxxl: "2rem",
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  breakpoints: {
    xs: "320px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
