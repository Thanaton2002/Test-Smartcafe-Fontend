// filepath: src/components/ui/Badge.tsx
import React from "react";
import { theme } from "../Theme";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md"
}) => {
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: "white"
    },
    secondary: {
      backgroundColor: theme.colors.background,
      color: theme.colors.text
    },
    success: {
      backgroundColor: theme.colors.success,
      color: "white"
    },
    warning: {
      backgroundColor: theme.colors.warning,
      color: "white"
    },
    danger: {
      backgroundColor: theme.colors.error,
      color: "white"
    }
  };

  const sizes = {
    sm: {
      padding: "4px 8px",
      fontSize: theme.fonts.sizes.xs
    },
    md: {
      padding: "6px 12px",
      fontSize: theme.fonts.sizes.sm
    }
  };

  return (
    <span
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: theme.borderRadius.full,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap" as const
      }}
    >
      {children}
    </span>
  );
};