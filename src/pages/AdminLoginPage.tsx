import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../stores/admin.store";
import { theme } from "../components/Theme";
import publicApi from "../api/public.api";

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken } = useAdminStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log("🔄 Attempting admin login...");
    console.log("Username:", username);
    
    try {
      // Try API login first
      const response = await publicApi.login({
        username,
        password
      });
      
      console.log("✅ API Login successful:", response.data);
      
      if (response.data?.data?.accessToken) {
        setAccessToken(response.data.data.accessToken);
        console.log("🎯 Redirecting to admin dashboard...");
        navigate("/admin/dashboard");
      } else if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        navigate("/admin/dashboard");
      } else {
        throw new Error("No access token in response");
      }
      
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #8B4513 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: theme.fonts.primary
    }}>
      <div style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: "48px 40px",
        boxShadow: theme.shadows.xl,
        width: "100%",
        maxWidth: "450px",
        textAlign: "center"
      }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            fontSize: "3rem",
            marginBottom: "16px"
          }}>
            👨‍💼
          </div>
          <h1 style={{
            color: theme.colors.primary,
            fontSize: theme.fonts.sizes["3xl"],
            fontWeight: "700",
            margin: "0 0 8px 0"
          }}>
            เข้าสู่ระบบพนักงาน
          </h1>
          <p style={{
            color: theme.colors.textLight,
            fontSize: theme.fonts.sizes.md,
            margin: 0
          }}>
            SmartCafe Admin Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: theme.colors.text,
              fontSize: theme.fonts.sizes.sm,
              fontWeight: "600"
            }}>
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                border: `2px solid ${theme.colors.background}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.sizes.md,
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                backgroundColor: loading ? theme.colors.background : "white"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: theme.colors.text,
              fontSize: theme.fonts.sizes.sm,
              fontWeight: "600"
            }}>
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                border: `2px solid ${theme.colors.background}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.sizes.md,
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                backgroundColor: loading ? theme.colors.background : "white"
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              padding: "12px 16px",
              borderRadius: theme.borderRadius.md,
              marginBottom: "24px",
              fontSize: theme.fonts.sizes.sm
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? theme.colors.textLight : theme.colors.primary,
              color: "white",
              border: "none",
              padding: "16px 24px",
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.fonts.sizes.lg,
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : theme.shadows.md,
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid white",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>🔑 เข้าสู่ระบบ</>
            )}
          </button>
        </form>

        {/* Back to Customer Page */}
        <div style={{ marginTop: "24px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: theme.colors.textLight,
              fontSize: theme.fonts.sizes.sm,
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            ← กลับไปหน้าลูกค้า
          </button>
        </div>
      </div>

      {/* Add CSS animation for loading spinner */}
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

export default AdminLoginPage;
