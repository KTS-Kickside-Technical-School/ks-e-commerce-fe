import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaPlus,
  FaMinus,
  FaCreditCard,
  FaPaypal,
  FaMobileAlt,
} from 'react-icons/fa';
import { ImSpinner } from 'react-icons/im';
import { iProduct } from '../../../types/store';
import { safeToFixed } from '../../../helpers/round';
import { toast } from 'sonner';
import { userPaySIngleProductCartWithStripe } from '../../../requests/paymentRequests';
import { FiInfo } from 'react-icons/fi';

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
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const discountedPrice = useMemo(
    () => product.price * (1 - (product.discount || 0) / 100),
    [product.price, product.discount]
  );

  const finalTotalPrice = Math.ceil(
    useMemo(() => discountedPrice * quantity, [discountedPrice, quantity])
  );

  useEffect(() => {
    const profile = sessionStorage.getItem('profile');
    if (!profile) return;

    const parsedProfile = JSON.parse(profile);
    const defaultAddress = parsedProfile.addresses.find(
      (addr: any) => addr.isPrimary
    );
    console.log(defaultAddress);
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
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleStripePayment = async (data: any) => {
    setIsProcessing(true);
    try {
      const response = await userPaySIngleProductCartWithStripe(data);
      localStorage.setItem('new_order', response.data.orderId);
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    const orderData = {
      product: product._id,
      quantity,
      finalUnitPrice: discountedPrice,
      discount: product.discount || 0,
      images: product.images,
      finalTotalPrice,
      originalPrice: product.price,
      productName: product.productName,
      addresses: shippingAddress,
    };
    if (orderData.finalTotalPrice < 1000) {
      toast.error('Minimum price for single product order is 1000RWF');
      return;
    }
    if (selectedPayment === 'Bank Card') {
      await handleStripePayment(orderData);
      return;
    }
  };

  const paymentMethods = [
    { name: 'Bank Card', icon: <FaCreditCard className="text-xl" /> },
    { name: 'PayPal', icon: <FaPaypal className="text-xl" /> },
    { name: 'Mobile Money', icon: <FaMobileAlt className="text-xl" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Confirm Order</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <div className="flex items-center gap-4">
                <img
                  src={product.images[0]}
                  className="w-20 h-20 object-cover rounded-lg"
                  alt={product.productName}
                />
                <div>
                  <p className="font-medium">{product.productName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-600 font-bold">
                      {safeToFixed(discountedPrice)}RWF
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm line-through text-gray-500">
                        {safeToFixed(product.price)}RWF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg border hover:bg-gray-50"
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-medium w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg border hover:bg-gray-50"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Shipping Address</h3>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(shippingAddress).map(([key, value]) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={`${
                      key.charAt(0).toUpperCase() + key.slice(1)
                    }`}
                    className="w-full p-2 border rounded-lg"
                    value={value}
                    onChange={(e) => handleAddressChange(key, e.target.value)}
                    required
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold text-primary-500">
                {safeToFixed(finalTotalPrice)}RWF
              </span>
            </div>
            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded-lg mt-4">
              <FiInfo className="mt-1 w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Note:</strong> Prices are{' '}
                <span className="underline">rounded up</span> to the nearest RWF
                to meet payment system requirements and ensure sellers are not
                underpaid.
              </p>
            </div>
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">
                Select Payment Method
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.name}
                    className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl transition-all ${
                      selectedPayment === method.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedPayment(method.name)}
                  >
                    {method.icon}
                    <span className="font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className={`w-full ${
                selectedPayment ? 'bg-primary-500' : 'bg-gray-500'
              } text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <ImSpinner className="animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                'Confirm Purchase'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
