import { useState } from 'react';
import { FaTimes, FaUpload, FaInfoCircle, FaHistory } from 'react-icons/fa';
import { toast } from 'sonner';
import { addSingleProductOrderProcess } from '../../../requests/ordersRequests';
import uploadToCloudinary from '../../../helpers/cloudinary';
import StatusTimeline from '../../../components/seller/orders/StatusTimeline';
import ProgressBar from '../../../components/seller/orders/ProgressBar';

interface AddProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderStatus: string;
}

// const statusFlow = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

const AddProcessModal = ({
  isOpen,
  onClose,
  orderId,
  orderStatus,
}: AddProcessModalProps) => {
  const [process, setProcess] = useState('');
  const [status, setStatus] = useState(orderStatus);
  const [courier, setCourier] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = Array.from(files).map((file) =>
        uploadToCloudinary(file)
      );

      const uploadedResults = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedResults]);
    } catch (error) {
      toast.error('Error uploading images');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'Shipped' && !courier.trim()) {
      toast.error('Courier information is required for shipping updates');
      return;
    }

    if (process.length < 20) {
      toast.error(
        'Please provide a more detailed process description (min 20 characters)'
      );
      return;
    }

    try {
      await addSingleProductOrderProcess({
        _id: orderId,
        orderStatus: status,
        process: `${status} - ${process}`,
        date: new Date().toISOString(),
        ...(status === 'Shipped' && { courier }),
        images,
      });

      toast.success('Order process updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update order process');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl relative shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaHistory className="text-blue-600" />
            Update Order Progress
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <StatusTimeline
              currentStatus={orderStatus}
              newStatus={status}
              onStatusChange={setStatus}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Process Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    Process Details
                    <FaInfoCircle className="text-gray-400" />
                  </label>
                  <textarea
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the current progress (e.g., 'Package handed to courier partner')"
                    minLength={20}
                  />
                  <span className="text-sm text-gray-500 mt-1 block">
                    {process.length}/500 characters
                  </span>
                </div>

                {status === 'Shipped' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Courier Information
                    </label>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={courier}
                        onChange={(e) => setCourier(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Courier company name"
                      />
                      <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                        ℹ️ This information will be shared with the customer
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Supporting Documentation
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <FaUpload className="text-gray-400" />
                        <span className="text-sm text-center">
                          Upload from Device
                          <span className="block text-xs text-gray-400 mt-1">
                            (JPEG, PNG, PDF)
                          </span>
                        </span>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                          accept="image/*, .pdf"
                        />
                      </label>

                      <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <FaUpload className="text-gray-400" />
                        <span className="text-sm text-center">
                          Capture Photo
                          <span className="block text-xs text-gray-400 mt-1">
                            (Live camera capture)
                          </span>
                        </span>
                        <input
                          type="file"
                          capture="environment"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>

                    {uploading && (
                      <div className="space-y-2">
                        <ProgressBar value={uploadProgress} />
                        <span className="text-sm text-gray-500">
                          Uploading {uploadProgress}% complete...
                        </span>
                      </div>
                    )}

                    {images.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-3">
                          Attached Files ({images.length})
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          {images.map((img, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                {img.endsWith('.pdf') ? (
                                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                                    <span className="text-xs font-medium">
                                      PDF Document
                                    </span>
                                  </div>
                                ) : (
                                  <img
                                    src={img}
                                    className="w-full h-full object-cover"
                                    alt="Documentation"
                                  />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setImages((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Confirm Update'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProcessModal;
