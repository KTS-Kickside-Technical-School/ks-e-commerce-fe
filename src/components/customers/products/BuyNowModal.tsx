import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaMinus, FaMoneyBill, FaPhoneAlt } from 'react-icons/fa';
import { iProduct } from '../../../types/store';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  FaShoppingBag,
  FaBoxOpen,
  FaClock,
  FaStickyNote,
  FaEnvelope,
} from 'react-icons/fa';

import MomoLogo from '/momo-logo.webp';
import { FaTruckFast } from 'react-icons/fa6';
import { saveOrder } from '../../../requests/ordersRequests';

const BuyNowModal = ({
  product,
  onClose,
}: {
  product: iProduct;
  onClose: () => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const discountedPrice = useMemo(
    () => product.price * (1 - (product.discount || 0) / 100),
    [product]
  );
  const finalTotalPrice = useMemo(
    () =>
      Math.ceil(
        discountedPrice * quantity + product.shippingOptions.fee * quantity
      ),
    [discountedPrice, quantity]
  );
  const [userContact, setUserContact] = useState({
    phone: '',
    email: '',
  });

  useEffect(() => {
    const profile = sessionStorage.getItem('profile');
    if (!profile) return;

    const parsed = JSON.parse(profile);

    setUserContact({
      phone: parsed?.phone || '',
      email: parsed?.email || '',
    });

    const defaultAddress = parsed?.addresses?.find(
      (addr: any) => addr.isPrimary
    );
    if (defaultAddress) {
      setShippingAddress({
        street: defaultAddress.street || '',
        city: defaultAddress.city || '',
        region: defaultAddress.region || '',
        postalCode: defaultAddress.postalCode || '',
        country: defaultAddress.country || '',
      });
    }
  }, []);

  const handleAddressChange = useCallback((field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    if (finalTotalPrice < 1000) {
      toast.error('Minimum price for single product order is 1000RWF');
      return;
    }
    if (!userContact.phone.trim()) {
      toast.error('Please input phone number');
      return;
    }
    const orderData = {
      product: product._id,
      quantity,
      shippingOptions: {
        fee: product.shippingOptions.fee,
        note: product.shippingOptions.note,
        duration: product.shippingOptions.duration,
      },
      finalUnitPrice: discountedPrice,
      discount: product.discount || 0,
      finalTotalPrice,
      originalPrice: product.price,
      productName: product.productName,
      shippingAddress,
      contactInfo: {
        phone: userContact.phone,
        email: userContact.email,
      },
      paymentMethod: 'momo',
      productImages: product.images,
    };

    setIsProcessing(true);
    try {
      const response = await saveOrder(orderData);

      if (response.status !== 201) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setTimeout(() => {
        navigate(`/my-order/${response.data.order._id}`);
      }, 2000);
    } catch (error) {
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white h-[95%] overflow-auto rounded-2xl w-full max-w-3xl shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Confirm Order</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-blue-50 border border-blue-200 shadow-md rounded-xl p-4 mt-8 animate-fade-in flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
                  <FaMoneyBill className="text-green-500 text-xl" />
                  <span className="font-bold">Total Amount</span>
                </div>
                <span className="text-3xl font-extrabold text-blue-600 tracking-wide">
                  {finalTotalPrice} RWF
                </span>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaShoppingBag className="text-blue-600" /> Product Details
                </h3>

                <div className="flex items-center gap-4 animate-fade-in">
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className="w-24 h-24 object-cover rounded-xl ring-2 ring-blue-400 transition-transform hover:scale-105 duration-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {product.productName}
                    </p>
                    <div className="flex gap-2 items-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {discountedPrice} RWF
                      </span>
                      {product.discount > 0 && (
                        <span className="line-through text-sm text-gray-500">
                          {product.price} RWF
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-gray-100 hover:bg-blue-100 transition-colors border rounded-lg"
                  >
                    <FaMinus />
                  </button>
                  <span className="text-lg font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 bg-gray-100 hover:bg-blue-100 transition-colors border rounded-lg"
                  >
                    <FaPlus />
                  </button>
                </div>

                {product.shippingOptions && (
                  <div>
                    <div className="flex items-center gap-2">
                      <FaBoxOpen className="text-blue-500" />
                      <span>
                        Shipping Fee:{' '}
                        <strong>{product.shippingOptions.fee} RWF</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-500" />
                      <span>Duration: {product.shippingOptions.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaStickyNote className="text-blue-500" />
                      <span>Note: {product.shippingOptions.note}</span>
                    </div>
                  </div>
                )}
              </div>

              <motion.div
                className="space-y-6 p-4 bg-white rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h3 className="text-xl flex font-bold text-gray-800">
                  <FaTruckFast className="m-1 text-blue-600" />
                  <span>Shipping Address</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(shippingAddress).map(([key, value]) => (
                    <input
                      key={key}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={value}
                      onChange={(e) => handleAddressChange(key, e.target.value)}
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                      required
                    />
                  ))}
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-gray-700 font-medium flex items-center gap-2 mb-1">
                      <FaPhoneAlt className="text-blue-500" />
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={userContact.phone}
                      onChange={(e) =>
                        setUserContact((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      required
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium flex items-center gap-2 mb-1">
                      <FaEnvelope className="text-blue-500" />
                      Email
                    </label>
                    <input
                      value={userContact.email}
                      readOnly
                      className="w-full border p-2 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="mt-6 pt-4 border-t">
              <div className="bg-[#fff8e1] border border-yellow-300 p-5 rounded-xl shadow-sm mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <img src={MomoLogo} alt="MoMo Pay Logo" className="w-20" />
                  <h4 className="text-xl font-bold text-yellow-700">
                    Pay with MoMo (MTN Mobile Money)
                  </h4>
                </div>
                <ul className="list-decimal list-inside space-y-2 text-sm text-gray-800">
                  <li>
                    On your phone, dial{' '}
                    <span className="font-semibold text-yellow-800">
                      *182*8*1*621152#
                    </span>
                  </li>
                  <li>
                    Enter the amount shown above and follow the prompts to
                    complete the payment.
                  </li>
                  <li>
                    Take a screenshot or save the SMS message as your payment
                    proof.
                  </li>
                  <li>
                    Upload the proof of payment on the next step (screenshot or
                    confirmation message).
                  </li>
                  <li>
                    Click{' '}
                    <span className="font-semibold text-yellow-800">
                      "Confirm Purchase"
                    </span>{' '}
                    to finalize your order.
                  </li>
                  <li>
                    Your product will be prepared and delivered within the
                    stated delivery time.
                  </li>
                </ul>
                <p className="mt-4 text-xs text-gray-500 italic">
                  Note: Ensure you have enough funds in your MoMo account before
                  initiating the transaction.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-semibold text-white ${
                  isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyNowModal;
