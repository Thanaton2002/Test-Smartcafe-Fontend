// filepath: src/types/menu.types.ts
export interface MenuItem {
  menuid?: number;  // For compatibility 
  id?: number;      // From API response
  img: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
}

export interface MenuCategory {
  key: string;
  name: string;
  icon: string;
}

export type MenuFilter = "all" | "hot-coffee" | "cold-coffee" | "tea" | "cake";