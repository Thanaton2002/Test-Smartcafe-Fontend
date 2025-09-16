// filepath: src/hooks/useAuth.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../stores/admin.store";
import publicApi from "../api/public.api";
import type { LoginCredentials } from "../types";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const setAccessToken = useAdminStore((s: any) => s.setAccessToken);
  const accessToken = useAdminStore((s: any) => s.accessToken);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    console.log("🔄 Attempting admin login...");
    
    try {
      const response = await publicApi.login(credentials);
      console.log("✅ Login API response:", response);
      
      if (response.data?.accessToken || response.data?.token) {
        const token = response.data.accessToken || response.data.token;
        setAccessToken(token);
        navigate("/admin/dashboard");
        return true;
      }
      
      throw new Error("ไม่พบ Access Token ในการตอบกลับ");
    } catch (apiError: any) {
      console.error("❌ Login failed:", apiError);
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('admin-storage');
    navigate("/admin/login");
  };

  const isAuthenticated = !!accessToken;

  return {
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };
};