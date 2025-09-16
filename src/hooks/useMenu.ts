// filepath: src/hooks/useMenu.ts
import { useState, useEffect } from "react";
import publicApi from "../api/public.api";
import type { MenuItem } from "../types";

export const useMenu = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    console.log("🔄 Starting to fetch menu data from /menu endpoint...");
    
    try {
      const res = await publicApi.getMenus();
      console.log("✅ Menu list API response received:", res);
      
      let processedMenus: MenuItem[] = [];
      
      // Handle different API response structures
      if (res.data?.data?.menus && Array.isArray(res.data.data.menus)) {
        processedMenus = res.data.data.menus.map((item: any) => ({
          menuid: item.menuid || item.id,
          id: item.id || item.menuid,
          img: item.img || item.image,
          name: item.name,
          price: item.price,
          category: item.category
        }));
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        processedMenus = res.data.data.map((item: any) => ({
          menuid: item.menuid || item.id,
          id: item.id || item.menuid,
          img: item.img || item.image,
          name: item.name,
          price: item.price,
          category: item.category
        }));
      } else if (Array.isArray(res.data)) {
        processedMenus = res.data.map((item: any) => ({
          menuid: item.menuid || item.id,
          id: item.id || item.menuid,
          img: item.img || item.image,
          name: item.name,
          price: item.price,
          category: item.category
        }));
      }
      
      console.log("📋 Final processed menus array:", processedMenus);
      setMenu(processedMenus);
    } catch (error: any) {
      console.error("❌ Failed to load menu:", error);
      setError("ไม่สามารถโหลดเมนูได้");
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const refetch = () => {
    fetchMenu();
  };

  return {
    menu,
    loading,
    error,
    refetch
  };
};