// filepath: src/components/ui/Button.tsx
import React from "react";
import { theme } from "../Theme";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  loading = false,
  onClick,
  className = "",
  type = "button",
  fullWidth = false
}) => {
  const baseStyles = {
    border: "none",
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.fonts.primary,
    fontWeight: 600,
    cursor: (disabled || loading) ? "not-allowed" : "pointer",
    opacity: (disabled || loading) ? 0.6 : 1,
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: fullWidth ? "100%" : "auto",
    position: "relative" as const
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
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.colors.text,
      border: "none"
    },
    danger: {
      backgroundColor: theme.colors.error,
      color: "white",
      boxShadow: theme.shadows.sm
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
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size]
      }}
    >
      {loading && (
        <div style={{
          width: "16px",
          height: "16px",
          border: "2px solid transparent",
          borderTop: "2px solid currentColor",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
      )}
      {children}
    </button>
  );
};