import React from 'react';

interface ConfirmShopModalProps {
  isOpen: boolean;
  type: 'approve' | 'reject' | 'disable' | null;
  shopId: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  onApprove: (shopId: string) => void;
  onReject: (shopId: string, reason: string) => void;
  onDisable: (shopId: string, reason: string) => void;
  onClose: () => void;
}

const ConfirmShopModal: React.FC<ConfirmShopModalProps> = ({
  isOpen,
  type,
  shopId,
  reason,
  onReasonChange,
  onApprove,
  onReject,
  onDisable,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onReasonChange(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        {type === 'approve' && (
          <>
            <h3 className="font-bold text-lg mb-4">Approve Shop</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to approve this shop?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onApprove(shopId)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Confirm Approval
              </button>
            </div>
          </>
        )}

        {type === 'reject' && (
          <>
            <h3 className="font-bold text-lg mb-4">Reason for Rejection</h3>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              className="w-full h-32 border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Provide the reason for rejecting this shop..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onReject(shopId, reason)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Submit Rejection
              </button>
            </div>
          </>
        )}

        {type === 'disable' && (
          <>
            <h3 className="font-bold text-lg mb-4">Reason for Disabling</h3>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              className="w-full h-32 border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Provide the reason for disabling this shop..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onDisable(shopId, reason)}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
              >
                Disable Shop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmShopModal;
