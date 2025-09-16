import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../components/Theme";
import { getStoredOrders } from "../utils/orderStorage";

interface Order {
  orderId: string;
  totalAmount: number;
  totalItems: number;
  status: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    console.log("🔄 Loading order history...");
    
    try {
      // Try to get orders from localStorage first
      const localOrders = getStoredOrders();
      
      console.log("📱 Found orders in localStorage:", localOrders);
      setOrders(localOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("❌ Failed to load orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return '🔄 กำลังเตรียม';
      case 'ready': return '✅ พร้อมเสิร์ฟ';
      case 'completed': return '🎉 เสร็จสิ้น';
      case 'cancelled': return '❌ ยกเลิก';
      default: return '📝 รอดำเนินการ';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return theme.colors.warning;
      case 'ready': return theme.colors.success;
      case 'completed': return theme.colors.textLight;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.textMuted;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === "all") return true;
    return order.status === selectedFilter;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ชั่วโมงที่ผ่านมา`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} วันที่ผ่านมา`;
    } else {
      return date.toLocaleDateString('th-TH');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: theme.colors.gradient.secondary,
        fontFamily: theme.fonts.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: theme.colors.surface,
          padding: "40px",
          borderRadius: theme.borderRadius['2xl'],
          boxShadow: theme.shadows.xl,
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px",
            animation: "spin 1s linear infinite"
          }}>
            ⏳
          </div>
          <div style={{
            color: theme.colors.primary,
            fontSize: theme.fonts.sizes.lg,
            fontWeight: theme.fonts.weights.semibold
          }}>
            กำลังโหลดประวัติออเดอร์...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.colors.gradient.secondary,
      fontFamily: theme.fonts.primary,
      paddingBottom: "40px"
    }}>
      {/* Header */}
      <div style={{
        background: theme.colors.surface,
        boxShadow: theme.shadows.md,
        padding: "20px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid ${theme.colors.border}`
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <button
            onClick={() => navigate("/menu")}
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
          
          <div style={{ textAlign: "center" }}>
            <h1 style={{
              color: theme.colors.primary,
              fontWeight: theme.fonts.weights.bold,
              fontSize: theme.fonts.sizes["3xl"],
              margin: 0,
              textShadow: "2px 2px 4px rgba(139, 69, 19, 0.1)"
            }}>
              📋 ประวัติออเดอร์
            </h1>
            <p style={{
              color: theme.colors.textLight,
              fontSize: theme.fonts.sizes.md,
              margin: "4px 0 0 0"
            }}>
              Order History
            </p>
          </div>

          <div style={{ width: "40px" }}></div> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "32px 20px"
      }}>
        {/* Filter Tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "32px",
          background: theme.colors.surface,
          padding: "8px",
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.sm,
          border: `1px solid ${theme.colors.border}`,
          overflowX: "auto"
        }}>
          {[
            { key: "all", label: "ทั้งหมด", icon: "📋" },
            { key: "preparing", label: "กำลังทำ", icon: "🔄" },
            { key: "ready", label: "พร้อม", icon: "✅" },
            { key: "completed", label: "เสร็จสิ้น", icon: "🎉" }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              style={{
                background: selectedFilter === filter.key ? theme.colors.gradient.primary : 'transparent',
                color: selectedFilter === filter.key ? theme.colors.surface : theme.colors.text,
                border: "none",
                borderRadius: theme.borderRadius.lg,
                padding: "12px 16px",
                fontSize: theme.fonts.sizes.sm,
                fontWeight: theme.fonts.weights.medium,
                cursor: "pointer",
                fontFamily: theme.fonts.primary,
                transition: `all ${theme.animations.duration.normal}`,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius['2xl'],
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: theme.shadows.lg,
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{
              fontSize: "64px",
              marginBottom: "24px",
              opacity: 0.5
            }}>
              🛍️
            </div>
            <h3 style={{
              color: theme.colors.text,
              fontSize: theme.fonts.sizes.xl,
              fontWeight: theme.fonts.weights.semibold,
              margin: "0 0 12px 0"
            }}>
              ยังไม่มีออเดอร์
            </h3>
            <p style={{
              color: theme.colors.textLight,
              fontSize: theme.fonts.sizes.md,
              margin: "0 0 32px 0",
              lineHeight: 1.6
            }}>
              เมื่อคุณสั่งซื้อ ประวัติออเดอร์จะแสดงที่นี่
            </p>
            <button
              onClick={() => navigate("/menu")}
              style={{
                background: theme.colors.gradient.primary,
                color: theme.colors.surface,
                border: "none",
                borderRadius: theme.borderRadius.xl,
                padding: "16px 32px",
                fontSize: theme.fonts.sizes.md,
                fontWeight: theme.fonts.weights.semibold,
                cursor: "pointer",
                fontFamily: theme.fonts.primary,
                boxShadow: theme.shadows.md,
                transition: `all ${theme.animations.duration.normal}`,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = theme.shadows.lg;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
            >
              <span>🍴</span>
              <span>สั่งออเดอร์แรก</span>
            </button>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            {filteredOrders.map((order, index) => (
              <div
                key={order.orderId}
                style={{
                  background: theme.colors.surface,
                  borderRadius: theme.borderRadius.xl,
                  padding: "24px",
                  boxShadow: theme.shadows.md,
                  border: `1px solid ${theme.colors.border}`,
                  transition: `all ${theme.animations.duration.normal}`,
                  cursor: "pointer",
                  animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                }}
                onClick={() => navigate(`/track/${order.orderId}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
              >
                {/* Order Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px"
                }}>
                  <div>
                    <h3 style={{
                      color: theme.colors.text,
                      fontSize: theme.fonts.sizes.lg,
                      fontWeight: theme.fonts.weights.semibold,
                      margin: "0 0 4px 0"
                    }}>
                      Order #{order.orderId}
                    </h3>
                    <p style={{
                      color: theme.colors.textLight,
                      fontSize: theme.fonts.sizes.sm,
                      margin: 0
                    }}>
                      🕒 {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  
                  <div style={{
                    background: getStatusColor(order.status),
                    color: theme.colors.surface,
                    padding: "6px 12px",
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.fonts.sizes.xs,
                    fontWeight: theme.fonts.weights.semibold
                  }}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div style={{
                  marginBottom: "16px"
                }}>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px"
                  }}>
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: theme.colors.background,
                          color: theme.colors.text,
                          padding: "4px 8px",
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fonts.sizes.xs,
                          fontWeight: theme.fonts.weights.medium
                        }}
                      >
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span
                        style={{
                          background: theme.colors.primary,
                          color: theme.colors.surface,
                          padding: "4px 8px",
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fonts.sizes.xs,
                          fontWeight: theme.fonts.weights.medium
                        }}
                      >
                        +{order.items.length - 3} รายการ
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "16px",
                  borderTop: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{
                    color: theme.colors.textLight,
                    fontSize: theme.fonts.sizes.sm
                  }}>
                    {order.totalItems} รายการ
                  </div>
                  <div style={{
                    color: theme.colors.primary,
                    fontSize: theme.fonts.sizes.xl,
                    fontWeight: theme.fonts.weights.bold
                  }}>
                    ฿{order.totalAmount.toLocaleString()}
                  </div>
                </div>

                {/* View Details Arrow */}
                <div style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.colors.textLight,
                  fontSize: "18px"
                }}>
                  →
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <div style={{
            marginTop: "32px",
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            padding: "24px",
            boxShadow: theme.shadows.md,
            border: `1px solid ${theme.colors.border}`
          }}>
            <h3 style={{
              color: theme.colors.text,
              fontSize: theme.fonts.sizes.lg,
              fontWeight: theme.fonts.weights.semibold,
              margin: "0 0 16px 0"
            }}>
              📊 สถิติการสั่งซื้อ
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  color: theme.colors.primary,
                  fontSize: theme.fonts.sizes["2xl"],
                  fontWeight: theme.fonts.weights.bold
                }}>
                  {orders.length}
                </div>
                <div style={{
                  color: theme.colors.textLight,
                  fontSize: theme.fonts.sizes.sm
                }}>
                  ออเดอร์ทั้งหมด
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  color: theme.colors.primary,
                  fontSize: theme.fonts.sizes["2xl"],
                  fontWeight: theme.fonts.weights.bold
                }}>
                  ฿{orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                </div>
                <div style={{
                  color: theme.colors.textLight,
                  fontSize: theme.fonts.sizes.sm
                }}>
                  ยอดรวม
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default OrderHistoryPage;