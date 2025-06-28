import { useState, FormEvent, useCallback } from 'react';
import SEO from '../middlewares/SEO';
import Header from './customers/Header';
import Footer from './customers/Footer';
import { customerTrackOrder } from '../requests/ordersRequests';
import { motion } from 'framer-motion';
import { IOrder } from '../types/store';
import {
  FaBoxOpen,
  FaSearch,
  FaUndo,
  FaCheckCircle,
  FaHourglassHalf,
  FaShippingFast,
  FaTimesCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

const STATUS_ICONS: Record<string, JSX.Element> = {
  pending: <FaHourglassHalf className="text-yellow-500" />,
  processing: <FaHourglassHalf className="text-yellow-500" />,
  shipped: <FaShippingFast className="text-blue-600" />,
  delivered: <FaCheckCircle className="text-green-600" />,
  cancelled: <FaTimesCircle className="text-red-600" />,
};

const ENTRIES_PER_PAGE = 5;

const TrackOrderForm = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [orderData, setOrderData] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputError, setInputError] = useState<string | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = trackingCode.trim();

    // Clear previous errors
    setInputError(null);
    setTrackingError(null);

    if (!code) {
      setInputError('Please enter a valid tracking code');
      return;
    }

    setLoading(true);

    try {
      const response = await customerTrackOrder(code);
      if (response.status !== 200) {
        setTrackingError(response.message || 'Order not found');
      } else {
        setOrderData(response.data.order);
        setCurrentPage(1);
      }
    } catch (error: any) {
      const message =
        error.message || 'Failed to track order. Please try again.';
      setTrackingError(message);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setTrackingCode('');
    setOrderData(null);
    setCurrentPage(1);
    setInputError(null);
    setTrackingError(null);
  }, []);

  const { paginatedHistory, totalPages } = orderData?.orderTrackingHistory
    ? {
        paginatedHistory: orderData.orderTrackingHistory.slice(
          (currentPage - 1) * ENTRIES_PER_PAGE,
          currentPage * ENTRIES_PER_PAGE
        ),
        totalPages: Math.ceil(
          orderData.orderTrackingHistory.length / ENTRIES_PER_PAGE
        ),
      }
    : { paginatedHistory: [], totalPages: 0 };

  return (
    <>
      <SEO
        title="Track your order - Kickside Store"
        description="Track your order easily on Kickside Store"
      />
      <Header />

      <main className="py-16 px-6 min-h-screen bg-white text-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl font-extrabold text-center mb-12">
            <FaBoxOpen className="inline text-blue-600 mr-2" /> Track Your{' '}
            <span className="text-blue-600">Order</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-10">
            <article className="bg-white p-8 rounded-xl shadow-md border border-blue-200">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <div className="relative">
                    <input
                      id="tracking-input"
                      type="text"
                      value={trackingCode}
                      onChange={(e) => {
                        setTrackingCode(e.target.value);
                        setInputError(null);
                      }}
                      placeholder="Enter tracking number..."
                      className={`px-5 py-3 rounded-md border w-full ${
                        inputError ? 'border-red-500' : 'border-blue-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      aria-label="Tracking number"
                      disabled={loading}
                      aria-invalid={!!inputError}
                    />
                  </div>
                  {inputError && (
                    <p className="text-red-500 mt-2 flex items-center gap-1">
                      <FaExclamationTriangle className="inline" /> {inputError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:opacity-75"
                  aria-busy={loading}
                >
                  <FaSearch /> {loading ? 'Tracking...' : 'Track Order'}
                </button>
              </form>

              {/* Persistent error message */}
              {trackingError && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start gap-3 text-red-700">
                    <FaExclamationTriangle className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Couldn't find your order</h3>
                      <p className="mt-1 text-sm">{trackingError}</p>
                      <button
                        onClick={resetForm}
                        className="mt-3 text-sm text-red-800 hover:text-red-900 font-medium inline-flex items-center gap-1"
                      >
                        <FaUndo /> Try another code
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loading indicator */}
              {loading && (
                <div className="mt-8 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Order results */}
              {!loading && orderData && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-10"
                  aria-live="polite"
                >
                  <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                    {STATUS_ICONS[orderData.orderStatus] || (
                      <FaBoxOpen className="text-gray-500" />
                    )}{' '}
                    {orderData.orderStatus.toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-700 mb-2">
                    Tracking ID:{' '}
                    <span className="font-mono">{orderData.trackingCode}</span>
                  </p>
                  <p className="text-sm">
                    Customer:{' '}
                    <span className="font-semibold text-gray-900">
                      {orderData.user.fullNames}
                    </span>
                  </p>

                  <div className="mt-6 space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-700 mb-2">
                      Tracking History
                    </h3>
                    {paginatedHistory.length > 0 ? (
                      <ul className="text-sm text-gray-800 space-y-2">
                        {paginatedHistory.map((entry, index) => (
                          <li
                            key={`${entry.timestamp}-${index}`}
                            className="border-b border-blue-100 pb-2"
                          >
                            <time
                              dateTime={new Date(entry.timestamp).toISOString()}
                              className="text-blue-600 font-medium"
                            >
                              {new Date(entry.timestamp).toLocaleString()}
                            </time>
                            <br />
                            <span className="font-semibold">
                              {entry.status}
                            </span>{' '}
                            - {entry.note || 'No additional notes'}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm italic text-blue-500">
                        No tracking updates available
                      </p>
                    )}

                    {totalPages > 1 && (
                      <div className="flex justify-center mt-4 gap-2 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded-md min-w-[2.5rem] ${
                              currentPage === i + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600 border border-blue-600'
                            }`}
                            aria-label={`Go to page ${i + 1}`}
                            aria-current={
                              currentPage === i + 1 ? 'page' : undefined
                            }
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={resetForm}
                    className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                    aria-label="Track another package"
                  >
                    <FaUndo /> Track another package
                  </button>
                </motion.section>
              )}
            </article>

            <aside className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-blue-700 mb-4">
                Where to find your tracking number
              </h2>
              <ol className="text-gray-800 space-y-3 list-decimal list-inside">
                <li>Order confirmation email</li>
                <li>Your account - Order History</li>
                <li>SMS notifications</li>
              </ol>
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Example Tracking Numbers:
                </p>
                <div className="mt-2 space-y-2">
                  <code className="block bg-blue-200 text-blue-900 px-3 py-2 rounded-md font-mono break-all">
                    KS250615YW3Q
                  </code>
                  <code className="block bg-blue-200 text-blue-900 px-3 py-2 rounded-md font-mono break-all">
                    KS250615YW3P
                  </code>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default TrackOrderForm;
