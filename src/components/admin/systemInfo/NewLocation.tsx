import { useState } from 'react';
import { toast } from 'sonner';
import { saveLocation } from '../../../requests/locationRequests';
import { iLocation } from '../../../types/store';

const NewLocation = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (newLoc: iLocation) => void;
}) => {
  const [code, setCode] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !country || !city) {
      toast.error('All fields are required.');
      return;
    }

    const data = { code, country, city };
    setLoading(true);
    try {
      const response = await saveLocation(data);
      console.log('Response from saveLocation:', response);
      if (response.status === 201) {
        toast.success('Location added successfully.');
        onSave(response.data.location);
        onClose();
      } else {
        toast.error(response.message || 'Something went wrong while saving.');
      }
    } catch (error) {
      toast.error('Failed to save location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Add New Location
          </h3>
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
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLocation;
