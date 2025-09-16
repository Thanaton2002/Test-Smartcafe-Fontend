import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import publicApi from "../api/public.api";
import { theme } from "../components/Theme";
import { getStoredOrders, type StoredOrder } from "../utils/orderStorage";

const TrackOrderPage: React.FC = () => {
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(paramOrderId || "");
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paramOrderId) {
      handleTrack(paramOrderId);
    }
  }, [paramOrderId]);

  const handleTrack = async (id?: string) => {
    const searchId = id || orderId;
    if (!searchId.trim()) {
      setError("กรุณากรอก Order ID");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);
    
    try {
      console.log("🔄 Tracking order:", searchId);
      
      // Try API first
      const response = await publicApi.getOrder(searchId);
      console.log("✅ Order tracking API response:", response.data);
      
      if (response.data?.data) {
        setOrder({
          orderId: response.data.data.id || searchId,
          totalAmount: response.data.data.totalPrice || 0,
          totalItems: response.data.data.items?.length || 0,
          status: response.data.data.status || 'preparing',
          createdAt: response.data.data.createdAt || new Date().toISOString(),
          items: response.data.data.items || []
        });
      } else {
        throw new Error("Invalid response");
      }
    } catch (apiError) {
      console.log("❌ API failed, checking localStorage...");
      
      // Fallback to localStorage
      const localOrders = getStoredOrders();
      const foundOrder = localOrders.find(o => o.orderId === searchId);
      
      if (foundOrder) {
        console.log("✅ Found order in localStorage:", foundOrder);
        setOrder(foundOrder);
      } else {
        console.log("❌ Order not found:", searchId);
        setError("ไม่พบคำสั่งซื้อนี้ กรุณาตรวจสอบหมายเลขคำสั่งซื้อ");
      }
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

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'preparing': return 33;
      case 'ready': return 66;
      case 'completed': return 100;
      default: return 10;
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: theme.colors.gradient.secondary,
      fontFamily: theme.fonts.primary,
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "40px"
      }}>
        <button
          onClick={() => navigate("/menu")}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.full,
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: theme.shadows.md,
            fontSize: "18px"
          }}
        >
          ←
        </button>
        
        <h1 style={{ 
          color: theme.colors.primary, 
          fontWeight: theme.fonts.weights.bold, 
          fontSize: theme.fonts.sizes["4xl"],
          margin: "0 0 8px 0",
          textShadow: "2px 2px 4px rgba(139, 69, 19, 0.1)"
        }}>
          📍 ติดตามออเดอร์
        </h1>
        <p style={{
          color: theme.colors.textLight,
          fontSize: theme.fonts.sizes.lg,
          margin: 0
        }}>
          ตรวจสอบสถานะการสั่งซื้อของคุณ
        </p>
      </div>

      {/* Search Card */}
      <div style={{ 
        maxWidth: "500px", 
        margin: "0 auto 32px", 
        background: theme.colors.surface, 
        borderRadius: theme.borderRadius["2xl"], 
        boxShadow: theme.shadows.xl, 
        padding: "32px",
        border: `1px solid ${theme.colors.border}`
      }}>
        <div style={{
          marginBottom: "24px"
        }}>
          <label style={{
            display: "block",
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.md,
            fontWeight: theme.fonts.weights.medium,
            marginBottom: "8px"
          }}>
            Order ID
          </label>
          <input
            type="text"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="กรอก Order ID (เช่น SC-12345678)"
            style={{ 
              width: "100%", 
              padding: "14px 16px", 
              borderRadius: theme.borderRadius.lg, 
              border: `2px solid ${theme.colors.border}`,
              fontSize: theme.fonts.sizes.md,
              fontFamily: theme.fonts.primary,
              outline: "none",
              transition: `border-color ${theme.animations.duration.normal}`,
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border;
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleTrack();
              }
            }}
          />
        </div>
        
        <button 
          onClick={() => handleTrack()}
          disabled={loading}
          style={{ 
            background: loading ? theme.colors.textMuted : theme.colors.gradient.primary,
            color: theme.colors.surface, 
            border: "none", 
            borderRadius: theme.borderRadius.lg, 
            padding: "16px 24px", 
            fontWeight: theme.fonts.weights.semibold, 
            fontSize: theme.fonts.sizes.md,
            fontFamily: theme.fonts.primary,
            width: "100%",
            cursor: loading ? "not-allowed" : "pointer",
            transition: `all ${theme.animations.duration.normal}`,
            boxShadow: loading ? "none" : theme.shadows.md,
            transform: loading ? "none" : "translateY(0px)"
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }
          }}
        >
          {loading ? "🔄 กำลังค้นหา..." : "🔍 ค้นหาออเดอร์"}
        </button>

        {/* Error Message */}
        {error && !order && (
          <div style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "#FEF2F2",
            border: `1px solid ${theme.colors.error}`,
            borderRadius: theme.borderRadius.lg,
            color: theme.colors.error,
            fontSize: theme.fonts.sizes.sm,
            textAlign: "center"
          }}>
            ❌ {error}
          </div>
        )}
      </div>

      {/* Order Result */}
      {order && (
        <div style={{ 
          maxWidth: "500px", 
          margin: "0 auto", 
          background: theme.colors.surface, 
          borderRadius: theme.borderRadius["2xl"], 
          boxShadow: theme.shadows.xl, 
          padding: "32px",
          border: `1px solid ${theme.colors.border}`,
          animation: "fadeIn 0.5s ease-in-out"
        }}>
          {/* Warning for mock data */}
          {error && (
            <div style={{
              background: "#FEF3CD",
              border: `1px solid ${theme.colors.warning}`,
              borderRadius: theme.borderRadius.lg,
              padding: "12px 16px",
              marginBottom: "24px",
              textAlign: "center",
              color: "#92400E",
              fontSize: theme.fonts.sizes.sm
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Order Header */}
          <div style={{
            textAlign: "center",
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: `2px solid ${theme.colors.background}`
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px"
            }}>
              ☕
            </div>
            <h2 style={{ 
              color: theme.colors.primary, 
              fontSize: theme.fonts.sizes["2xl"],
              fontWeight: theme.fonts.weights.bold,
              margin: "0 0 8px 0"
            }}>
              Order #{order.orderId}
            </h2>
            <div style={{
              display: "inline-block",
              background: getStatusColor(order.status),
              color: theme.colors.surface,
              padding: "8px 16px",
              borderRadius: theme.borderRadius.full,
              fontSize: theme.fonts.sizes.sm,
              fontWeight: theme.fonts.weights.semibold
            }}>
              {getStatusText(order.status)}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              background: theme.colors.background,
              borderRadius: theme.borderRadius.full,
              height: "8px",
              overflow: "hidden",
              marginBottom: "16px"
            }}>
              <div style={{
                background: theme.colors.gradient.primary,
                height: "100%",
                width: `${getProgressPercentage(order.status)}%`,
                borderRadius: theme.borderRadius.full,
                transition: `width ${theme.animations.duration.slow}`,
                animation: "progressAnimation 1s ease-in-out"
              }} />
            </div>
            
            {/* Progress Steps */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: theme.fonts.sizes.xs,
              color: theme.colors.textLight
            }}>
              <span style={{ color: getProgressPercentage(order.status) >= 33 ? theme.colors.primary : theme.colors.textMuted }}>
                📝 รับออเดอร์
              </span>
              <span style={{ color: getProgressPercentage(order.status) >= 66 ? theme.colors.primary : theme.colors.textMuted }}>
                🔄 กำลังทำ
              </span>
              <span style={{ color: getProgressPercentage(order.status) >= 100 ? theme.colors.primary : theme.colors.textMuted }}>
                ✅ เสร็จแล้ว
              </span>
            </div>
          </div>

          {/* Order Details */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{
              color: theme.colors.text,
              fontSize: theme.fonts.sizes.lg,
              fontWeight: theme.fonts.weights.semibold,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              🛒 รายการสินค้า
            </h3>
            
            {order.items.map((item, idx) => (
              <div 
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
                    fontWeight: theme.fonts.weights.medium,
                    color: theme.colors.text,
                    fontSize: theme.fonts.sizes.md
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    color: theme.colors.textLight,
                    fontSize: theme.fonts.sizes.sm
                  }}>
                    จำนวน: {item.quantity}
                  </div>
                </div>
                <div style={{
                  fontWeight: theme.fonts.weights.semibold,
                  color: theme.colors.primary,
                  fontSize: theme.fonts.sizes.md
                }}>
                  ฿{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            background: theme.colors.background,
            borderRadius: theme.borderRadius.lg,
            padding: "20px",
            marginBottom: "24px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px"
            }}>
              <span style={{ color: theme.colors.textLight }}>จำนวนสินค้า</span>
              <span style={{ fontWeight: theme.fonts.weights.medium }}>{order.totalItems} รายการ</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
              borderTop: `1px solid ${theme.colors.border}`
            }}>
              <span style={{ 
                fontSize: theme.fonts.sizes.lg,
                fontWeight: theme.fonts.weights.semibold,
                color: theme.colors.text 
              }}>
                ยอดรวม
              </span>
              <span style={{ 
                fontSize: theme.fonts.sizes.xl,
                fontWeight: theme.fonts.weights.bold,
                color: theme.colors.primary 
              }}>
                ฿{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Order Time */}
          <div style={{
            textAlign: "center",
            color: theme.colors.textLight,
            fontSize: theme.fonts.sizes.sm,
            marginBottom: "24px"
          }}>
            🕒 สั่งเมื่อ: {new Date(order.createdAt).toLocaleString('th-TH')}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "12px"
          }}>
            <button
              onClick={() => navigate("/menu")}
              style={{
                flex: 1,
                background: theme.colors.surface,
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`,
                padding: "14px 20px",
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.fonts.sizes.md,
                fontWeight: theme.fonts.weights.semibold,
                cursor: "pointer",
                fontFamily: theme.fonts.primary,
                transition: `all ${theme.animations.duration.normal}`
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
            
            <button
              onClick={() => navigate("/order-history")}
              style={{
                flex: 1,
                background: theme.colors.gradient.primary,
                color: theme.colors.surface,
                border: "none",
                padding: "14px 20px",
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.fonts.sizes.md,
                fontWeight: theme.fonts.weights.semibold,
                cursor: "pointer",
                fontFamily: theme.fonts.primary,
                transition: `all ${theme.animations.duration.normal}`,
                boxShadow: theme.shadows.md
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = theme.shadows.lg;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
            >
              📋 ประวัติออเดอร์
            </button>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes progressAnimation {
            from { width: 0%; }
          }
        `}
      </style>
    </div>
  );
};

export default TrackOrderPage;
