// filepath: src/constants/menu.constants.ts
import type { MenuCategory } from '../types';

export const MENU_CATEGORIES: MenuCategory[] = [
  { key: "all", name: "ทั้งหมด", icon: "🍽️" },
  { key: "hot-coffee", name: "กาแฟร้อน", icon: "☕" },
  { key: "cold-coffee", name: "กาแฟเย็น", icon: "🧊" },
  { key: "tea", name: "ชา", icon: "🍵" },
  { key: "cake", name: "เค้ก", icon: "🍰" }
];

export const MENU_PRICE_RANGE = {
  MIN: 0,
  MAX: 500
} as const;