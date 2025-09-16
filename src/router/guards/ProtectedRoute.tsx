// filepath: src/router/guards/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAdminStore from "../../stores/admin.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/admin/login"
}) => {
  const accessToken = useAdminStore((s: any) => s.accessToken);
  const hydrated = useAdminStore((s: any) => s.hydrated);
  const getAccessTokenFromStorage = useAdminStore((s: any) => s.getAccessTokenFromStorage);

  React.useEffect(() => {
    if (!hydrated) {
      const token = getAccessTokenFromStorage();
      if (token) {
        useAdminStore.getState().setAccessToken(token);
      }
      useAdminStore.getState().setHydrated(true);
    }
  }, [hydrated, getAccessTokenFromStorage]);

  if (!hydrated) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center",
        minHeight: "100vh"
      }}>
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  const currentToken = accessToken || getAccessTokenFromStorage();
  
  if (!currentToken) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};