// filepath: src/components/ui/Modal.tsx
import React from "react";
import { theme } from "../Theme";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md"
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "400px",
    md: "500px",
    lg: "700px"
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.xl,
          maxWidth: sizes[size],
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{
            padding: "24px 24px 16px 24px",
            borderBottom: `1px solid ${theme.colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h2 style={{
              margin: 0,
              fontSize: theme.fonts.sizes.xl,
              fontWeight: theme.fonts.weights.bold,
              color: theme.colors.text
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: theme.colors.textMuted,
                padding: "4px"
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};