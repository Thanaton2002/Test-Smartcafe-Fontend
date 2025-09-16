// filepath: src/components/ui/LoadingSpinner.tsx
import React from "react";
import { theme } from "../Theme";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = theme.colors.primary,
  text = "กำลังโหลด..."
}) => {
  const sizes = {
    sm: "20px",
    md: "40px",
    lg: "60px"
  };

  const spinnerStyle = {
    display: "inline-block",
    width: sizes[size],
    height: sizes[size],
    border: `3px solid ${color}`,
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  };

  return (
    <div style={{
      textAlign: "center" as const,
      padding: "40px",
      color: theme.colors.textLight
    }}>
      <div style={spinnerStyle} />
      {text && (
        <div style={{
          marginTop: "16px",
          fontSize: theme.fonts.sizes.md
        }}>
          {text}
        </div>
      )}
    </div>
  );
};