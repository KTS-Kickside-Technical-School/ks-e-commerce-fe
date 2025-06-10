import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateLocation } from '../../../requests/locationRequests';
import { iLocation } from '../../../types/store';

const EditLocation = ({
  onClose,
  onUpdate,
  location,
}: {
  onClose: () => void;
  onUpdate: (updatedLoc: iLocation) => void;
  location: iLocation;
}) => {
  const [code, setCode] = useState(location.code || '');
  const [country, setCountry] = useState(location.country || '');
  const [city, setCity] = useState(location.city || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCode(location.code || '');
    setCountry(location.country || '');
    setCity(location.city || '');
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !country || !city) {
      toast.error('All fields are required.');
      return;
    }

    const data = { code, country, city };
    setLoading(true);
    try {
      const response = await updateLocation(location?._id, data);
      if (response.status === 200) {
        toast.success('Location updated successfully.');
        onUpdate(response.data.location);
        onClose();
      } else {
        toast.error('Something went wrong while updating.');
      }
    } catch (error) {
      toast.error('Failed to update location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Edit Location</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter location code"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter country"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter city"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLocation;
