// filepath: src/components/ui/Card.tsx
import React from "react";
import { theme } from "../Theme";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  shadow?: "sm" | "md" | "lg" | "xl";
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  onClick, 
  hover = false,
  padding = "md",
  shadow = "md"
}) => {
  const paddingValues = {
    sm: "16px",
    md: "24px", 
    lg: "32px"
  };

  const shadowValues = {
    sm: theme.shadows.sm,
    md: theme.shadows.md,
    lg: theme.shadows.lg,
    xl: theme.shadows.xl
  };

  const cardStyles = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: shadowValues[shadow],
    transition: "all 0.2s ease",
    cursor: onClick ? "pointer" : "default",
    padding: paddingValues[padding],
    border: `1px solid ${theme.colors.border}`
  };

  const hoverStyles = hover && onClick ? {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows.lg
  } : {};

  return (
    <div
      className={className}
      onClick={onClick}
      style={cardStyles}
      onMouseEnter={(e) => {
        if (hover && onClick) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (hover && onClick) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = shadowValues[shadow];
        }
      }}
    >
      {children}
    </div>
  );
};