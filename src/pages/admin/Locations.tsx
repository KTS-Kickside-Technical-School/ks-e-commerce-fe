import { useEffect, useState, useMemo } from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { getAllLocations } from '../../requests/locationRequests';
import SystemInformationSubNavBar from '../../components/admin/systemInfo/SystemInformationSubNavBar';
import NewLocation from '../../components/admin/systemInfo/NewLocation';
import { iLocation } from '../../types/store';
import EditLocation from '../../components/admin/systemInfo/EditLocation';

let locationCache: iLocation[] | null = null;

const Locations = () => {
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);
  const [data, setData] = useState<iLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editLocation, setEditLocation] = useState<iLocation | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLocations = async () => {
      if (locationCache) {
        setData(locationCache);
        setLoading(false);
        return;
      }

      try {
        const response = await getAllLocations();
        if (response.status === 200) {
          const locations = response.data.locations || [];
          locationCache = locations;
          setData(locations);
        } else {
          setError('Failed to fetch locations.');
        }
      } catch (err) {
        setError('An error occurred while fetching locations.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(
      (loc: iLocation) =>
        loc?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredData, currentPage]);

  return (
    <div className="min-h-screen bg-blue-50">
      <SystemInformationSubNavBar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-blue-700">Locations</h2>
          <button
            onClick={() => setShowNewLocationModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            <FaPlus />
            <span>Add New Location</span>
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by city or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 w-full sm:w-1/3 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="h-10 bg-blue-100 animate-pulse rounded"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold bg-red-100 p-4 rounded-lg shadow">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((loc: iLocation, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">{loc?.code}</td>
                    <td className="px-4 py-3">{loc?.country}</td>
                    <td className="px-4 py-3">{loc?.city}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditLocation(loc)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full transition border font-medium text-sm ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {showNewLocationModal && (
        <NewLocation
          onClose={() => setShowNewLocationModal(false)}
          onSave={(newLoc) => setData((prev) => [...prev, newLoc])}
        />
      )}
      {editLocation && (
        <EditLocation
          location={editLocation}
          onClose={() => setEditLocation(null)}
          onUpdate={(updatedLoc) =>
            setData((prev) =>
              prev.map((l) => (l?._id === updatedLoc?._id ? updatedLoc : l))
            )
          }
        />
      )}
    </div>
  );
};

export default Locations;
