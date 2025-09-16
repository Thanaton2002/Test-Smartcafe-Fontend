import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  menuid: number;
  name: string;
  price: number;
  img: string;
  quantity: number;
  note?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (menuid: number, quantity: number) => void;
  removeItem: (menuid: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItem) => {
        const existingItem = get().items.find(i => i.menuid === item.menuid);
        if (existingItem) {
          set(state => ({
            items: state.items.map(i => 
              i.menuid === item.menuid 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }));
        } else {
          set(state => ({ items: [...state.items, item] }));
        }
      },
      updateQuantity: (menuid: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(menuid);
          return;
        }
        set(state => ({
          items: state.items.map(i => 
            i.menuid === menuid ? { ...i, quantity } : i
          )
        }));
      },
      removeItem: (menuid: number) => {
        set(state => ({
          items: state.items.filter(i => i.menuid !== menuid)
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }),
    { name: 'cart-storage' }
  )
);