import {
  FaCheckCircle,
  FaClock,
  FaHistory,
  FaShippingFast,
  FaBoxOpen,
  FaMoneyBillAlt,
  FaTimesCircle,
} from 'react-icons/fa';

const statusIcons: Record<string, JSX.Element> = {
  Pending: <FaClock />,
  Paid: <FaMoneyBillAlt />,
  Shipped: <FaShippingFast />,
  Delivered: <FaBoxOpen />,
  Cancelled: <FaTimesCircle />,
};

const OrderStatusTimeline = ({ order }: { order: any }) => {
  const statusFlow = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

  // Extract all statuses from order processes
  const processStatuses = order.orderProcesses.map((p: any) => {
    const [status] = p.process.split(' - ');
    return status;
  });

  // Get all unique statuses that have occurred, in order of the statusFlow
  const occurredStatuses = statusFlow.filter((status) =>
    processStatuses.includes(status)
  );

  const currentStatus = order.orderStatus;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaHistory className="mr-2 text-blue-600" />
        Order Progress
      </h2>

      <div className="relative">
        <div className="absolute h-1 mt-2 bg-gray-200 top-1/2 left-4 right-4 -translate-y-1/2 z-0"></div>

        <div className="relative flex justify-between z-10">
          {statusFlow.map((status) => {
            const isCompleted = occurredStatuses.includes(status);
            const isCurrent = status === currentStatus;

            const process = order.orderProcesses.find((p: any) =>
              p.process.startsWith(status)
            );

            const processDate = process?.date ? new Date(process.date) : null;

            return (
              <div
                key={status}
                className="flex flex-col items-center w-1/5 text-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white border-green-600'
                      : isCurrent
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}
                  title={status}
                >
                  {isCompleted ? (
                    <FaCheckCircle className="w-5 h-5" />
                  ) : (
                    statusIcons[status]
                  )}
                </div>

                <span
                  className={`text-sm font-semibold ${
                    isCompleted
                      ? 'text-green-700'
                      : isCurrent
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {status}
                </span>

                {processDate && (
                  <span className="text-xs text-gray-400 mt-1">
                    {processDate.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
