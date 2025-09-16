import React from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../components/Theme";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: `linear-gradient(135deg, ${theme.colors.background} 0%, #F5E6D3 100%)`,
      fontFamily: theme.fonts.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: "48px 32px",
        textAlign: "center",
        boxShadow: theme.shadows.lg,
        maxWidth: "500px",
        width: "100%"
      }}>
        {/* 404 Icon */}
        <div style={{
          fontSize: "4rem",
          marginBottom: "24px"
        }}>
          😵
        </div>

        <h1 style={{
          fontSize: theme.fonts.sizes["4xl"],
          fontWeight: "700",
          color: theme.colors.text,
          marginBottom: "16px"
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: theme.fonts.sizes["2xl"],
          fontWeight: "600",
          color: theme.colors.text,
          marginBottom: "16px"
        }}>
          ไม่พบหน้าที่ต้องการ
        </h2>

        <p style={{
          color: theme.colors.textLight,
          fontSize: theme.fonts.sizes.lg,
          marginBottom: "32px",
          lineHeight: "1.5"
        }}>
          ขออภัย หน้าที่คุณกำลังค้นหาไม่มีอยู่ในระบบ<br/>
          กลับไปหน้าหลักเพื่อสั่งเครื่องดื่มได้เลย!
        </p>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: theme.colors.primary,
              color: "white",
              border: "none",
              padding: "16px 32px",
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.fonts.sizes.lg,
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: theme.shadows.md,
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🏠 กลับหน้าหลัก
          </button>

          <button
            onClick={() => navigate("/orders")}
            style={{
              background: "transparent",
              color: theme.colors.primary,
              border: `2px solid ${theme.colors.primary}`,
              padding: "16px 32px",
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.fonts.sizes.lg,
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.colors.primary;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = theme.colors.primary;
            }}
          >
            📋 ประวัติการสั่งซื้อ
          </button>
        </div>

        {/* Admin Link */}
        <div style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: `1px solid ${theme.colors.background}`
        }}>
          <button
            onClick={() => navigate("/admin")}
            style={{
              background: "none",
              border: "none",
              color: theme.colors.textLight,
              fontSize: theme.fonts.sizes.md,
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            👨‍💼 สำหรับพนักงาน (Admin)
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;