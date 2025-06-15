import React from 'react';

const statusColors = {
  pending: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrderStatusBadge = ({
  status,
}: {
  status: keyof typeof statusColors;
}) => (
  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default OrderStatusBadge;
