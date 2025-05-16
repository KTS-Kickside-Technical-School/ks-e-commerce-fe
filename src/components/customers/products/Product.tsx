import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
} from 'react-icons/fa';
import {  ImSpinner2 } from 'react-icons/im';
import { iProduct } from '../../../types/store';
import ProductSkeletonLoader from './ProductSkeletonLoader';
import { toast, Toaster } from 'sonner';
import { customerAddProductToCart } from '../../../requests/cartRequests';
import LoginPromptModal from '../LoginPromptModal';
import BuyNowModal from './BuyNowModal';

interface ProductProps {
  product?: iProduct;
  isFetchingData: boolean;
  isOnWishlist: boolean;
  isInCart: boolean;
}

export const formatPrice = (value: number | string) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numericValue) ? '0.00' : numericValue.toFixed(2);
};

const Product = ({
  product,
  isFetchingData,
  isOnWishlist,
  isInCart,
}: ProductProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isLoginPromptOpen, setIsPromptModalOpen] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  if (isFetchingData || !product) return <ProductSkeletonLoader />;

  const { images = [], discount, productName, price, slug, stock } = product;
  const hasMultipleImages = images.length > 1;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const numericDiscount =
    typeof discount === 'string' ? parseFloat(discount) : discount;
  const discountedPrice =
    numericDiscount > 0
      ? numericPrice * (1 - numericDiscount / 100)
      : numericPrice;

  useEffect(() => {
    if (hasMultipleImages) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [images, hasMultipleImages]);

  const handleAddProductToCart = async () => {
    setIsCartLoading(true);
    try {
      const response = await customerAddProductToCart({
        product: product._id,
      });
      if (response.status === 201) {
        toast.success('Product added to cart successfully');
      } else if (response.status === 401) {
        setIsPromptModalOpen((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to add product to cart');
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
        <Toaster richColors position="top-center" />
        <div className="relative aspect-square overflow-hidden">
          {numericDiscount > 0 && (
            <div className="absolute top-2 left-2 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              {Math.round(numericDiscount)}% OFF
            </div>
          )}

          <Link
            to={`/product/${slug}`}
            className="block h-full z-[200] relative" // Added relative positioning
          >
            {images.length > 0 && (
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={productName}
                  className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer z-10"
                  loading="lazy"
                />

                <div
                  className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10 z-10"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (!target.closest('button')) {
                      navigate(`/product/${slug}`);
                    }
                  }}
                />
              </div>
            )}
          </Link>

          {hasMultipleImages && (
            <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
                className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <FaChevronLeft className="text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  );
                }}
                className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <FaChevronRight className="text-gray-700" />
              </button>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col justify-between">
          <Link
            to={`/product/${slug}`}
            className="text-base font-bold text-gray-900 block line-clamp-2 
          hover:text-primary-500 transition-colors"
          >
            {productName}
          </Link>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span
              className={`font-medium ${
                stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>

            <div className="flex gap-2">
              <button
                className={`flex items-center justify-center p-2 rounded-full shadow-lg transition-colors duration-200 ${
                  isInCart
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-transparent text-primary-500 hover:text-primary-600'
                }`}
                aria-label="Add to cart"
                onClick={handleAddProductToCart}
                disabled={isCartLoading}
              >
                {isCartLoading ? (
                  <ImSpinner2 className="animate-spin text-lg" />
                ) : (
                  <FaShoppingCart className="text-lg" />
                )}
              </button>

              <button
                className={`flex items-center justify-center p-2 rounded-full shadow-lg transition-colors duration-200 ${
                  isOnWishlist
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-transparent text-red-500 hover:text-red-600'
                }`}
                aria-label="Add to wishlist"
              >
                <FaHeart className="text-lg" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            {numericDiscount > 0 ? (
              <>
                <span className="text-lg font-bold text-primary-500">
                  {formatPrice(discountedPrice)} RWF
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(numericPrice)} RWF
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary-500">
                {formatPrice(numericPrice)} RWF
              </span>
            )}
          </div>
          <Link
            to={`/product/${slug}`}
            className={`w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-3 rounded-lg font-medium transition-colors duration-300 ${
              showBuyModal
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-primary-600'
            }`}
          >
            <FaShoppingCart className="w-5 h-5" />
            <span>Buy Now</span>
          </Link>
        </div>
      </div>
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
};

export default memo(Product);
