interface ClearCartProps {
  onClose: any;
  onClear: any;
}
const ClearCartConfirmation = ({ onClose, onClear }: ClearCartProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Cart?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove all items from your cart?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearCartConfirmation;
