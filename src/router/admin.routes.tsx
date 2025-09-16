// filepath: src/router/admin.routes.tsx
import React from "react";
import type { RouteConfig } from "./routes.types";
import { ProtectedRoute } from "./guards";

// Lazy load admin pages
const AdminRedirect = React.lazy(() => import("../components/AdminRedirect"));
const AdminLoginPage = React.lazy(() => import("../pages/AdminLoginPage"));
const AdminDashboard = React.lazy(() => import("../pages/AdminDashboard"));
const BaristaDashboard = React.lazy(() => import("../pages/BaristaDashboard"));

export const adminRoutes: RouteConfig[] = [
  {
    path: "/admin",
    element: AdminRedirect
  },
  {
    path: "/admin/login", 
    element: AdminLoginPage
  },
  {
    path: "/admin/dashboard",
    element: () => (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    protected: true
  },
  {
    path: "/barista",
    element: () => (
      <ProtectedRoute>
        <BaristaDashboard />
      </ProtectedRoute>  
    ),
    protected: true
  }
];