// Utility functions for managing orders in localStorage

export interface StoredOrder {
  orderId: string;
  totalAmount: number;
  totalItems: number;
  status: 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    note?: string;
  }>;
}

const ORDERS_STORAGE_KEY = 'smartcafe_orders';

export const getStoredOrders = (): StoredOrder[] => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get stored orders:', error);
    return [];
  }
};

export const addNewOrder = (order: StoredOrder): void => {
  try {
    const existingOrders = getStoredOrders();
    const updatedOrders = [order, ...existingOrders]; // Add new order at the beginning
    
    // Keep only last 20 orders to avoid localStorage bloat
    const trimmedOrders = updatedOrders.slice(0, 20);
    
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(trimmedOrders));
    console.log('✅ Order saved to localStorage:', order.orderId);
  } catch (error) {
    console.error('Failed to save order to localStorage:', error);
  }
};

export const updateOrderStatus = (orderId: string, status: StoredOrder['status']): void => {
  try {
    const orders = getStoredOrders();
    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      console.log(`✅ Order ${orderId} status updated to: ${status}`);
    }
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
};

export const clearAllOrders = (): void => {
  try {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    console.log('✅ All orders cleared from localStorage');
  } catch (error) {
    console.error('Failed to clear orders:', error);
  }
};