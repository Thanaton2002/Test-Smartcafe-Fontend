// filepath: src/components/features/OrderStatusBadge.tsx
import React from "react";
import { Badge } from "../ui";
import { ORDER_STATUSES } from "../../constants";
import type { OrderStatus } from "../../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const statusInfo = ORDER_STATUSES[status];
  
  const getVariant = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'ready':
        return 'success';
      case 'preparing':
        return 'warning';
      case 'pending':
      case 'confirmed':
      default:
        return 'primary';
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {statusInfo.icon} {statusInfo.label}
    </Badge>
  );
};