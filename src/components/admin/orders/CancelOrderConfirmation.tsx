import { FaTimes, FaSpinner } from 'react-icons/fa';
import { useState } from 'react';

const CancelOrderConfirmation = ({
  trackingCode,
  onClose,
  onConfirm,
  cancelling,
}: {
  trackingCode: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  cancelling: boolean;
}) => {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200]">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Cancel Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={cancelling}
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-4">
          <p>
            Are you sure you want to cancel the order with tracking code:
            <span className="font-semibold text-red-600"> {trackingCode}</span>?
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="block w-full px-4 py-3 rounded-lg border border-blue-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 transition-all"
            placeholder="Enter the reason for cancellation"
            disabled={cancelling}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={cancelling}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            No, Keep Order
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={cancelling || reason.trim() === ''}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 flex items-center justify-center"
          >
            {cancelling ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                Cancelling...
              </>
            ) : (
              'Yes, Cancel Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderConfirmation;
