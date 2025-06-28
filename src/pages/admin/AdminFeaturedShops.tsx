import { useCallback, useEffect, useMemo, useState } from 'react';
import SEO from '../../middlewares/SEO';
import { iFeaturedShops } from '../../types/ads';
import {
  getAllFeaturedShops,
  updateFeaturedShopStatus,
} from '../../requests/adsRequests';
import { toast } from 'sonner';
import { FaPlus, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import SkeletonTable from '../../components/SkeletonTable';
import Logo from '/logo.png';
import { formatTimeDate } from '../../helpers/formatTime';
import SystemInformationSubNavBar from '../../components/admin/systemInfo/SystemInformationSubNavBar';
import NewFeaturedShop from '../../components/admin/systemInfo/NewFeaturedShop';

const AdminFeaturedShops = () => {
  const [loading, setLoading] = useState(true);
  const [featuredShops, setFeaturedShops] = useState<iFeaturedShops[]>([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newFeaturedModal, setNewFeaturedModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof iFeaturedShops | 'shop.name';
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFeaturedShops();
  }, []);

  const fetchFeaturedShops = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllFeaturedShops();
      if (response.status !== 200) {
        toast.error(response.message);
        setError(response.message);
        return;
      }
      setFeaturedShops(response.data.featuredShops);
    } catch (error: any) {
      toast.error('Failed to fetch featured shops');
      setError('Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = async (
    id: string,
    currentStatus: 'active' | 'inactive'
  ) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    setFeaturedShops((prev) =>
      prev.map((shop) =>
        shop._id === id ? { ...shop, status: newStatus } : shop
      )
    );

    try {
      const response = await updateFeaturedShopStatus(id, newStatus);

      if (response.status !== 200) {
        setFeaturedShops((prev) =>
          prev.map((shop) =>
            shop._id === id ? { ...shop, status: currentStatus } : shop
          )
        );
        toast.error(response.message || 'Failed to update status');
      }
    } catch (error) {
      setFeaturedShops((prev) =>
        prev.map((shop) =>
          shop._id === id ? { ...shop, status: currentStatus } : shop
        )
      );
      toast.error('Error updating status');
    }
  };

  // Sorting handler
  const handleSort = (key: keyof iFeaturedShops | 'shop.name') => {
    let direction: 'asc' | 'desc' = 'asc';

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof iFeaturedShops | 'shop.name') => {
    if (!sortConfig || sortConfig.key !== key)
      return <FaSort className="ml-1 opacity-50" />;

    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  const processedShops = useMemo(() => {
    let result = [...featuredShops];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (shop) =>
          shop.title.toLowerCase().includes(query) ||
          shop.description.toLowerCase().includes(query) ||
          shop.shop?.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any, bValue: any;

        if (sortConfig.key === 'shop.name') {
          aValue = a.shop?.name || '';
          bValue = b.shop?.name || '';
        } else {
          aValue = a[sortConfig.key as keyof iFeaturedShops];
          bValue = b[sortConfig.key as keyof iFeaturedShops];
        }

        // Handle date comparison
        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [featuredShops, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedShops.length / itemsPerPage);
  const paginatedShops = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedShops.slice(startIndex, startIndex + itemsPerPage);
  }, [processedShops, currentPage, itemsPerPage]);

  // Add new shop to list
  const handleAddNewShop = (newShop: iFeaturedShops) => {
    setFeaturedShops((prev) => [newShop, ...prev]);
    setNewFeaturedModal(false);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <>
      <SEO title="Featured Shops - Admin Dashboard" />
      <div className="min-h-screen bg-blue-50">
        <SystemInformationSubNavBar />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold text-blue-700">Featured Shops</h2>
            <button
              onClick={() => setNewFeaturedModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              <FaPlus />
              <span>Add Featured Shop</span>
            </button>
          </div>

          {/* Search input */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Search by title, description, or shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Results counter */}
            <div className="text-sm text-gray-600">
              Showing {paginatedShops.length} of {processedShops.length} shops
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
            {loading ? (
              <SkeletonTable rows={5} cols={7} />
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : processedShops.length > 0 ? (
              <>
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">
                        <button
                          className="flex items-center"
                          onClick={() => handleSort('shop.name')}
                        >
                          Shop {getSortIcon('shop.name')}
                        </button>
                      </th>
                      <th className="p-3 text-left">Logo</th>
                      <th className="p-3 text-left">
                        <button
                          className="flex items-center"
                          onClick={() => handleSort('title')}
                        >
                          Title {getSortIcon('title')}
                        </button>
                      </th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">
                        <button
                          className="flex items-center"
                          onClick={() => handleSort('createdAt')}
                        >
                          Date {getSortIcon('createdAt')}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedShops.map((feature, index) => (
                      <tr
                        key={feature._id}
                        className="border-b hover:bg-gray-100 transition duration-200"
                      >
                        <td className="p-3">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="p-3 font-medium">
                          {feature.shop?.name || 'N/A'}
                        </td>
                        <td className="p-3">
                          <img
                            src={feature.shop?.logo || Logo}
                            alt={feature.shop?.name || 'Shop logo'}
                            className="w-12 h-12 rounded-md border object-cover"
                            onError={(e) => (e.currentTarget.src = Logo)}
                          />
                        </td>
                        <td className="p-3 font-medium">{feature.title}</td>
                        <td className="p-3 max-w-xs truncate">
                          {feature.description}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={feature.status === 'active'}
                                onChange={() =>
                                  handleStatusChange(
                                    feature._id,
                                    feature.status
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                              <span className="ml-3 text-sm text-gray-600 capitalize">
                                {feature.status}
                              </span>
                            </label>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">
                          {formatTimeDate(feature?.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex space-x-1">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Prev
                      </button>

                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else {
                            const start = Math.max(
                              1,
                              Math.min(currentPage - 2, totalPages - 4)
                            );
                            pageNum = start + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 border rounded ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                {searchQuery
                  ? 'No matching featured shops found'
                  : 'No featured shops found'}
              </div>
            )}
          </div>

          {newFeaturedModal && (
            <NewFeaturedShop
              onClose={() => setNewFeaturedModal(false)}
              onSave={handleAddNewShop}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminFeaturedShops;
