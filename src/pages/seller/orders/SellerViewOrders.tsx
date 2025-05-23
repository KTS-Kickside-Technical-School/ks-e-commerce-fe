import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  FaBoxOpen,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCopy,
  FaEye,
  FaListAlt,
  FaPlus,
  FaSearch,
} from 'react-icons/fa';
import SkeletonTable from '../../../components/SkeletonTable';
import { FaTruck } from 'react-icons/fa6';
import { sellerViewOrders } from '../../../requests/ordersRequests';
import SellerNewProductModal from '../../../components/seller/products/SellerNewProductModal';
import { safeToFixed } from '../../../helpers/round';
import { FiPackage, FiXCircle } from 'react-icons/fi';
import SingleProductOrderProcesses from './SingleProductOrderProcesses';
import AddProcessModal from './AddProcessModal';
import CourierModal from './CourierModal';
import { Link } from 'react-router-dom';

const SellerViewOrders = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [imageIndex, setImageIndex] = useState<{ [key: string]: number }>({});
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    processes: Array<{ process: string; date: Date }>;
  } | null>(null);
  useEffect(() => {
    fetchOrders();
  }, []);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [currentOrder, setCurrentOrder] = useState<any>({});
  const [isAddProcessModalOpen, setIsAddProcessModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [selectedCourierOrder, setSelectedCourierOrder] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sellerViewOrders();
      if (response.status !== 200) {
        toast.error(response.message);
        setError(response.message);
        return;
      }
      setData(response.data.orders || []);
    } catch (error: any) {
      toast.error('An error occurred while fetching products');
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageChange = (
    id: string,
    direction: 'prev' | 'next',
    images: string[]
  ) => {
    setImageIndex((prev) => {
      const currentIndex = prev[id] || 0;
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % images.length
          : (currentIndex - 1 + images.length) % images.length;
      return { ...prev, [id]: newIndex };
    });
  };

  const filteredData = data.filter((order: any) => {
    const matchesSearch = [
      order.productName?.toLowerCase(),
      order.trackingNumber?.toLowerCase(),
      order?.addresses?.street?.toLowerCase(),
      order?.addresses?.city?.toLowerCase(),
    ].some((value) => value?.includes(searchQuery.toLowerCase()));

    const matchesStatus =
      !selectedStatus || order.orderStatus === selectedStatus;

    const orderDate = new Date(order.createdAt);
    const matchesDateRange =
      (!startDate || orderDate >= new Date(startDate)) &&
      (!endDate || orderDate <= new Date(endDate));

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Orders Management
        </h2>
        <button
          title="Add New Product"
          onClick={() => setIsProductModalOpen(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <FaPlus className="text-sm" />
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input - Full width on mobile, then normal */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>

        {/* Date Inputs - Stack on mobile, side by side on sm+ */}
        <div className="flex flex-col sm:flex-row gap-2 sm:col-span-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="From date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="To date"
          />
        </div>

        {/* Items Per Page - Full width on mobile, normal on sm+ */}
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-auto"
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`flex items-center px-4 py-2 rounded-t-lg ${
              !selectedStatus
                ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaListAlt className="mr-2" />
            All Orders
          </button>
          <button
            onClick={() => setSelectedStatus('Pending')}
            className={`flex items-center px-4 py-2 rounded-t-lg ${
              selectedStatus === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 border-b-2 border-yellow-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaClock className="mr-2" />
            Pending
          </button>
          <button
            onClick={() => setSelectedStatus('Paid')}
            className={`flex items-center px-4 py-2 rounded-t-lg ${
              selectedStatus === 'Paid'
                ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCheckCircle className="mr-2" />
            Paid
          </button>
          <button
            onClick={() => setSelectedStatus('Shipped')}
            className={`flex items-center px-4 py-2 rounded-t-lg ${
              selectedStatus === 'Shipped'
                ? 'bg-indigo-100 text-indigo-800 border-b-2 border-indigo-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaTruck className="mr-2" />
            Shipped
          </button>
          <button
            onClick={() => setSelectedStatus('Delivered')}
            className={`flex items-center px-4 py-2 rounded-t-lg ${
              selectedStatus === 'Delivered'
                ? 'bg-green-100 text-green-800 border-b-2 border-green-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaBoxOpen className="mr-2" />
            Delivered
          </button>
          <button
            onClick={() => setSelectedStatus('Cancelled')}
            className={`flex items-center px-4 py-2 rounded-t-lg ${
              selectedStatus === 'Cancelled'
                ? 'bg-red-100 text-red-800 border-b-2 border-red-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiXCircle className="mr-2" />
            Cancelled
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : data.length > 0 ? (
          <>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3  min-w-[120px] text-left whitespace-nowrap">
                    Tracking number
                  </th>
                  <th className="p-3 min-w-[120px] text-left">Product image</th>
                  <th className="p-3  min-w-[120px] text-left whitespace-nowrap">
                    Customer email
                  </th>
                  <th className="p-3 min-w-[160px] flex-1 text-left">
                    Product Name
                  </th>
                  <th className="p-3 min-w-[80px] text-left">Quantity</th>
                  <th className="p-3 min-w-[120px] text-left whitespace-nowrap">
                    Total Paid Price
                  </th>
                  <th className="p-3 min-w-[140px] text-left">
                    Payment method
                  </th>
                  <th className="p-3 min-w-[200px] text-left">
                    Shipping address
                  </th>
                  <th className="p-3 min-w-[100px] text-left">Status</th>
                  <th className="p-3 w-32 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((order: any) => (
                      <tr
                        key={order._id}
                        className="border-b hover:bg-gray-100 transition duration-200"
                      >
                        <td className="p-3">{order.trackingNumber}</td>
                        <td className="p-3 align-top flex items-center justify-center gap-2">
                          {order.images.length > 1 && (
                            <button
                              onClick={() =>
                                handleImageChange(
                                  order._id,
                                  'prev',
                                  order.images
                                )
                              }
                            >
                              <FaChevronLeft className="text-gray-600 hover:text-gray-800" />
                            </button>
                          )}

                          <img
                            src={order.images[imageIndex[order._id] || 0]}
                            alt={order.productName}
                            className="w-12 h-12 rounded-md border object-cover"
                          />

                          {order.images.length > 1 && (
                            <button
                              onClick={() =>
                                handleImageChange(
                                  order._id,
                                  'next',
                                  order.images
                                )
                              }
                            >
                              <FaChevronRight className="text-gray-600 hover:text-gray-800" />
                            </button>
                          )}
                        </td>
                        <td className="p-3">
                          <a href={`mailto: ${order.customer.email}`}>
                            {order.customer.email}
                          </a>
                        </td>
                        <td className="p-3 font-medium">{order.productName}</td>
                        <td className="p-3 text-gray-600">{order.quantity}</td>
                        <td className="p-3 text-gray-600">
                          {safeToFixed(order.finalTotalPrice)}RWF
                        </td>
                        <td className="p-3 text-gray-600">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors bg-green-100 text-green-800 hover:bg-yellow-200">
                            <span className="mt-0.5">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="group relative">
                            <div className="flex items-center gap-2">
                              <div className="text-gray-700">
                                <div className="flex flex-col">
                                  <span className="block">
                                    {order?.addresses?.street}
                                  </span>
                                  <span className="block">
                                    {order?.addresses?.city},{' '}
                                    {order?.addresses?.region}
                                  </span>
                                  <span className="block">
                                    {order?.addresses?.country},{' '}
                                    {order?.addresses?.postalCode}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const addressText = `${order?.addresses?.street}, ${order?.addresses?.city}, ${order?.addresses?.region}, ${order?.addresses?.country}, ${order?.addresses?.postalCode}`;
                                  navigator.clipboard
                                    .writeText(addressText)
                                    .then(() =>
                                      toast.success(
                                        'Address copied to clipboard!'
                                      )
                                    )
                                    .catch(() =>
                                      toast.error('Failed to copy address')
                                    );
                                }}
                                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                title="Copy address"
                                aria-label="Copy address to clipboard"
                              >
                                <FaCopy className="w-4 h-4" />
                                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  Copy
                                </span>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              order.orderStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : order.orderStatus === 'Paid'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : order.orderStatus === 'Shipped'
                                ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                                : order.orderStatus === 'Delivered'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {order.orderStatus === 'Pending' && (
                              <FaClock className="w-4 h-4 mr-1.5 opacity-90" />
                            )}
                            {order.orderStatus === 'Paid' && (
                              <FaCheckCircle className="w-4 h-4 mr-1.5 opacity-90" />
                            )}
                            {order.orderStatus === 'Shipped' && (
                              <FaTruck className="w-4 h-4 mr-1.5 opacity-90" />
                            )}
                            {order.orderStatus === 'Delivered' && (
                              <FiPackage className="w-4 h-4 mr-1.5 opacity-90" />
                            )}
                            {order.orderStatus === 'Cancelled' && (
                              <FiXCircle className="w-4 h-4 mr-1.5 opacity-90" />
                            )}
                            <span className="mt-0.5">{order.orderStatus}</span>
                          </div>
                        </td>
                        <td className="p-3 flex justify-center space-x-3">
                          <div className="hidden md:flex space-x-2">
                            <button
                              onClick={() =>
                                setSelectedOrder({
                                  id: order._id,
                                  processes: order.orderProcesses || [],
                                })
                              }
                              className="p-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white flex items-center transition duration-200"
                              aria-label="View order processes"
                            >
                              <FaListAlt className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setCurrentOrder(order);
                                setIsAddProcessModalOpen(true);
                              }}
                              className="p-2 rounded-md bg-green-500 hover:bg-green-600 text-white flex items-center transition duration-200"
                              aria-label="Add order process"
                            >
                              <FaPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCourierOrder(order);
                                setIsCourierModalOpen(true);
                              }}
                              className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white flex items-center transition duration-200"
                              aria-label="Add courier info"
                            >
                              <FaTruck className="w-4 h-4" />
                            </button>
                            <Link
                              to={`/seller/single-order-details/${order._id}`}
                              className="p-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white flex items-center transition duration-200"
                              aria-label="View order details"
                            >
                              <FaEye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-3 text-center">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
              <div className="mb-2 md:mb-0 text-sm text-gray-700">
                Showing{' '}
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredData.length
                )}
                -{Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                {filteredData.length} orders
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  {[10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="inline-block" />
                </button>

                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="inline-block" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-4">No orders found.</div>
        )}
      </div>
      {isProductModalOpen && (
        <SellerNewProductModal onClose={() => setIsProductModalOpen(false)} />
      )}
      {selectedOrder && (
        <SingleProductOrderProcesses
          onClose={() => setSelectedOrder(null)}
          processes={selectedOrder.processes}
        />
      )}
      {isAddProcessModalOpen && currentOrder && (
        <AddProcessModal
          isOpen={isAddProcessModalOpen}
          onClose={() => {
            setIsAddProcessModalOpen(false);
            setCurrentOrder(null);
          }}
          orderId={currentOrder?._id || ''}
          orderStatus={currentOrder.orderStatus}
        />
      )}

      {isCourierModalOpen && selectedCourierOrder && (
        <CourierModal
          order={selectedCourierOrder}
          onClose={() => {
            setIsCourierModalOpen(false);
            setSelectedCourierOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default SellerViewOrders;
