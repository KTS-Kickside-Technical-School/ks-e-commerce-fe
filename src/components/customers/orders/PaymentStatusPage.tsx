const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const PaymentStatusBadge = ({
  status,
}: {
  status: keyof typeof paymentStatusColors;
}) => (
  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[status]}`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default PaymentStatusBadge;
