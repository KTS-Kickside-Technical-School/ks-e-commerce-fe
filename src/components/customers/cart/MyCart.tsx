import { useEffect, useState } from 'react';
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaChevronLeft,
  FaChevronRight,
  FaCreditCard,
  FaPaypal,
  FaMobileAlt,
} from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';
import {
  customerClearCart,
  customerRemoveProductFromCart,
  customerUpdateCart,
  customerViewCartProducts,
} from '../../../requests/cartRequests';
import { toast, Toaster } from 'sonner';
import { FaX } from 'react-icons/fa6';
import ClearCartConfirmation from './ClearCartConfirmation';
import { Link } from 'react-router-dom';
import PayNowConfirmAddress from './PayNowConfirmAddress';
import { getProfile } from '../../../utils/axios';
import CartSkeletonLoader from './CartSkeletonLoader';
import { iUserProfile } from '../../../types/store';
import { userPayCartWithStripe } from '../../../requests/paymentRequests';

const CartCheckout = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirmation, setshowClearConfirmation] = useState(false);
  const [isPayNowOpen, setIsPayNowOpen] = useState(false);

  const paymentMethods = [
    { name: 'Bank Card', icon: <FaCreditCard className="text-xl" /> },
    { name: 'PayPal', icon: <FaPaypal className="text-xl" /> },
    { name: 'Mobile Money', icon: <FaMobileAlt className="text-xl" /> },
  ];
  const [profile, setProfile] = useState<iUserProfile>(() => {
    const savedProfile = getProfile();
    try {
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      return profile;
    } catch (error) {
      return { _id: '', addresses: [] };
    }
  });

  const fetchCartProducts = async () => {
    setIsLoading(true);
    try {
      const response = await customerViewCartProducts();
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to fetch cart items');
      }
      setCartItems(
        response.data.cartProducts.map((item: any) => ({
          ...item,
          currentImageIndex: 0,
        }))
      );
    } catch (error: any) {
      toast.error(error.message || 'Unknown error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const handleUpdateQuantity = async (
    _id: any,
    productId: string,
    quantity: number
  ) => {
    try {
      if (quantity < 1) {
        toast.error("Can't be less than minimum quantity");
        return;
      }

      const response = await customerUpdateCart({
        product: productId,
        quantity,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success('Cart quantity updated successfully');
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === _id ? { ...item, ...response.data.updatedCart } : item
          )
        );
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    }
  };

  const handleRemoveItem = async (_id: any, product: string) => {
    try {
      const response = await customerRemoveProductFromCart(product);
      if (response.status === 200) {
        toast.success('Product removed from cart successfully!');
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== _id)
        );
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    }
  };

  const handleImageNavigation = (_id: string, direction: 'prev' | 'next') => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === _id) {
          const images = item.product?.images || [];
          const newIndex =
            direction === 'next'
              ? (item.currentImageIndex + 1) % images.length
              : (item.currentImageIndex - 1 + images.length) % images.length;
          return { ...item, currentImageIndex: newIndex };
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;

      const discountedPrice =
        discount > 0 ? price * (1 - discount / 100) : price;

      return sum + discountedPrice * item.quantity;
    }, 0);
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    if (selectedPayment === 'Bank Card') {
      await customerPayByStripe();
      return;
    } else {
      toast.error('Invalid Payment method selected!');
    }
  };

  const customerPayByStripe = async () => {
    try {
      const response = await userPayCartWithStripe();
      console.log(response);
      if (response.status === 201) {
        localStorage.setItem('new-order', response.data.order._id);
        window.location.href = response?.data?.session;
        return;
      }
      toast.error(response.message);
    } catch (error: any) {
      toast.error('Unknonw error occurred', error.message);
    }
  };
  return (
    <>
      <Toaster richColors position="top-center" />
      <Header />
      <div className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              My Shopping Cart
            </h2>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={() => setshowClearConfirmation(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 border border-gray-200  rounded-lg shadow-xs hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all duration-200 group"
              aria-label="Clear cart"
            >
              <FaTrash className="w-4 h-4 text-white group-hover:text-red-500 transition-colors" />
              <span className="text-sm font-medium text-white group-hover:text-red-600">
                Clear Cart
              </span>
            </button>
          )}
        </div>

        {isLoading ? (
          <CartSkeletonLoader />
        ) : (
          <div
            className={`flex flex-col ${
              showCheckout ? 'lg:flex-row' : ''
            } gap-6`}
          >
            <div className={`flex-1 ${showCheckout ? 'lg:max-w-2xl' : ''}`}>
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const images = product.images || [];
                    const currentImage = images[item.currentImageIndex] || '';

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-32 h-32 overflow-hidden rounded-lg group">
                          <img
                            src={currentImage}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                          />
                          {images.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                                onClick={() =>
                                  handleImageNavigation(item._id, 'prev')
                                }
                              >
                                <FaChevronLeft />
                              </button>
                              <button
                                className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                                onClick={() =>
                                  handleImageNavigation(item._id, 'next')
                                }
                              >
                                <FaChevronRight />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <Link
                            to={`/product/${product.slugF}`}
                            className="text-lg font-semibold text-gray-800"
                          >
                            {product.productName}
                          </Link>
                          <p className="text-lg font-medium text-gray-900">
                            {product.discount ? (
                              <>
                                <span className="line-through text-gray-400 mr-2">
                                  {product.price?.toFixed(2)}RWF
                                </span>
                                <span className="text-blue-600">
                                  {(
                                    product.price *
                                    (1 - product.discount / 100)
                                  ).toFixed(2)}
                                  RWF
                                </span>
                                <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                  {product.discount}% OFF
                                </span>
                              </>
                            ) : (
                              <span>{product.price?.toFixed(2)}RWF</span>
                            )}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                              <button
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id,
                                    item.product._id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <FaMinus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id,
                                    item.product._id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <FaPlus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              onClick={() =>
                                handleRemoveItem(item._id, item.product._id)
                              }
                            >
                              <FaTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!showCheckout && cartItems.length > 0 && (
                <button
                  className="mt-6 w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </button>
              )}
            </div>

            {showCheckout && (
              <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
                <div className="flex">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex-1">
                    Checkout Summary
                  </h3>
                  <button
                    className="text-red-500 hover:text-gray-800 transition-colors"
                    onClick={() => setShowCheckout(false)}
                  >
                    <FaX />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const originalPrice = product.price || 0;
                    const discount = product.discount || 0;
                    const discountedPrice =
                      discount > 0
                        ? originalPrice * (1 - discount / 100)
                        : originalPrice;
                    const hasDiscount =
                      discountedPrice && discountedPrice < originalPrice;
                    const totalPrice = discountedPrice * item.quantity;
                    const totalOriginalPrice = originalPrice * item.quantity;

                    return (
                      <div
                        key={item._id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <span className="text-gray-600">
                            {product.productName} × {item.quantity}
                          </span>
                          {hasDiscount && (
                            <div className="text-xs text-green-600 mt-1">
                              Discount applied:{' '}
                              {Math.round(
                                (1 - discountedPrice / originalPrice) * 100
                              )}
                              %
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end">
                          {hasDiscount ? (
                            <>
                              <span className="font-medium text-gray-900">
                                {totalPrice.toFixed(2)} RWF
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {totalOriginalPrice.toFixed(2)} RWF
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {totalPrice.toFixed(2)} RWF
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-800">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {calculateTotal().toFixed(2)} RWF
                    </span>
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
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    onClick={() => setIsPayNowOpen(true)}
                    disabled={!selectedPayment}
                  >
                    Pay Now ({calculateTotal().toFixed(2)} RWF)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />

      {isPayNowOpen && (
        <PayNowConfirmAddress
          onClose={() => setIsPayNowOpen(false)}
          onConfirm={async () => {
            console.log(selectedPayment);
            await handlePayment();
          }}
          profile={profile}
          setProfile={setProfile}
        />
      )}
      {showClearConfirmation && (
        <ClearCartConfirmation
          onClose={() => setshowClearConfirmation(false)}
          onClear={async () => {
            if (cartItems.length === 0) {
              setshowClearConfirmation(false);
              return;
            }

            try {
              const response = await customerClearCart();

              if (response.status >= 200 && response.status < 300) {
                toast.success(response.message || 'Cart cleared successfully');
                setCartItems([]);
              } else {
                throw new Error(response.message || 'Failed to clear cart');
              }
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'Failed to clear cart. Please try again.'
              );
            } finally {
              setshowClearConfirmation(false);
            }
          }}
        />
      )}
    </>
  );
};

export default CartCheckout;
