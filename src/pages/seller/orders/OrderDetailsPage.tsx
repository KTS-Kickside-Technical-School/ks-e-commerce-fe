import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCalendar,
  FaUser,
  FaMapMarkerAlt,
  FaTruck,
  FaCreditCard,
  FaBox,
  FaHistory,
  FaPlus,
  FaListAlt,
} from 'react-icons/fa';
import { toast } from 'sonner';
import SingleOrderImageCarousel from './SingleOrderImageCarousel';
import { safeToFixed } from '../../../helpers/round';
import SingleOrderTImeline from './SingleOrderTImeline';
import SingleOrderSkeleton from './SingleOrderSkeleton';
import { sellerGetSingleOrderDetails } from '../../../requests/ordersRequests';
import CourierModal from './CourierModal';
import SingleProductOrderProcesses from './SingleProductOrderProcesses';
import AddProcessModal from './AddProcessModal';
import OrderStatusTimeline from '../../customers/orders/OrderStatusTimeline';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    processes: Array<{ process: string; date: Date }>;
  } | null>(null);
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [selectedCourierOrder, setSelectedCourierOrder] = useState<any>(null);

  const [currentOrder, setCurrentOrder] = useState<any>({});
  const [isAddProcessModalOpen, setIsAddProcessModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await sellerGetSingleOrderDetails(orderId!);
        if (response.status === 200) {
          setOrder(response.data.order);
        } else {
          setError('Order not found');
          toast.error('Could not fetch order details');
        }
      } catch (err) {
        setError('Failed to load order details');
        toast.error('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <SingleOrderSkeleton />;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link
            to="/seller/orders"
            className="flex items-center text-primary-600 hover:text-primary-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrderStatusTimeline order={order} />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setSelectedOrder({
                      id: order._id,
                      processes: order.orderProcesses || [],
                    })
                  }
                  className="group p-3 rounded-xl bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 
                 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 
                 hover:border-blue-200 relative"
                  aria-label="View order processes"
                >
                  <FaListAlt className="w-6 h-6" />
                  <span
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs 
                      px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity 
                      duration-200 whitespace-nowrap"
                  >
                    View History
                  </span>
                </button>

                <button
                  onClick={() => {
                    setCurrentOrder(order);
                    setIsAddProcessModalOpen(true);
                  }}
                  className="group p-3 rounded-xl bg-white hover:bg-green-50 text-green-600 hover:text-green-700 
                 transition-all duration-200 shadow-sm hover:shadow-md border border-green-200 
                 hover:border-green-300 relative"
                  aria-label="Add order process"
                >
                  <FaPlus className="w-6 h-6" />
                  <span
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs 
                      px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity 
                      duration-200 whitespace-nowrap"
                  >
                    Add Update
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCourierOrder(order);
                    setIsCourierModalOpen(true);
                  }}
                  className="group p-3 rounded-xl bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 
                 transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200 
                 hover:border-blue-300 relative"
                  aria-label="Add courier info"
                >
                  <FaTruck className="w-6 h-6" />
                  <span
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs 
                      px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity 
                      duration-200 whitespace-nowrap"
                  >
                    Shipping Details
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                  <FaBox className="mr-2 text-primary-600" />
                  Order #{order.trackingNumber}
                </h1>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.orderStatus === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.orderStatus === 'Paid'
                      ? 'bg-blue-100 text-blue-800'
                      : order.orderStatus === 'Shipped'
                      ? 'bg-indigo-100 text-indigo-800'
                      : order.orderStatus === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center">
                  <FaCalendar className="mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaHistory className="mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaBox className="mr-2 text-primary-600" />
                  Product Details
                </h2>

                <div className="flex items-start mb-6">
                  <div className="w-32 h-32 mr-4">
                    <SingleOrderImageCarousel images={order.images} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {order.productName}
                    </h3>
                    <p className="text-gray-600">Quantity: {order.quantity}</p>
                    <div className="mt-2">
                      <span className="text-lg font-bold">
                        {safeToFixed(order.finalTotalPrice)} RWF
                      </span>
                      {order.discount > 0 && (
                        <span className="ml-2 line-through text-gray-500">
                          {safeToFixed(
                            order.finalTotalPrice /
                              ((100 - order.discount) / 100)
                          )}{' '}
                          RWF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaHistory className="mr-2 text-primary-600" />
                Order Timeline
              </h2>
              <SingleOrderTImeline
                items={order.orderProcesses
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((process: any) => ({
                    date: new Date(process.date),
                    title: process.process,
                    description: process.note,
                    images: process.images || [],
                  }))}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaUser className="mr-2 text-primary-600" />
                Customer Details
              </h2>
              <div className="space-y-3">
                <p className="font-medium">{order.customer.name}</p>
                <p>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-primary-600"
                  >
                    {order.customer.email}
                  </a>
                </p>
                <p>{order.customer.phone}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary-600" />
                Shipping Address
              </h2>
              <div className="space-y-2">
                <p>{order.addresses.street}</p>
                <p>
                  {order.addresses.city}, {order.addresses.region}
                </p>
                <p>
                  {order.addresses.country}, {order.addresses.postalCode}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-primary-600" />
                Payment Details
              </h2>
              <div className="space-y-2">
                <p className="font-medium">{order.paymentMethod}</p>
                <p>Total Paid: {safeToFixed(order.finalTotalPrice)} RWF</p>
              </div>
            </div>

            {order.courier && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaTruck className="mr-2 text-primary-600" />
                  Courier Details
                </h2>
                <div className="space-y-2">
                  <p className="font-medium">{order.courier.company}</p>
                  <p>Tracking Number: {order.courier.trackingNumber}</p>
                  <p>Estimated Delivery: {order.courier.estimatedDelivery}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
    </>
  );
};

export default OrderDetailsPage;
