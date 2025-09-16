// filepath: src/components/layout/PageLayout.tsx
import React from "react";
import { theme } from "../Theme";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backgroundGradient?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  backgroundGradient = true
}) => {
  return (
    <div style={{
      minHeight: "100vh",
      background: backgroundGradient 
        ? `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`
        : theme.colors.background,
      fontFamily: theme.fonts.primary,
      padding: "20px"
    }}>
      {/* Header */}
      {(title || showBackButton) && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          maxWidth: "1200px",
          margin: "0 auto 24px auto"
        }}>
          {showBackButton && (
            <button
              onClick={onBackClick}
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.full,
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: theme.shadows.sm,
                fontSize: "18px"
              }}
            >
              ←
            </button>
          )}
          
          {title && (
            <div style={{ textAlign: "center", flex: 1 }}>
              <h1 style={{
                color: theme.colors.primary,
                fontWeight: theme.fonts.weights.bold,
                fontSize: theme.fonts.sizes["4xl"],
                margin: "0 0 8px 0",
                textShadow: "2px 2px 4px rgba(139, 69, 19, 0.1)"
              }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{
                  color: theme.colors.textLight,
                  fontSize: theme.fonts.sizes.md,
                  margin: 0
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {children}
      </div>
    </div>
  );
};