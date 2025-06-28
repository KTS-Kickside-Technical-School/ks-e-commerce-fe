import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { saveFeaturedShop } from '../../../requests/adsRequests';
import { iFeaturedShops } from '../../../types/ads';
import { ISellerShop } from '../../../types/store';
import { userViewAllShops } from '../../../requests/shopRequest';

const NewFeaturedShop = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (newFeaturedShop: iFeaturedShops) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shopName, setShopName] = useState('');
  const [shops, setShops] = useState<ISellerShop[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopName.trim() || !description.trim() || !title.trim()) {
      toast.error('All fields are required.');
      return;
    }

    const selectedShop = shops.find((shop) => shop.name === shopName);

    if (!selectedShop) {
      setError('Please select a valid shop from the list');
      return;
    }

    const data = { shopId: selectedShop._id, title, description };
    setLoading(true);

    try {
      const response = await saveFeaturedShop(data);
      if (response.status === 201) {
        toast.success('Featured shop added successfully');
        onSave(response.data.featuredShop); // Fixed to match response structure
        onClose();
      } else {
        toast.error(response.message || 'Failed to save featured shop');
      }
    } catch (error) {
      toast.error('Failed to save featured shop');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await userViewAllShops();
      if (response.status === 200) {
        setShops(response.data.shops);
      } else {
        throw new Error(response.message || 'Failed to fetch shops');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load shops');
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Validate shop input on change
  useEffect(() => {
    if (shopName) {
      const isValid = shops.some((shop) => shop.name === shopName);
      setError(isValid ? '' : 'Please select a valid shop from the list');
    } else {
      setError('');
    }
  }, [shopName, shops]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Add New Featured Shop
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="shop" className="block text-sm text-gray-600 mb-1">
              Shop
            </label>
            <input
              list="shops"
              value={shopName}
              id="shop"
              onChange={(e) => setShopName(e.target.value)}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type and select shop name"
              aria-invalid={!!error}
              aria-describedby="shop-error"
            />
            <datalist id="shops">
              {shops.map((shop) => (
                <option key={shop._id} value={shop.name}>
                  {shop.name}
                </option>
              ))}
            </datalist>
            {error && (
              <p id="shop-error" className="text-red-500 text-sm mt-1">
                {error}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm text-gray-600 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              placeholder="Enter title"
              maxLength={100}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm text-gray-600 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 min-h-[100px]"
              placeholder="Enter description"
              maxLength={500}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!error}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                loading || error
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFeaturedShop;
