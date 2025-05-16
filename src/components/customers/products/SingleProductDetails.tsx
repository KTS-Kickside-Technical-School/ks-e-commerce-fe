import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  FaRegHeart,
  FaHeart,
  FaShoppingBag,
  FaClock,
  FaTag,
} from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';
import { customerViewSingleProduct } from '../../../requests/productsRequests';
import { useNavigate, useParams } from 'react-router-dom';
import { safeToFixed } from '../../../helpers/round';
import { iProduct } from '../../../types/store';
import { customerAddProductToCart } from '../../../requests/cartRequests';
import { toast, Toaster } from 'sonner';
import LoginPromptModal from '../LoginPromptModal';
import { ImSpinner } from 'react-icons/im';
import BuyNowModal from './BuyNowModal';
const defaultProduct: iProduct = {
  productName: '',
  description: '',
  price: 0,
  images: [],
  discount: 0,
  slug: '',
  stock: 0,
  _id: '',
  category: '',
};
export default function ProductDetails() {
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);
  const [product, setProduct] = useState<iProduct>(defaultProduct);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoginPromptOpen, setIsPromptModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showBuyModal, setShowBuyModal] = useState(false);

  const discountedPrice = useMemo(() => {
    return product.price * (1 - (product.discount || 0) / 100);
  }, [product.price, product.discount]);

  const fetchSingleProduct = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setActiveImage(0);
    setAutoSlide(true);

    try {
      if (!slug) {
        setError('Product not found');
        return;
      }

      const response = await customerViewSingleProduct(slug);
      if (response.status !== 200) {
        setError(response.message);
        return;
      }

      setProduct(response.data.product);
      setIsWishlisted(false);
    } catch (error) {
      setError('Failed to fetch product details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchSingleProduct();
  }, [fetchSingleProduct]);

  useEffect(() => {
    setActiveImage(0);
    setIsWishlisted(false);
    setAutoSlide(true);
    setProduct(defaultProduct);
    setIsLoading(true);
    setError('');
  }, [slug]);

  useEffect(() => {
    if (autoSlide && product?.images?.length > 1) {
      const interval = setInterval(() => {
        setActiveImage((prev) =>
          prev === product.images.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoSlide, product?.images]);

  const handleImageChange = (index: number) => {
    setActiveImage(index);
    setAutoSlide(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setAutoSlide(true), 10000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const handleAddProductToCart = async (isBuySelected = false) => {
    setIsCartLoading(true);
    try {
      const response = await customerAddProductToCart({
        product: product._id,
      });

      if (response.status === 201) {
        toast.success(response.message || 'Product added to cart');
        if (isBuySelected) {
          navigate('/my-cart');
        }
      } else if (response.status === 401) {
        setIsPromptModalOpen(true);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setIsCartLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            <div className="flex gap-4 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>
        </div>
        <div className="mt-8 h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Header />
          <div className="text-red-500 text-center py-8">{error}</div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 px-4 lg:px-0">
          {product.productName}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={
                    product.images?.[activeImage] ?? '/default-placeholder.jpg'
                  }
                  alt={product.productName}
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    handleImageChange(
                      activeImage > 0
                        ? activeImage - 1
                        : product.images.length - 1
                    )
                  }
                  className="bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    handleImageChange((activeImage + 1) % product.images.length)
                  }
                  className="bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={img}
                  onClick={() => handleImageChange(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === index
                      ? 'border-primary-500 scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit z-[30] bg-white">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {(product.discount || 0) > 0 && (
                  <div className="relative group">
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pulse">
                      {product.discount}% OFF
                      <div className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shadow-md">
                        !
                      </div>
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-3">
                  <div className="relative group transform transition-transform duration-200 hover:scale-105">
                    <div className="absolute -inset-1 bg-primary-100 rounded-lg blur opacity-70 group-hover:opacity-90 transition-opacity"></div>
                    <span
                      className={`relative text-3xl font-extrabold ${
                        product.discount ? 'text-primary-600' : 'text-gray-900'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-500 mr-2">
                        Now:
                      </span>
                      {safeToFixed(discountedPrice)}RWF
                      <FaShoppingBag className="inline-block ml-2 text-primary-500 w-5 h-5" />
                    </span>
                  </div>

                  {(product.discount || 0) > 0 && (
                    <div className="relative inline-block">
                      <div className="flex items-center text-gray-500">
                        <span className="text-sm font-medium mr-1">Was:</span>
                        <span className="line-through mr-1">
                          {safeToFixed(product?.price)}RWF
                        </span>
                        <FaTag className="text-red-400 w-3 h-3" />
                      </div>

                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md z-10">
                        <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-red-500 transform -translate-x-1/2 rotate-45">
                          You save:{' '}
                          {safeToFixed(
                            product.price * (product.discount / 100)
                          )}
                          RWF
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(product.discount || 0) > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <FaClock className="w-4 h-4" />
                  <span>Limited time offer! Ends soon</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button
                className={`w-full bg-primary-500 text-white py-3 rounded-lg font-medium transition-colors ${
                  showBuyModal
                    ? 'opacity-75 cursor-not-allowed'
                    : 'hover:bg-primary-600'
                }`}
                onClick={() => {
                  if (!sessionStorage.getItem('profile')) {
                    setIsPromptModalOpen(true);
                    return;
                  }
                  setShowBuyModal(true);
                }}
                disabled={showBuyModal}
              >
                {showBuyModal ? (
                  <span className="flex items-center justify-center gap-2">
                    <ImSpinner className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Buy Now'
                )}
              </button>

              <div className="flex gap-4">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 border-2 border-primary-500 py-3 rounded-lg font-medium transition-colors ${
                    isCartLoading
                      ? 'text-primary-400 border-primary-300 cursor-not-allowed'
                      : 'text-primary-500 hover:bg-primary-50'
                  }`}
                  onClick={() => handleAddProductToCart()}
                  disabled={isCartLoading}
                >
                  {isCartLoading ? (
                    <ImSpinner className="animate-spin" />
                  ) : (
                    <>
                      <FaShoppingBag className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-12 flex items-center justify-center border-2 rounded-lg transition-colors ${
                    isWishlisted
                      ? 'border-secondary-500 text-secondary-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  {isWishlisted ? (
                    <FaHeart className="w-5 h-5 text-secondary-500" />
                  ) : (
                    <FaRegHeart className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Product Details</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
            <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit"></div>
          </div>
        </div>
      </div>
      <Footer />
      {isLoginPromptOpen && (
        <LoginPromptModal
          isOpen={true}
          onClose={() => setIsPromptModalOpen((prev) => !prev)}
          onLogin={() => {
            localStorage.setItem('productToAddToCart', product._id);
            navigate('/login');
          }}
          msg={'You need to login to add items to cart'}
        />
      )}
      {showBuyModal && (
        <BuyNowModal product={product} onClose={() => setShowBuyModal(false)} />
      )}
    </>
  );
}
