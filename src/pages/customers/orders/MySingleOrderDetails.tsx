import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import {
  FaUpload,
  FaPrint,
  FaEnvelope,
  FaWhatsapp,
  FaChevronDown,
} from 'react-icons/fa';
import Header from '../../../components/customers/Header';
import Footer from '../../../components/customers/Footer';
import uploadToCloudinary from '../../../helpers/cloudinary';
import {
  getSingleOrderDetails,
  customerUpdateOrder,
} from '../../../requests/ordersRequests';
import OrderStatusBadge from '../../../components/customers/orders/OrderStatusPage';
import PaymentStatusBadge from '../../../components/customers/orders/PaymentStatusPage';
import Timeline from '../../../components/customers/orders/Timeline';
import { formatRWF } from '../../../helpers/round';
import SEO from '../../../middlewares/SEO';

interface OrderContactInfo {
  phone: string;
  email?: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

interface ShippingOption {
  fee: number;
  duration?: string;
  note?: string;
}

interface TrackingEvent {
  status: string;
  note: string;
  timestamp: string;
}

interface Order {
  _id: string;
  trackingCode: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'confirmed' | 'failed' | 'refunded';
  paymentMethod: string;
  paidAt?: string;
  deliveredAt?: string;
  productName: string;
  quantity: number;
  finalUnitPrice: number;
  discount: number;
  finalTotalPrice: number;
  productImages: string[];
  shippingAddress: ShippingAddress;
  shippingOptions: ShippingOption;
  contactInfo: OrderContactInfo;
  orderTrackingHistory: TrackingEvent[];
  paymentProof?: string;
  createdAt: string;
}

const MySingleOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    orderInfo: true,
    product: true,
    shipping: true,
    tracking: true,
    payment: true,
  });

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSingleOrderDetails(id!);
      if (response.status === 200) {
        setOrder(response.data.order);
      } else {
        throw new Error(response.message || 'Failed to fetch order');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handlePaymentProofUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);

      if (!imageUrl) throw new Error('Upload failed');

      const response = await customerUpdateOrder(order!._id, {
        paymentProof: imageUrl,
      });
      if (response.status === 200) {
        toast.success('Payment proof uploaded successfully');
        setOrder((prev) => ({
          ...prev!,
          paymentProof: imageUrl,
          paymentStatus: 'pending',
        }));
      } else {
        throw new Error(response.message || 'Failed to save payment proof');
      }
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;
    handlePaymentProofUpload(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    handlePaymentProofUpload(e.target.files[0]);
  };

  const handlePrint = () => window.print();
  const handleEmail = () =>
    window.open(`mailto:${order?.contactInfo?.email || ''}`);
  const handleWhatsApp = () => {
    const message = `Order ${
      order?.trackingCode || 'Details'
    }\nTotal: ${formatRWF(order?.finalTotalPrice || 0)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <SEO title={`My Order Details ${order?.trackingCode}: Kickside Store`} />
      <Toaster position="top-center" richColors />
      <Header />
      {loading ? (
        <div className="max-w-5xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      ) : !order ? (
        <div className="max-w-5xl mx-auto p-6 text-center">
          <div className="bg-red-50 text-red-700 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p>The requested order could not be located.</p>
          </div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-sm mt-6 mb-10 border border-gray-100 print:bg-white print:shadow-none print:p-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-500 mt-1">
                Tracking code: {order?.trackingCode}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaPrint className="text-blue-600" /> Print
              </button>
              <button
                onClick={handleEmail}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaEnvelope className="text-blue-600" /> Email
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaWhatsapp className="text-green-500" /> WhatsApp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-700 mb-1">Order Status</p>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <p className="text-sm text-yellow-700 mb-1">Payment Status</p>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatRWF(order.finalTotalPrice)}
              </p>
            </div>
          </div>

          <section className="mb-6 border rounded-xl overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection('orderInfo')}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Order Information
              </h2>
              <FaChevronDown
                className={`transition-transform ${
                  expandedSections.orderInfo ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expandedSections.orderInfo && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {order.paidAt && (
                  <div>
                    <p className="text-sm text-gray-500">Paid At</p>
                    <p className="font-medium">
                      {new Date(order.paidAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {order.deliveredAt && (
                  <div>
                    <p className="text-sm text-gray-500">Delivered At</p>
                    <p className="font-medium">
                      {new Date(order.deliveredAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="mb-6 border rounded-xl overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection('product')}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Product Details
              </h2>
              <FaChevronDown
                className={`transition-transform ${
                  expandedSections.product ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expandedSections.product && (
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Product Name</p>
                    <p className="font-medium text-lg mb-4">
                      {order.productName}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-medium">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Unit Price</p>
                        <p className="font-medium">
                          {formatRWF(order.finalUnitPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Discount</p>
                        <p className="font-medium text-red-600">
                          -{formatRWF(order.discount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium text-blue-700">
                          {formatRWF(order.finalTotalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Product Images</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.productImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Product ${idx + 1}`}
                          className="h-28 w-28 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="mb-6 border rounded-xl overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection('shipping')}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping Information
              </h2>
              <FaChevronDown
                className={`transition-transform ${
                  expandedSections.shipping ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expandedSections.shipping && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">
                      {order.shippingAddress.street}
                    </p>
                    <p>
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.region}
                    </p>
                    <p>
                      {order.shippingAddress.postalCode},{' '}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Contact Info</p>
                    <p className="font-medium">{order.contactInfo.phone}</p>
                    {order.contactInfo.email && (
                      <p className="font-medium">{order.contactInfo.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Shipping Fee</p>
                      <p className="font-medium">
                        ${order.shippingOptions.fee.toFixed(2)}
                      </p>
                    </div>
                    {order.shippingOptions.duration && (
                      <div>
                        <p className="text-sm text-gray-500">Est. Delivery</p>
                        <p className="font-medium">
                          {order.shippingOptions.duration}
                        </p>
                      </div>
                    )}
                  </div>

                  {order.shippingOptions.note && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Shipping Note</p>
                      <p className="font-medium">
                        {order.shippingOptions.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="mb-6 border rounded-xl overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection('tracking')}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Order Tracking
              </h2>
              <FaChevronDown
                className={`transition-transform ${
                  expandedSections.tracking ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expandedSections.tracking && (
              <div className="p-4">
                {order.orderTrackingHistory.length === 0 ? (
                  <p className="text-center py-6 text-gray-500">
                    No tracking updates available
                  </p>
                ) : (
                  <Timeline events={order.orderTrackingHistory} />
                )}
              </div>
            )}
          </section>

          <section className="border rounded-xl overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection('payment')}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Proof
              </h2>
              <FaChevronDown
                className={`transition-transform ${
                  expandedSections.payment ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expandedSections.payment && (
              <div className="p-4">
                {order.paymentProof ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={order.paymentProof}
                      alt="Payment proof"
                      className="max-w-full md:max-w-md rounded-lg border shadow mb-4"
                    />
                    <button
                      onClick={() =>
                        setOrder({ ...order, paymentProof: undefined })
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Re-upload Payment Proof
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                    >
                      <div className="max-w-md mx-auto p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUpload className="h-8 w-8 text-blue-600" />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              Upload payment proof
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Drag & drop your file here or click to browse
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Supported formats: JPG, PNG, PDF (max 5MB)
                            </p>
                          </div>

                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={handleFileInput}
                            disabled={uploading}
                          />

                          {uploading && (
                            <div className="mt-4">
                              <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4"></div>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                Uploading...
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      )}
      <Footer />
    </>
  );
};

export default MySingleOrderDetails;
