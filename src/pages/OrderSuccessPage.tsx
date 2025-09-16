import { useParams, useNavigate } from "react-router-dom";
import { theme } from "../components/Theme";
import { useEffect, useState } from "react";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate("/menu");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: theme.colors.gradient.secondary,
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: theme.fonts.primary
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: theme.colors.surface,
        borderRadius: theme.borderRadius['3xl'],
        padding: '48px 40px',
        boxShadow: theme.shadows['2xl'],
        textAlign: 'center',
        border: `1px solid ${theme.colors.border}`,
        animation: 'successBounce 0.6s ease-out'
      }}>
        {/* Animated Success Icon */}
        <div style={{
          fontSize: '80px',
          marginBottom: '24px',
          animation: 'checkmarkPop 0.5s ease-in-out 0.2s both'
        }}>
          🎉
        </div>

        <div style={{
          fontSize: '60px',
          marginBottom: '32px',
          animation: 'checkmarkPop 0.5s ease-in-out 0.4s both'
        }}>
          ✅
        </div>

        <h1 style={{
          fontSize: theme.fonts.sizes['4xl'],
          fontWeight: theme.fonts.weights.bold,
          color: theme.colors.primary,
          marginBottom: '12px',
          textShadow: '2px 2px 4px rgba(139, 69, 19, 0.1)'
        }}>
          สั่งซื้อสำเร็จ!
        </h1>

        <p style={{
          color: theme.colors.textLight,
          fontSize: theme.fonts.sizes.lg,
          marginBottom: '32px',
          fontWeight: theme.fonts.weights.medium
        }}>
          Order Successfully Placed! 🚀
        </p>

        {/* Order ID Card */}
        <div style={{
          background: theme.colors.gradient.accent,
          borderRadius: theme.borderRadius.xl,
          padding: '24px',
          marginBottom: '32px',
          boxShadow: theme.shadows.inner,
          border: `2px solid ${theme.colors.primary}`
        }}>
          <div style={{
            color: theme.colors.primary,
            fontSize: theme.fonts.sizes.sm,
            fontWeight: theme.fonts.weights.medium,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Order ID
          </div>
          <div style={{
            fontSize: theme.fonts.sizes.xl,
            fontWeight: theme.fonts.weights.bold,
            color: theme.colors.text,
            fontFamily: 'monospace',
            letterSpacing: '1px'
          }}>
            {orderId || 'SC-' + Date.now().toString().slice(-8)}
          </div>
        </div>

        {/* Status Message */}
        <div style={{
          background: '#E8F5E8',
          borderRadius: theme.borderRadius.lg,
          padding: '20px',
          marginBottom: '32px',
          border: `1px solid ${theme.colors.success}`
        }}>
          <div style={{
            color: theme.colors.success,
            fontSize: theme.fonts.sizes.md,
            fontWeight: theme.fonts.weights.semibold,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>🔄</span>
            <span>กำลังดำเนินการ</span>
          </div>
          <p style={{
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.sm,
            margin: 0,
            lineHeight: 1.5
          }}>
            ออเดอร์ของคุณได้รับการยืนยันแล้ว<br/>
            เรากำลังเตรียมเครื่องดื่มอร่อย ๆ ให้คุณ ☕️
          </p>
        </div>

        {/* Estimated Time */}
        <div style={{
          background: theme.colors.background,
          borderRadius: theme.borderRadius.lg,
          padding: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            color: theme.colors.primary,
            fontSize: theme.fonts.sizes.sm,
            fontWeight: theme.fonts.weights.semibold,
            marginBottom: '4px'
          }}>
            ⏱️ เวลาการเตรียม
          </div>
          <div style={{
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
            fontWeight: theme.fonts.weights.bold
          }}>
            15-20 นาที
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate(`/track/${orderId || ''}`)}
            disabled={!orderId}
            style={{
              background: theme.colors.gradient.primary,
              color: theme.colors.surface,
              border: 'none',
              borderRadius: theme.borderRadius.xl,
              padding: '16px 24px',
              fontSize: theme.fonts.sizes.lg,
              fontWeight: theme.fonts.weights.semibold,
              cursor: 'pointer',
              fontFamily: theme.fonts.primary,
              boxShadow: theme.shadows.lg,
              transition: `all ${theme.animations.duration.normal}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.xl;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
          >
            <span>📍</span>
            <span>ติดตามออเดอร์</span>
          </button>

          <button
            onClick={() => navigate("/menu")}
            style={{
              background: theme.colors.surface,
              color: theme.colors.primary,
              border: `2px solid ${theme.colors.primary}`,
              borderRadius: theme.borderRadius.xl,
              padding: '16px 24px',
              fontSize: theme.fonts.sizes.md,
              fontWeight: theme.fonts.weights.semibold,
              cursor: 'pointer',
              fontFamily: theme.fonts.primary,
              transition: `all ${theme.animations.duration.normal}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = theme.colors.background;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = theme.colors.surface;
            }}
          >
            <span>🍴</span>
            <span>สั่งเพิ่ม</span>
          </button>
        </div>

        {/* Auto redirect countdown */}
        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: theme.colors.background,
          borderRadius: theme.borderRadius.lg,
          fontSize: theme.fonts.sizes.sm,
          color: theme.colors.textLight
        }}>
          🔄 จะกลับไปหน้าเมนูในอีก {countdown} วินาที
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes successBounce {
            0% { opacity: 0; transform: scale(0.3) translateY(100px); }
            50% { transform: scale(1.05) translateY(-10px); }
            70% { transform: scale(0.9) translateY(0px); }
            100% { opacity: 1; transform: scale(1) translateY(0px); }
          }
          
          @keyframes checkmarkPop {
            0% { opacity: 0; transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default OrderSuccessPage;