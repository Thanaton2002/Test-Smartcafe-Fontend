// filepath: src/constants/order.constants.ts
import type { OrderStatus } from '../types';

export const ORDER_STATUSES: Record<OrderStatus, { 
  label: string; 
  color: string; 
  icon: string; 
}> = {
  pending: {
    label: "รอการยืนยัน",
    color: "#F59E0B",
    icon: "⏳"
  },
  confirmed: {
    label: "ยืนยันแล้ว",
    color: "#3B82F6", 
    icon: "✅"
  },
  preparing: {
    label: "กำลังทำ",
    color: "#8B5CF6",
    icon: "👨‍🍳"
  },
  ready: {
    label: "พร้อมเสิร์ฟ",
    color: "#10B981",
    icon: "🍽️"
  },
  completed: {
    label: "เสร็จสิ้น",
    color: "#6B7280",
    icon: "🎉"
  },
  cancelled: {
    label: "ยกเลิก",
    color: "#EF4444",
    icon: "❌"
  }
};

export const ORDER_ID_PREFIX = "SC" as const;
export const ORDER_STORAGE_KEY = "smartcafe_orders" as const;