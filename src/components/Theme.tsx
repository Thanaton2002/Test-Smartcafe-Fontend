import React from "react";

// Enhanced Modern Korean Cafe Theme
export const theme = {
  colors: {
    primary: "#8B4513",         // Rich chocolate brown
    secondary: "#D2691E",       // Warm caramel
    accent: "#CD853F",          // Golden brown
    background: "#FAF7F2",      // Cream white
    surface: "#FFFFFF",         // Pure white
    text: "#3E2723",            // Dark brown
    textLight: "#6D4C41",       // Medium brown
    textMuted: "#8D6E63",       // Light brown
    success: "#2E7D32",         // Forest green
    warning: "#F57C00",         // Warm orange
    error: "#C62828",           // Deep red
    card: "#FEFEFE",            // Card background
    hover: "#F5F5F5",           // Hover state
    border: "#E8E8E8",          // Border color
    gradient: {
      primary: "linear-gradient(135deg, #8B4513 0%, #D2691E 100%)",
      secondary: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)",
      accent: "linear-gradient(135deg, #CD853F 0%, #DEB887 100%)"
    }
  },
  fonts: {
    primary: "'Prompt', 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif",
    secondary: "'Inter', 'Prompt', sans-serif",
    sizes: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px"
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 800
    }
  },
  shadows: {
    xs: "0 1px 2px rgba(139, 69, 19, 0.05)",
    sm: "0 1px 3px rgba(139, 69, 19, 0.1), 0 1px 2px rgba(139, 69, 19, 0.06)",
    md: "0 4px 6px rgba(139, 69, 19, 0.1), 0 2px 4px rgba(139, 69, 19, 0.06)",
    lg: "0 10px 15px rgba(139, 69, 19, 0.1), 0 4px 6px rgba(139, 69, 19, 0.05)",
    xl: "0 20px 25px rgba(139, 69, 19, 0.1), 0 10px 10px rgba(139, 69, 19, 0.04)",
    "2xl": "0 25px 50px rgba(139, 69, 19, 0.25)",
    inner: "inset 0 2px 4px rgba(139, 69, 19, 0.06)"
  },
  borderRadius: {
    none: "0px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "20px",
    "3xl": "24px",
    full: "9999px"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px"
  },
  breakpoints: {
    mobile: "320px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px"
  },
  animations: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
      slower: "500ms"
    },
    easing: {
      linear: "linear",
      ease: "ease",
      "ease-in": "ease-in",
      "ease-out": "ease-out",
      "ease-in-out": "ease-in-out"
    }
  }
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  onClick,
  className = "",
  type = "button"
}) => {
  const baseStyles = {
    border: "none",
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.fonts.primary,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: "white",
      boxShadow: theme.shadows.sm
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: "white",
      boxShadow: theme.shadows.sm
    },
    outline: {
      backgroundColor: "transparent",
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`
    }
  };

  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: theme.fonts.sizes.sm
    },
    md: {
      padding: "12px 24px",
      fontSize: theme.fonts.sizes.md
    },
    lg: {
      padding: "16px 32px",
      fontSize: theme.fonts.sizes.lg
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size]
      }}
    >
      {children}
    </button>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick, hover = false }) => {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.md,
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        ...(hover && onClick && {
          ":hover": {
            transform: "translateY(-2px)",
            boxShadow: theme.shadows.lg
          }
        })
      }}
    >
      {children}
    </div>
  );
};