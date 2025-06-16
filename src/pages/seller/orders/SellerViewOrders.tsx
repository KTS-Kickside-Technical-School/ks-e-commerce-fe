import { useEffect, useMemo, useState } from 'react';
import SEO from '../../../middlewares/SEO';
import { useNavigate } from 'react-router-dom';
import { sellerGetOrders } from '../../../requests/ordersRequests';
import { toast } from 'sonner';
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaFilter,
  FaMobile,
  FaSearch,
  FaSortAmountDown,
  FaTimes,
} from 'react-icons/fa';
import { format } from 'date-fns';
import { formatAccronymsRWF, formatRWF } from '../../../helpers/round';
import { IOrder } from '../../../types/store';

const SellerViewOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const navigate = useNavigate();

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await sellerGetOrders();
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      setOrders(response.data.orders);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user.fullNames
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.contactInfo.phone.includes(searchTerm) ||
          order.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    switch (sortOption) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'price-high':
        result.sort((a, b) => b.finalTotalPrice - a.finalTotalPrice);
        break;
      case 'price-low':
        result.sort((a, b) => a.finalTotalPrice - b.finalTotalPrice);
        break;
      default:
        break;
    }

    return result;
  }, [orders, searchTerm, statusFilter, sortOption]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'momo':
        return <FaMobile />;
      case 'visa':
        return '💳';
      case 'stripe':
        return '💳';
      case 'cash':
        return '💵';
      case 'paypal':
        return '🔵';
      default:
        return '💳';
    }
  };

  const viewOrderDetails = (orderId: string) => {
    navigate(`/seller/order/${orderId}`);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOption]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return (
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-100'
            }`}
          >
            <FaChevronLeft />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-10 h-10 rounded-md ${
                  1 === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-100'
                }`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <button
              key={startPage + i}
              onClick={() => setCurrentPage(startPage + i)}
              className={`w-10 h-10 rounded-md ${
                startPage + i === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-100'
              }`}
            >
              {startPage + i}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-10 h-10 rounded-md ${
                  totalPages === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-100'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-100'
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <SEO
        title="View Shop Orders - Kickside Store: Seller"
        description="View and manage your shop orders, track their status and update them as they progress."
      />
      <div className="max-w-7xl mx-auto p-4 md:p-6  mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Track Orders
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and manage all customers recent orders in one place. Track
            shipments, view order details, and check order status.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by tracking code, name, email, phone, or product..."
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-4 text-gray-400" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              <FaFilter className="text-blue-500" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Filter Orders
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Order Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'pending',
                      'processing',
                      'shipped',
                      'delivered',
                      'cancelled',
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setStatusFilter(statusFilter === status ? '' : status)
                        }
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          statusFilter === status
                            ? `${getStatusBadgeClass(status)} border`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSortOption('newest')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        sortOption === 'newest'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaCalendarAlt /> Newest
                    </button>
                    <button
                      onClick={() => setSortOption('oldest')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        sortOption === 'oldest'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaCalendarAlt /> Oldest
                    </button>
                    <button
                      onClick={() => setSortOption('price-high')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        sortOption === 'price-high'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaSortAmountDown /> Price: High to Low
                    </button>
                    <button
                      onClick={() => setSortOption('price-low')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        sortOption === 'price-low'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaSortAmountDown className="transform rotate-180" />{' '}
                      Price: Low to High
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(searchTerm || statusFilter) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchTerm && (
                <div className="flex items-center bg-blue-50 rounded-full px-3 py-1 text-sm">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              {statusFilter && (
                <div className="flex items-center bg-blue-50 rounded-full px-3 py-1 text-sm">
                  <span>Status: {statusFilter}</span>
                  <button
                    onClick={() => setStatusFilter('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading your orders...</p>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaBoxOpen className="text-gray-500 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              No orders found
            </h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              {searchTerm || statusFilter
                ? 'Try changing your search or filter criteria'
                : "You haven't placed any orders yet. Start shopping to see your orders here!"}
            </p>
            {!searchTerm && !statusFilter && (
              <button
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => navigate('/category/All')}
              >
                Browse Products
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              {paginatedOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">Order:</span>
                        <button
                          onClick={() => viewOrderDetails(order._id)}
                          className="text-blue-600 font-mono"
                        >
                          {order.trackingCode}
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {format(
                          new Date(order.createdAt),
                          'MMM dd, yyyy - hh:mm a'
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                          order.orderStatus
                        )} border`}
                      >
                        {order.orderStatus.charAt(0).toUpperCase() +
                          order.orderStatus.slice(1)}
                      </span>
                      <button
                        onClick={() => viewOrderDetails(order._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex gap-4">
                        {order.productImages.length > 0 && (
                          <button
                            onClick={() => viewOrderDetails(order._id)}
                            className="flex items-center gap-4"
                          >
                            <img
                              src={order.productImages[0]}
                              alt={order.productName}
                              className="w-20 h-20 rounded-lg object-cover border"
                            />
                          </button>
                        )}
                        <div className="flex-1">
                          <button
                            onClick={() => viewOrderDetails(order._id)}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {order.productName}
                          </button>
                          <div className="mt-2 flex gap-4">
                            <div>
                              <div className="text-xs text-gray-500">
                                Quantity
                              </div>
                              <div className="font-medium">
                                {order.quantity}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">
                                Unit Price
                              </div>
                              <div className="font-medium">
                                {formatRWF(order.finalUnitPrice)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Customer
                        </h4>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {order.user?.fullNames}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.user.email}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.contactInfo.phone}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Subtotal:</span>
                          <span>
                            {formatRWF(order.finalUnitPrice * order.quantity)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Shipping:</span>
                          <span>{formatRWF(order.shippingOptions.fee)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-red-600">
                            -{order.discount}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                          <span className="font-semibold text-gray-800">
                            Total:
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            {formatRWF(order.finalTotalPrice)}
                          </span>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            {getPaymentMethodIcon(order.paymentMethod)}{' '}
                            {order.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {Math.min(startIndex + 1, filteredOrders.length)} to{' '}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)}{' '}
                of {filteredOrders.length} orders
              </div>

              {renderPagination()}
            </div>
            {!loading && (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-5 border border-blue-100">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-200 select-none">
                    <div className="text-3xl font-bold text-blue-600">
                      {filteredOrders.length || 0}
                    </div>
                    <div className="text-blue-700 font-medium">
                      Total Orders
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-200 select-none">
                    <div className="text-3xl font-bold text-blue-500">
                      {filteredOrders.filter((o) => o.orderStatus === 'pending')
                        .length || 0}
                    </div>
                    <div className="text-blue-700 font-medium">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-200 select-none">
                    <div className="text-3xl font-bold text-indigo-500">
                      {filteredOrders.filter((o) => o.orderStatus === 'shipped')
                        .length || 0}
                    </div>
                    <div className="text-blue-700 font-medium">Shipped</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-200 select-none">
                    <div className="text-3xl font-bold text-teal-500">
                      {filteredOrders.filter(
                        (o) => o.orderStatus === 'delivered'
                      ).length || 0}
                    </div>
                    <div className="text-blue-700 font-medium">Delivered</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-200 select-none">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatAccronymsRWF(
                        filteredOrders.reduce(
                          (sum, order) => sum + order.finalTotalPrice,
                          0
                        )
                      )}
                    </div>
                    <div className="text-blue-700 font-medium">Total Spent</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SellerViewOrders;
