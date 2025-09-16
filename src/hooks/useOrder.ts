// filepath: src/hooks/useOrder.ts
import { useState } from "react";
import publicApi from "../api/public.api";
import { useCartStore } from "../stores/cart.store";
import { addNewOrder } from "../utils/orderStorage";

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const placeOrder = async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    console.log("🔄 Starting order placement process...");
    
    try {
      const orderData = {
        items: items.map(item => ({
          menuid: item.menuid,
          quantity: item.quantity,
          note: item.note || ""
        })),
        totalAmount: getTotalPrice(),
        totalItems: getTotalItems()
      };

      console.log("📋 Order data being sent:", orderData);

      // Try to place order via API
      const response = await publicApi.createOrder({
        items: items.map(item => ({
          menuid: item.menuid,
          qty: item.quantity
        })),
        totalPrice: getTotalPrice()
      });
      
      console.log("✅ Order API response received:", response);
      
      let orderId: string;
      
      // Extract order ID from various possible response structures
      if (response.data?.orderId) {
        orderId = response.data.orderId;
      } else if (response.data?.data?.orderId) {
        orderId = response.data.data.orderId;
      } else if (response.data?.id) {
        orderId = response.data.id;
      } else {
        // Generate fallback order ID
        orderId = `SC${Date.now()}`;
        console.log("🔄 Generated fallback order ID:", orderId);
      }

      // Save order to localStorage for persistence
      const newOrder = {
        orderId,
        items: items.map(item => ({
          menuid: item.menuid,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          note: item.note || "",
          img: item.img
        })),
        totalAmount: getTotalPrice(),
        totalItems: getTotalItems(),
        status: "preparing" as const,
        createdAt: new Date().toISOString()
      };

      addNewOrder(newOrder);
      clearCart();
      
      console.log("✅ Order placed successfully with ID:", orderId);
      return orderId;
    } catch (error: any) {
      console.error("❌ Failed to place order:", error);
      setError("ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    placeOrder
  };
};