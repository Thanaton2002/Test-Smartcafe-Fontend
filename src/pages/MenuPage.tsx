import React, { useEffect, useState } from "react";
import publicApi from "../api/public.api";
import { useNavigate } from "react-router-dom";
import { theme } from "../components/Theme";
import { useCartStore } from "../stores/cart.store";

interface MenuItem {
  menuid?: number;  // For compatibility 
  id?: number;      // From API response
  img: string;
  name: string;
  price: number;
  category?: string;
}

const MenuPageNew: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    // Load menu data from backend API
    setLoading(true);
    console.log("🔄 Starting to fetch menu data from /menu endpoint...");
    
    publicApi.getMenus()
      .then((res: any) => {
        console.log("✅ Menu list API response received:");
        console.log("Full response object:", res);
        console.log("Response data:", res.data);
        console.log("Response status:", res.status);
        console.log("Response headers:", res.headers);
        
        // Detailed data structure analysis
        if (res.data) {
          console.log("📊 Analyzing response data structure:");
          console.log("- typeof res.data:", typeof res.data);
          console.log("- Array.isArray(res.data):", Array.isArray(res.data));
          console.log("- Object.keys(res.data):", Object.keys(res.data));
          
          if (res.data.data) {
            console.log("- res.data.data exists:", res.data.data);
            console.log("- typeof res.data.data:", typeof res.data.data);
            if (res.data.data.menus) {
              console.log("- res.data.data.menus exists, length:", res.data.data.menus.length);
              console.log("- First menu item example:", res.data.data.menus[0]);
            }
          }
        }
        
        // Handle the API response structure
        let processedMenus = [];
        if (res.data && res.data.data && res.data.data.menus) {
          console.log("🎯 Using nested structure: res.data.data.menus");
          processedMenus = res.data.data.menus.map((item: any, index: number) => {
            console.log(`Processing menu item ${index + 1}:`, item);
            return {
              menuid: item.id || item.menuid,
              id: item.id || item.menuid,
              name: item.name,
              price: item.price,
              img: item.img,
              category: item.category
            };
          });
        } else if (Array.isArray(res.data)) {
          console.log("🎯 Using direct array structure: res.data");
          processedMenus = res.data.map((item: any, index: number) => {
            console.log(`Processing menu item ${index + 1}:`, item);
            return {
              menuid: item.id || item.menuid,
              id: item.id || item.menuid,
              name: item.name,
              price: item.price,
              img: item.img,
              category: item.category
            };
          });
        } else if (res.data) {
          console.log("🎯 Using fallback structure: res.data as single object");
          processedMenus = [res.data];
        } else {
          console.log("❌ No usable data structure found");
          processedMenus = [];
        }
        
        console.log("📋 Final processed menus array:", processedMenus);
        console.log("📋 Total menu items:", processedMenus.length);
        
        setMenu(processedMenus);
      })
      .catch((error: any) => {
        console.error("❌ Failed to load menu:");
        console.error("Error object:", error);
        console.error("Error message:", error.message);
        console.error("Error response:", error.response);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        }
        setMenu([]); // Empty array if API fails
      })
      .finally(() => {
        setLoading(false);
        console.log("✅ Menu loading process completed");
      });
  }, []);

  const totalItems = getTotalItems();

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
      fontFamily: theme.fonts.primary,
      paddingBottom: "100px"
    }}>
      {/* Header */}
      <div style={{
        background: theme.colors.surface,
        boxShadow: theme.shadows.md,
        padding: "20px",
        textAlign: "center",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <h1 style={{ 
          color: theme.colors.primary, 
          fontWeight: 700, 
          fontSize: theme.fonts.sizes["4xl"],
          margin: 0,
          textShadow: "2px 2px 4px rgba(139, 69, 19, 0.1)"
        }}>
          ☕ SmartCafe
        </h1>
        <p style={{ 
          color: theme.colors.textLight, 
          fontSize: theme.fonts.sizes.md,
          margin: "8px 0 16px 0"
        }}>
          เครื่องดื่มสไตล์เกาหลี ดื่มด่ำ ในรสชาติแห่งความสุข
        </p>

        {/* Navigation Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => navigate("/orders")}
            style={{
              background: "transparent",
              border: `2px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
              padding: "10px 20px",
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.fonts.sizes.sm,
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.colors.primary;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = theme.colors.primary;
            }}
          >
            📋 ประวัติการสั่งซื้อ
          </button>

          <button
            onClick={() => navigate("/cart")}
            style={{
              background: theme.colors.accent,
              border: "none",
              color: "white",
              padding: "10px 20px",
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.fonts.sizes.sm,
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: theme.shadows.sm,
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
          >
            🛒 ตะกร้า
            {getTotalItems() > 0 && (
              <span style={{
                background: theme.colors.primary,
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "700",
                minWidth: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "4px"
              }}>
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: theme.colors.textLight }}>
          <div style={{ 
            display: "inline-block", 
            width: "40px", 
            height: "40px", 
            border: `3px solid ${theme.colors.primary}`, 
            borderTop: `3px solid transparent`, 
            borderRadius: "50%", 
            animation: "spin 1s linear infinite" 
          }}></div>
          <p>กำลังโหลดเมนู...</p>
        </div>
      )}

      {/* Menu Grid - Cafe Style */}
      {!loading && (
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px",
          padding: "20px",
          maxWidth: "900px",
          margin: "0 auto"
        }}>
          {menu.map((item) => (
            <div
              key={item.menuid || item.id}
              onClick={() => navigate(`/menu/${item.menuid || item.id}`)}
              style={{
                background: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                overflow: "hidden",
                boxShadow: theme.shadows.sm,
                transition: "all 0.3s ease",
                cursor: "pointer",
                border: `2px solid transparent`,
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme.shadows.lg;
                e.currentTarget.style.borderColor = theme.colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadows.sm;
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {/* Drink Image/Icon */}
              <div style={{
                width: "100%",
                height: "140px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
                marginBottom: "16px",
                position: "relative"
              }}>
                {item.img && item.img.startsWith("http") ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "all 0.3s ease"
                    }}
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span style="font-size: 4rem; display: flex; align-items: center; justify-content: center; height: 100%;">🥤</span>';
                      }
                    }}
                  />
                ) : (
                  <span style={{ 
                    fontSize: "4rem",
                    filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.1))"
                  }}>
                    {item.img || "🥤"}
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "0 16px 20px 16px" }}>
                {/* Drink Name */}
                <h3 style={{
                  fontSize: theme.fonts.sizes.lg,
                  fontWeight: "700",
                  color: theme.colors.text,
                  margin: "0 0 8px 0",
                  lineHeight: "1.3",
                  textAlign: "center"
                }}>
                  {item.name}
                </h3>

                {/* Price */}
                <p style={{
                  fontSize: theme.fonts.sizes.xl,
                  fontWeight: "700",
                  color: theme.colors.primary,
                  margin: "8px 0 0 0",
                  textAlign: "center"
                }}>
                  ฿{item.price}
                </p>

                {/* Category Badge */}
                {item.category && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: theme.colors.accent,
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.fonts.sizes.xs,
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}>
                    {item.category}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Order Button */}
      {totalItems > 0 && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000
        }}>
          <div
            onClick={() => navigate("/cart")}
            style={{
              background: theme.colors.primary,
              color: "white",
              padding: "16px 32px",
              borderRadius: theme.borderRadius.full,
              boxShadow: theme.shadows.lg,
              cursor: "pointer",
              fontSize: theme.fonts.sizes.lg,
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            🛒 ยืนยันออเดอร์ ({totalItems})
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MenuPageNew;