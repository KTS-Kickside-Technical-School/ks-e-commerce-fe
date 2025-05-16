import { FaCheckCircle, FaCircle } from 'react-icons/fa';

interface StatusTimelineProps {
  currentStatus: string;
  newStatus: string;
  onStatusChange: (status: string) => void;
}

const statusFlow = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

const StatusTimeline = ({
  currentStatus,
  newStatus,
  onStatusChange,
}: StatusTimelineProps) => {
  const currentIndex = statusFlow.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Order Status</h3>
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

        {statusFlow.map((status, index) => {
          const isCompleted = index <= statusFlow.indexOf(newStatus);
          // const isCurrent = status === currentStatus;
          const isSelectable = index >= currentIndex && status !== 'Cancelled';

          return (
            <div
              key={status}
              className="relative z-10 flex flex-col items-center"
            >
              <button
                type="button"
                onClick={() => isSelectable && onStatusChange(status)}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  isCompleted
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                } ${
                  isSelectable
                    ? 'cursor-pointer hover:bg-blue-200'
                    : 'cursor-not-allowed'
                } transition-colors`}
                disabled={!isSelectable}
              >
                {isCompleted ? (
                  <FaCheckCircle className="w-4 h-4" />
                ) : (
                  <FaCircle className="w-2 h-2" />
                )}
              </button>
              <span
                className={`text-xs mt-1 ${
                  status === newStatus
                    ? 'font-medium text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {newStatus === currentStatus ? (
          <span>
            Current status: <strong>{currentStatus}</strong>
          </span>
        ) : (
          <span>
            Updating from <strong>{currentStatus}</strong> to{' '}
            <strong>{newStatus}</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default StatusTimeline;
