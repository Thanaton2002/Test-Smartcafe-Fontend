import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicApi } from "../api/base.api";
import { theme, Button } from "../components/Theme";
import { useCartStore } from "../stores/cart.store";

interface MenuItem {
  menuid?: number;  // For compatibility
  id?: number;      // From API response
  img: string;
  name: string;
  price: number;
  category?: string;
}

const MenuDetailPageNew: React.FC = () => {
  const { menuid } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!menuid) return;
    
    setLoading(true);
    console.log(`🔄 Fetching menu detail for ID: ${menuid}`);
    
    // Get menu item details from backend API
    publicApi.get(`/menu/${menuid}`)
      .then(res => {
        console.log("✅ Menu detail API response received:");
        console.log("Full response object:", res);
        console.log("Response data:", res.data);
        console.log("Response status:", res.status);
        
        // Detailed data structure analysis
        if (res.data) {
          console.log("📊 Analyzing menu detail response structure:");
          console.log("- typeof res.data:", typeof res.data);
          console.log("- Object.keys(res.data):", Object.keys(res.data));
          
          if (res.data.data) {
            console.log("- res.data.data exists:", res.data.data);
            console.log("- typeof res.data.data:", typeof res.data.data);
            if (res.data.data.menus) {
              console.log("- res.data.data.menus length:", res.data.data.menus.length);
              console.log("- Looking for menu with ID:", menuid);
            }
          }
        }
        
        // Handle the actual API response structure
        if (res.data && res.data.data && res.data.data.menus) {
          console.log("🎯 Processing array response - searching for matching menu");
          // Response returns array of menus, find the matching one
          const menus = res.data.data.menus;
          const foundItem = menus.find((m: any) => {
            console.log(`Comparing menu ID ${m.id || m.menuid} with requested ID ${menuid}`);
            return m.id === Number(menuid) || m.menuid === Number(menuid);
          });
          
          if (foundItem) {
            console.log("✅ Found matching menu item:", foundItem);
            // Normalize the data structure
            const normalizedItem = {
              menuid: foundItem.id || foundItem.menuid,
              id: foundItem.id || foundItem.menuid,
              name: foundItem.name,
              price: foundItem.price,
              img: foundItem.img,
              category: foundItem.category
            };
            console.log("📋 Normalized menu item:", normalizedItem);
            setItem(normalizedItem);
          } else {
            console.log("❌ No matching menu item found in array");
            setItem(null);
          }
        } else if (res.data) {
          console.log("🎯 Processing direct item response");
          // Direct item response
          const normalizedItem = {
            menuid: res.data.id || res.data.menuid,
            id: res.data.id || res.data.menuid,
            name: res.data.name,
            price: res.data.price,
            img: res.data.img,
            category: res.data.category
          };
          console.log("📋 Normalized direct item:", normalizedItem);
          setItem(normalizedItem);
        } else {
          console.log("❌ No usable data in response");
          setItem(null);
        }
      })
      .catch((error) => {
        console.error("❌ Primary menu detail API failed:");
        console.error("Error object:", error);
        console.error("Error message:", error.message);
        console.error("Error response:", error.response);
        
        // If individual item API fails, try to get from menu list
        console.log("🔄 Attempting fallback: fetching from menu list...");
        publicApi.get("/menu")
          .then(res => {
            console.log("✅ Fallback menu list response:", res.data);
            const menus = res.data.data?.menus || res.data || [];
            console.log("📋 Available menus for fallback search:", menus);
            const foundItem = menus.find((m: any) => {
              console.log(`Fallback: Comparing menu ID ${m.id || m.menuid} with requested ID ${menuid}`);
              return m.id === Number(menuid) || m.menuid === Number(menuid);
            });
            
            if (foundItem) {
              console.log("✅ Found item in fallback search:", foundItem);
              const normalizedItem = {
                menuid: foundItem.id || foundItem.menuid,
                id: foundItem.id || foundItem.menuid,
                name: foundItem.name,
                price: foundItem.price,
                img: foundItem.img,
                category: foundItem.category
              };
              console.log("📋 Fallback normalized item:", normalizedItem);
              setItem(normalizedItem);
            } else {
              console.log("❌ No matching item found in fallback search either");
              setItem(null);
            }
          })
          .catch((fallbackError) => {
            console.error("❌ Fallback API also failed:", fallbackError);
            setItem(null);
          });
      })
      .finally(() => {
        setLoading(false);
        console.log("✅ Menu detail loading process completed");
      });
  }, [menuid]);

  const handleAddToCart = () => {
    if (!item) return;
    
    addItem({
      menuid: item.menuid || item.id || 0,
      name: item.name,
      price: item.price,
      img: item.img,
      quantity: qty,
      note: note.trim() || undefined
    });
    
    // Toast notification
    const toast = document.createElement('div');
    toast.innerHTML = `✅ เพิ่ม "${item.name}" ลงตะกร้าแล้ว!`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${theme.colors.success};
      color: white;
      padding: 16px 24px;
      border-radius: ${theme.borderRadius.md};
      box-shadow: ${theme.shadows.lg};
      z-index: 10000;
      font-family: ${theme.fonts.primary};
      font-weight: 600;
    `;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
    
    navigate("/");
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: theme.colors.background 
      }}>
        <div style={{ textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
        fontFamily: theme.fonts.primary,
        padding: "20px"
      }}>
        {/* Back Button */}
        <div style={{ marginBottom: "20px" }}>
          <Button variant="outline" onClick={() => navigate("/")} size="sm">
            ← กลับไปเมนู
          </Button>
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center"
        }}>
          <div>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>😔</div>
            <h2 style={{ 
              color: theme.colors.text, 
              marginBottom: "16px",
              fontSize: theme.fonts.sizes["2xl"]
            }}>
              ไม่พบเมนูที่ต้องการ
            </h2>
            <p style={{ 
              color: theme.colors.textLight,
              fontSize: theme.fonts.sizes.lg,
              marginBottom: "24px"
            }}>
              เมนู ID: {menuid} ไม่มีในระบบ
            </p>
            <Button onClick={() => navigate("/")} variant="primary">
              กลับไปเลือกเมนูอื่น
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
      fontFamily: theme.fonts.primary 
    }}>
      {/* Back Button */}
      <div style={{ padding: "20px" }}>
        <Button variant="outline" onClick={() => navigate("/")} size="sm">
          ← กลับไปเมนู
        </Button>
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        padding: "0 20px 40px 20px" 
      }}>
        <div style={{ 
          maxWidth: "500px", 
          width: "100%",
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: "24px",
          boxShadow: theme.shadows.md
        }}>
          <div style={{ padding: "0" }}>
            {/* รูปเมนู */}
            <div style={{ 
              position: "relative", 
              overflow: "hidden", 
              borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`,
              minHeight: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: theme.colors.background
            }}>
              {item.img && item.img.startsWith("http") ? (
                <img 
                  src={item.img} 
                  alt={item.name} 
                  style={{ 
                    width: "100%", 
                    height: "300px", 
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 300px; font-size: 5rem;">🥤</div>';
                    }
                  }}
                />
              ) : (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: "300px", 
                  fontSize: "5rem" 
                }}>
                  {item.img || "🥤"}
                </div>
              )}
            </div>

            <div style={{ padding: "32px" }}>
              {/* ชื่อและราคา */}
              <h1 style={{ 
                fontWeight: 700, 
                fontSize: theme.fonts.sizes["3xl"], 
                color: theme.colors.text,
                margin: "0 0 8px 0"
              }}>
                {item.name}
              </h1>
              <div style={{ 
                color: theme.colors.primary, 
                fontSize: theme.fonts.sizes["2xl"],
                fontWeight: 700,
                marginBottom: "24px"
              }}>
                ฿{item.price}
              </div>

              {/* หมายเหตุ */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: 600, 
                  color: theme.colors.text 
                }}>
                  หมายเหตุ (ถ้ามี):
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="เช่น น้ำแข็งน้อย, หวานน้อย..."
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    borderRadius: theme.borderRadius.md,
                    border: `2px solid ${theme.colors.background}`,
                    padding: "12px",
                    fontFamily: theme.fonts.primary,
                    fontSize: theme.fonts.sizes.md,
                    resize: "vertical" as const,
                    outline: "none",
                    transition: "border-color 0.2s ease"
                  }}
                  onFocus={e => e.target.style.borderColor = theme.colors.primary}
                  onBlur={e => e.target.style.borderColor = theme.colors.background}
                />
              </div>

              {/* จำนวน */}
              <div style={{ marginBottom: "32px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "12px", 
                  fontWeight: 600, 
                  color: theme.colors.text 
                }}>
                  จำนวน:
                </label>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "16px",
                  justifyContent: "center"
                }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    −
                  </Button>
                  <span style={{ 
                    fontSize: theme.fonts.sizes.xl, 
                    fontWeight: 600,
                    minWidth: "40px",
                    textAlign: "center" as const
                  }}>
                    {qty}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQty(q => q + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* ปุ่มเพิ่มลงตะกร้า */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full"
              >
                <div style={{ 
                  width: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  gap: "8px"
                }}>
                  🛒 เพิ่มลงตะกร้า - ฿{(item.price * qty).toLocaleString()}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailPageNew;