// filepath: src/types/order.types.ts
export interface OrderItem {
  menuid: number;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  img?: string;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export type OrderStatus = 
  | "pending"     // รอการยืนยัน
  | "confirmed"   // ยืนยันแล้ว  
  | "preparing"   // กำลังทำ
  | "ready"       // พร้อมเสิร์ฟ
  | "completed"   // เสร็จสิ้น
  | "cancelled";  // ยกเลิก

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  statusCounts: Record<OrderStatus, number>;
}