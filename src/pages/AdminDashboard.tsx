import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../stores/admin.store";
import { theme } from "../components/Theme";
import { getStoredOrders, updateOrderStatus, type StoredOrder } from "../utils/orderStorage";
import privateApi from "../api/private.api";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'orders' | 'stats'>('orders');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    console.log("🔄 Loading orders for admin dashboard...");
    
    try {
      // Try to load from API first
      const response = await privateApi.getAllOrders();
      console.log("✅ Admin orders API response:", response.data);
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.log("📱 API failed, loading from localStorage...");
      // Fallback to localStorage only
      const localOrders = getStoredOrders();
      
      setOrders(localOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log("🔄 Admin logging out...");
    // Clear admin token
    const setAccessToken = useAdminStore.getState().setAccessToken;
    setAccessToken("");
    navigate("/admin/login");
  };

  const handleStatusUpdate = async (orderId: string, newStatus: StoredOrder['status']) => {
    console.log(`🔄 Updating order ${orderId} status to: ${newStatus}`);
    
    try {
      // Try to update via API first
      await privateApi.updateOrderStatus(orderId, newStatus);
      console.log(`✅ Order ${orderId} status updated via API`);
    } catch (error) {
      console.log("📱 API failed, updating localStorage only...", error);
    }
    
    // Update in local state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
    
    // Also update in localStorage as backup
    updateOrderStatus(orderId, newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#F59E0B'; // Orange
      case 'ready': return '#10B981'; // Green
      case 'completed': return '#6B7280'; // Gray
      case 'cancelled': return '#EF4444'; // Red
      default: return theme.colors.textLight;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'กำลังเตรียม';
      case 'ready': return 'พร้อมรับ';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', { 
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      preparingOrders: orders.filter(o => o.status === 'preparing').length,
      readyOrders: orders.filter(o => o.status === 'ready').length,
      totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + order.totalAmount, 0),
      todayRevenue: todayOrders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + order.totalAmount, 0)
    };
  };

  const stats = calculateStats();

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
      fontFamily: theme.fonts.primary,
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: "24px",
        marginBottom: "24px",
        boxShadow: theme.shadows.md,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h1 style={{
            color: theme.colors.primary,
            fontSize: theme.fonts.sizes["3xl"],
            fontWeight: "700",
            margin: "0 0 8px 0"
          }}>
            👨‍💼 Admin Dashboard
          </h1>
          <p style={{
            color: theme.colors.textLight,
            fontSize: theme.fonts.sizes.md,
            margin: 0
          }}>
            SmartCafe - ระบบจัดการสำหรับพนักงาน
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: `2px solid ${theme.colors.textLight}`,
              color: theme.colors.textLight,
              padding: "10px 20px",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.sizes.sm,
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            👥 หน้าลูกค้า
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              background: "#EF4444",
              border: "none",
              color: "white",
              padding: "10px 20px",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.sizes.sm,
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: theme.shadows.sm,
              transition: "all 0.3s ease"
            }}
          >
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: "8px",
        marginBottom: "24px",
        boxShadow: theme.shadows.sm,
        display: "flex",
        gap: "8px"
      }}>
        <button
          onClick={() => setSelectedTab('orders')}
          style={{
            background: selectedTab === 'orders' ? theme.colors.primary : 'transparent',
            color: selectedTab === 'orders' ? 'white' : theme.colors.textLight,
            border: 'none',
            padding: '12px 24px',
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fonts.sizes.md,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          📋 จัดการออเดอร์
        </button>
        
        <button
          onClick={() => setSelectedTab('stats')}
          style={{
            background: selectedTab === 'stats' ? theme.colors.primary : 'transparent',
            color: selectedTab === 'stats' ? 'white' : theme.colors.textLight,
            border: 'none',
            padding: '12px 24px',
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fonts.sizes.md,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          📊 สถิติ
        </button>
      </div>

      {/* Stats Tab */}
      {selectedTab === 'stats' && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "24px"
        }}>
          <div style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: "24px",
            boxShadow: theme.shadows.md,
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📈</div>
            <h3 style={{ color: theme.colors.text, margin: "0 0 8px 0" }}>ออเดอร์ทั้งหมด</h3>
            <p style={{ color: theme.colors.primary, fontSize: theme.fonts.sizes["2xl"], fontWeight: "700", margin: 0 }}>
              {stats.totalOrders}
            </p>
          </div>

          <div style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: "24px",
            boxShadow: theme.shadows.md,
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📅</div>
            <h3 style={{ color: theme.colors.text, margin: "0 0 8px 0" }}>ออเดอร์วันนี้</h3>
            <p style={{ color: theme.colors.accent, fontSize: theme.fonts.sizes["2xl"], fontWeight: "700", margin: 0 }}>
              {stats.todayOrders}
            </p>
          </div>

          <div style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: "24px",
            boxShadow: theme.shadows.md,
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>👨‍🍳</div>
            <h3 style={{ color: theme.colors.text, margin: "0 0 8px 0" }}>กำลังเตรียม</h3>
            <p style={{ color: "#F59E0B", fontSize: theme.fonts.sizes["2xl"], fontWeight: "700", margin: 0 }}>
              {stats.preparingOrders}
            </p>
          </div>

          <div style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: "24px",
            boxShadow: theme.shadows.md,
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✅</div>
            <h3 style={{ color: theme.colors.text, margin: "0 0 8px 0" }}>พร้อมรับ</h3>
            <p style={{ color: "#10B981", fontSize: theme.fonts.sizes["2xl"], fontWeight: "700", margin: 0 }}>
              {stats.readyOrders}
            </p>
          </div>

          <div style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: "24px",
            boxShadow: theme.shadows.md,
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>💰</div>
            <h3 style={{ color: theme.colors.text, margin: "0 0 8px 0" }}>ยอดขายรวม</h3>
            <p style={{ color: theme.colors.primary, fontSize: theme.fonts.sizes["2xl"], fontWeight: "700", margin: 0 }}>
              ฿{stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: "24px",
            boxShadow: theme.shadows.md,
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📊</div>
            <h3 style={{ color: theme.colors.text, margin: "0 0 8px 0" }}>ยอดขายวันนี้</h3>
            <p style={{ color: theme.colors.accent, fontSize: theme.fonts.sizes["2xl"], fontWeight: "700", margin: 0 }}>
              ฿{stats.todayRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {selectedTab === 'orders' && (
        <div style={{
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: "24px",
          boxShadow: theme.shadows.md
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <h2 style={{
              color: theme.colors.text,
              fontSize: theme.fonts.sizes["2xl"],
              fontWeight: "600",
              margin: 0
            }}>
              รายการออเดอร์
            </h2>
            
            <button
              onClick={loadOrders}
              disabled={loading}
              style={{
                background: theme.colors.accent,
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.sizes.sm,
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.3s ease"
              }}
            >
              {loading ? "🔄 กำลังโหลด..." : "🔄 รีเฟรช"}
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: theme.colors.textLight }}>
              <div style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: `3px solid ${theme.colors.primary}`,
                borderTop: `3px solid transparent`,
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              <p>กำลังโหลดออเดอร์...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: theme.colors.textLight }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📋</div>
              <h3 style={{ margin: "0 0 12px 0" }}>ไม่มีออเดอร์</h3>
              <p style={{ margin: 0 }}>รอออเดอร์จากลูกค้า...</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gap: "16px"
            }}>
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  style={{
                    border: `2px solid ${theme.colors.background}`,
                    borderRadius: theme.borderRadius.md,
                    padding: "20px",
                    transition: "all 0.3s ease",
                    background: "white"
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}>
                    <div>
                      <h3 style={{
                        color: theme.colors.text,
                        fontSize: theme.fonts.sizes.lg,
                        fontWeight: "700",
                        margin: "0 0 8px 0"
                      }}>
                        Order #{order.orderId}
                      </h3>
                      <p style={{
                        color: theme.colors.textLight,
                        fontSize: theme.fonts.sizes.sm,
                        margin: 0
                      }}>
                        {formatTime(order.createdAt)}
                      </p>
                    </div>
                    
                    <div style={{
                      background: getStatusColor(order.status),
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: theme.borderRadius.sm,
                      fontSize: theme.fonts.sizes.sm,
                      fontWeight: "600"
                    }}>
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{
                    background: theme.colors.background,
                    borderRadius: theme.borderRadius.sm,
                    padding: "12px",
                    marginBottom: "16px"
                  }}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: index < order.items.length - 1 ? `1px solid ${theme.colors.surface}` : "none"
                      }}>
                        <div>
                          <span style={{ color: theme.colors.text, fontWeight: "600" }}>
                            {item.name}
                          </span>
                          {item.note && (
                            <span style={{ color: theme.colors.textLight, fontSize: theme.fonts.sizes.sm }}>
                              <br/>หมายเหตุ: {item.note}
                            </span>
                          )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ color: theme.colors.text }}>
                            x{item.quantity}
                          </div>
                          <div style={{ color: theme.colors.primary, fontWeight: "600" }}>
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total & Actions */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}>
                    <div style={{
                      color: theme.colors.primary,
                      fontSize: theme.fonts.sizes.lg,
                      fontWeight: "700"
                    }}>
                      รวม: ฿{order.totalAmount.toLocaleString()}
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderId, 'ready')}
                          style={{
                            background: "#10B981",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: theme.borderRadius.sm,
                            fontSize: theme.fonts.sizes.sm,
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                        >
                          ✅ เสร็จแล้ว
                        </button>
                      )}
                      
                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderId, 'completed')}
                          style={{
                            background: "#6B7280",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: theme.borderRadius.sm,
                            fontSize: theme.fonts.sizes.sm,
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                        >
                          📦 ส่งมอบแล้ว
                        </button>
                      )}
                      
                      {(order.status === 'preparing' || order.status === 'ready') && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderId, 'cancelled')}
                          style={{
                            background: "#EF4444",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: theme.borderRadius.sm,
                            fontSize: theme.fonts.sizes.sm,
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                        >
                          ❌ ยกเลิก
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;