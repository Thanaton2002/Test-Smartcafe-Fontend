// filepath: src/router/AppRouter.tsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "../components/ui";
import { customerRoutes } from "./customer.routes";
import { adminRoutes } from "./admin.routes";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner size="lg" text="กำลังโหลดหน้าเว็บ..." />}>
        <Routes>
          {/* Customer Routes */}
          {customerRoutes.map((route, index) => (
            <Route
              key={`customer-${index}`}
              path={route.path}
              element={<route.element />}
            />
          ))}

          {/* Admin Routes */}
          {adminRoutes.map((route, index) => (
            <Route
              key={`admin-${index}`}
              path={route.path}
              element={<route.element />}
            />
          ))}

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;