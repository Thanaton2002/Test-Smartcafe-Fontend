import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import publicApi from "../api/public.api";
import { theme } from "../components/Theme";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  status?: string;
  createdAt?: string;
}

const OrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId);
    } else {
      // If no orderId in params, try to get from localStorage (recent order)
      const recentOrder = localStorage.getItem('recentOrder');
      if (recentOrder) {
        try {
          const parsedOrder = JSON.parse(recentOrder);
          setOrder(parsedOrder);
        } catch (e) {
          setError("ไม่พบข้อมูลออเดอร์");
        }
      } else {
        setError("ไม่พบข้อมูลออเดอร์");
      }
    }
  }, [orderId]);

  const loadOrderDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await publicApi.getOrder(id);
      console.log("✅ Order details API response:", response.data);
      
      if (response.data) {
        // Transform API data to match Order interface
        const orderData = response.data.data || response.data;
        setOrder({
          orderId: orderData.id || id,
          items: orderData.items || [],
          total: orderData.totalPrice || orderData.total || 0,
          status: orderData.status,
          createdAt: orderData.createdAt
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to load order details:", error);
      setError("ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'preparing': return '🔄 กำลังเตรียม';
      case 'ready': return '✅ เสร็จแล้ว';
      case 'completed': return '🎉 เสร็จสิ้น';
      case 'cancelled': return '❌ ยกเลิก';
      default: return '📝 รอดำเนินการ';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'preparing': return '#F59E0B';
      case 'ready': return '#10B981';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return theme.colors.textLight;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
        fontFamily: theme.fonts.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: theme.colors.surface,
          padding: "32px",
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.lg,
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px"
          }}>⏳</div>
          <div style={{ 
            color: theme.colors.primary,
            fontSize: theme.fonts.sizes.lg,
            fontWeight: 600
          }}>
            กำลังโหลดข้อมูลออเดอร์...
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
        fontFamily: theme.fonts.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: theme.colors.surface,
          padding: "32px",
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.lg,
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px"
          }}>😕</div>
          <div style={{ 
            color: theme.colors.error,
            fontSize: theme.fonts.sizes.lg,
            fontWeight: 600,
            marginBottom: "16px"
          }}>
            {error}
          </div>
          <button
            onClick={() => navigate("/menu")}
            style={{
              background: theme.colors.primary,
              color: theme.colors.surface,
              border: "none",
              padding: "12px 24px",
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.fonts.sizes.md,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: theme.fonts.primary
            }}
          >
            กลับไปเมนู
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
      fontFamily: theme.fonts.primary,
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "32px"
      }}>
        <h1 style={{ 
          color: theme.colors.primary, 
          fontWeight: 700, 
          fontSize: theme.fonts.sizes["4xl"],
          margin: 0,
          textShadow: "2px 2px 4px rgba(139, 69, 19, 0.1)"
        }}>
          📋 สรุปออเดอร์
        </h1>
      </div>

      {/* Error message if using mock data */}
      {error && order && (
        <div style={{
          background: "#FEF3CD",
          border: "1px solid #F59E0B",
          borderRadius: theme.borderRadius.lg,
          padding: "12px 16px",
          margin: "0 auto 24px",
          maxWidth: "500px",
          textAlign: "center",
          color: "#92400E",
          fontSize: theme.fonts.sizes.sm
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Order Details Card */}
      <div style={{ 
        maxWidth: "500px", 
        margin: "0 auto", 
        background: theme.colors.surface, 
        borderRadius: theme.borderRadius.xl, 
        boxShadow: theme.shadows.xl, 
        padding: "32px" 
      }}>
        {/* Order ID and Status */}
        <div style={{ 
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: `2px solid ${theme.colors.background}`
        }}>
          <div style={{ 
            fontSize: theme.fonts.sizes.xl, 
            fontWeight: 700, 
            color: theme.colors.text, 
            marginBottom: "8px" 
          }}>
            Order ID: <span style={{ color: theme.colors.primary }}>{order.orderId}</span>
          </div>
          
          {order.status && (
            <div style={{
              display: "inline-block",
              background: getStatusColor(order.status),
              color: "white",
              padding: "6px 12px",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.sizes.sm,
              fontWeight: 600
            }}>
              {getStatusText(order.status)}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
            fontWeight: 600,
            marginBottom: "16px"
          }}>
            รายการสินค้า
          </h3>
          
          <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
            {order.items.map((item, idx) => (
              <li 
                key={idx} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: idx < order.items.length - 1 ? `1px solid ${theme.colors.background}` : "none"
                }}
              >
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: theme.colors.text,
                    fontSize: theme.fonts.sizes.md
                  }}>
                    {item.name}
                  </div>
                  <div style={{ 
                    color: theme.colors.textLight, 
                    fontSize: theme.fonts.sizes.sm 
                  }}>
                    จำนวน: {item.qty}
                  </div>
                </div>
                <div style={{ 
                  fontWeight: 700, 
                  color: theme.colors.primary,
                  fontSize: theme.fonts.sizes.md
                }}>
                  ฿{(item.price * item.qty).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div style={{ 
          borderTop: `3px solid ${theme.colors.primary}`, 
          paddingTop: "16px",
          textAlign: "right" 
        }}>
          <div style={{ 
            fontWeight: 700, 
            color: theme.colors.primary, 
            fontSize: theme.fonts.sizes["2xl"]
          }}>
            รวมทั้งสิ้น: ฿{order.total.toLocaleString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          marginTop: "24px",
          display: "flex",
          gap: "12px",
          justifyContent: "center"
        }}>
          <button
            onClick={() => navigate("/menu")}
            style={{
              background: theme.colors.surface,
              color: theme.colors.primary,
              border: `2px solid ${theme.colors.primary}`,
              padding: "12px 24px",
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.fonts.sizes.md,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: theme.fonts.primary,
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = theme.colors.background;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = theme.colors.surface;
            }}
          >
            🍴 สั่งเพิ่ม
          </button>
          
          {orderId && (
            <button
              onClick={() => navigate(`/track/${orderId}`)}
              style={{
                background: theme.colors.primary,
                color: theme.colors.surface,
                border: "none",
                padding: "12px 24px",
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.fonts.sizes.md,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: theme.fonts.primary,
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = theme.colors.secondary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = theme.colors.primary;
              }}
            >
              📍 ติดตามออเดอร์
            </button>
          )}
        </div>

        {/* Order Time */}
        {order.createdAt && (
          <div style={{
            marginTop: "16px",
            textAlign: "center",
            color: theme.colors.textLight,
            fontSize: theme.fonts.sizes.sm
          }}>
            สั่งเมื่อ: {new Date(order.createdAt).toLocaleString('th-TH')}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
