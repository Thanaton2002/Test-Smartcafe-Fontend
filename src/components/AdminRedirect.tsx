// filepath: src/components/AdminRedirect.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../stores/admin.store";

const AdminRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, hydrated } = useAdminStore();

  useEffect(() => {
    // Wait for zustand to hydrate from localStorage
    if (!hydrated) return;

    if (accessToken && accessToken.trim() !== "") {
      console.log("🎯 Admin token found, redirecting to dashboard...");
      navigate("/admin/dashboard", { replace: true });
    } else {
      console.log("🔑 No admin token, redirecting to login...");
      navigate("/admin/login", { replace: true });
    }
  }, [accessToken, hydrated, navigate]);

  // Loading spinner while redirecting
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        color: 'white',
        textAlign: 'center',
        fontSize: '18px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderTop: '3px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        กำลังตรวจสอบสิทธิ์...
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminRedirect;