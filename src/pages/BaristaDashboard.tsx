import React, { useEffect, useState } from "react";
import { privateApi } from "../api/base.api";

interface OrderItem {
  id: number;
  orderId: string;
  items: { name: string; qty: number; price: number }[];
  status: string;
  createdAt: string;
}

const BaristaDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    privateApi.get("/order")
      .then(res => setOrders(res.data.data || []))
      .catch(() => setError("โหลดออเดอร์ไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, []);

  const handleReady = async (orderId: string) => {
    try {
      await privateApi.patch(`/order/${orderId}`, { status: "Ready" });
      setOrders(orders => orders.map(o => o.orderId === orderId ? { ...o, status: "Ready" } : o));
    } catch {
      alert("เปลี่ยนสถานะไม่สำเร็จ");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f6", fontFamily: "'Noto Sans Thai', 'Prompt', sans-serif" }}>
      <h1 style={{ textAlign: "center", padding: 24, color: "#b48a78", fontWeight: 700, fontSize: 32 }}>Barista Dashboard</h1>
      {loading && <div style={{ textAlign: "center" }}>กำลังโหลดออเดอร์...</div>}
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <table style={{ width: "100%", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px #0001", overflow: "hidden" }}>
          <thead style={{ background: "#f9e2e7" }}>
            <tr>
              <th style={{ padding: 12 }}>Order ID</th>
              <th>รายการ</th>
              <th>สถานะ</th>
              <th>เวลา</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderId} style={{ textAlign: "center" }}>
                <td style={{ padding: 8 }}>{order.orderId}</td>
                <td style={{ padding: 8 }}>
                  {order.items.map((i, idx) => (
                    <div key={idx}>{i.name} x {i.qty}</div>
                  ))}
                </td>
                <td style={{ padding: 8, color: order.status === "Ready" ? "#4caf50" : "#b48a78" }}>{order.status}</td>
                <td style={{ padding: 8 }}>{new Date(order.createdAt).toLocaleTimeString()}</td>
                <td style={{ padding: 8 }}>
                  {order.status !== "Ready" && (
                    <button onClick={() => handleReady(order.orderId)} style={{ background: "#b48a78", color: "white", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}>เสร็จแล้ว</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaristaDashboard;
