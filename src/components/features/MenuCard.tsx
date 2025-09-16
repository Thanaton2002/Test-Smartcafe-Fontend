// filepath: src/components/features/MenuCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui";
import { theme } from "../Theme";
import type { MenuItem } from "../../types";

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const menuId = item.menuid || item.id;
    if (menuId) {
      navigate(`/menu/${menuId}`);
    }
  };

  return (
    <Card onClick={handleClick} hover>
      <div style={{
        minWidth: "180px",
        borderRadius: theme.borderRadius.lg,
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        border: "2px solid transparent",
        position: "relative"
      }}>
        {/* Menu Image/Icon */}
        <div style={{
          width: "100%",
          height: "140px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
          borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`,
          overflow: "hidden"
        }}>
          {item.img && item.img.startsWith("http") ? (
            <img 
              src={item.img} 
              alt={item.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100%; font-size: 3rem;">🥤</div>';
                }
              }}
            />
          ) : (
            <div style={{ 
              fontSize: "3rem", 
              textAlign: "center"
            }}>
              {item.img || "🥤"}
            </div>
          )}
        </div>

        {/* Menu Info */}
        <div style={{ padding: "16px" }}>
          <h3 style={{
            margin: "0 0 8px 0",
            fontSize: theme.fonts.sizes.md,
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.text,
            lineHeight: "1.4"
          }}>
            {item.name}
          </h3>
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{
              color: theme.colors.primary,
              fontSize: theme.fonts.sizes.lg,
              fontWeight: theme.fonts.weights.bold
            }}>
              ฿{item.price}
            </span>
            
            {item.category && (
              <span style={{
                background: theme.colors.background,
                color: theme.colors.textMuted,
                padding: "4px 8px",
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.fonts.sizes.xs,
                fontWeight: theme.fonts.weights.medium
              }}>
                {item.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};