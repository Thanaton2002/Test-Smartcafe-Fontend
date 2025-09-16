// filepath: src/router/customer.routes.tsx
import React from "react";
import type { RouteConfig } from "./routes.types";

// Lazy load pages for better performance
const MenuPage = React.lazy(() => import("../pages/MenuPage"));
const MenuDetailPage = React.lazy(() => import("../pages/MenuDetailPage"));
const CartPage = React.lazy(() => import("../pages/CartPage"));
const OrderSuccessPage = React.lazy(() => import("../pages/OrderSuccessPage"));
const OrderPage = React.lazy(() => import("../pages/OrderPage"));
const TrackOrderPage = React.lazy(() => import("../pages/TrackOrderPage"));
const OrderHistoryPage = React.lazy(() => import("../pages/OrderHistoryPage"));

export const customerRoutes: RouteConfig[] = [
  {
    path: "/",
    element: MenuPage
  },
  {
    path: "/menu",
    element: MenuPage
  },
  {
    path: "/menu/:menuid",
    element: MenuDetailPage
  },
  {
    path: "/cart",
    element: CartPage
  },
  {
    path: "/orders",
    element: OrderHistoryPage
  },
  {
    path: "/order-history",
    element: OrderHistoryPage
  },
  {
    path: "/order/:orderId",
    element: OrderPage
  },
  {
    path: "/track",
    element: TrackOrderPage
  },
  {
    path: "/track/:orderId",
    element: TrackOrderPage
  },
  {
    path: "/order-success/:orderId",
    element: OrderSuccessPage
  }
];