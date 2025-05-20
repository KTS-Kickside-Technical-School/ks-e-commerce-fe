import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaWhatsapp,
} from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import { iProduct } from '../../../types/store';
import ProductSkeletonLoader from './ProductSkeletonLoader';
import { toast, Toaster } from 'sonner';
import { customerAddProductToCart } from '../../../requests/cartRequests';
import LoginPromptModal from '../LoginPromptModal';
import BuyNowModal from './BuyNowModal';
import { whatsappNumber } from '../../../requests/productsRequests';

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
  const whatsappMessage = `Hi! I'm interested in ${product?.productName} (${window.location.href}product/${product?.slug})`;

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
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images, hasMultipleImages]);

  const handleAddProductToCart = async () => {
    setIsCartLoading(true);
    try {
      const response = await customerAddProductToCart({
        product: product._id,
      });
      console.log(response);
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
        <Toaster richColors position="top-center" />

        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden">
          <Link to={`/product/${slug}`} className="block h-full relative">
            <div className="relative h-full w-full">
              {images.map((img, index) => (
                <img
                  key={img}
                  src={img}
                  alt={productName}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
          </Link>

          {/* Discount Badge */}
          {numericDiscount > 0 && (
            <div className="absolute bottom-2 left-2 z-20 bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
              Save {Math.round(numericDiscount)}%
            </div>
          )}

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
                className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors backdrop-blur-sm"
              >
                <FaChevronLeft className="text-gray-700 w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  );
                }}
                className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors backdrop-blur-sm"
              >
                <FaChevronRight className="text-gray-700 w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Link
              to={`/product/${slug}`}
              className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
            >
              {productName}
            </Link>

            {/* Price Section */}
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(
                  numericDiscount > 0 ? discountedPrice : numericPrice
                )}{' '}
                RWF
              </span>
              {numericDiscount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(numericPrice)} RWF
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`flex items-center gap-1 ${
                stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddProductToCart}
              disabled={isCartLoading || stock <= 0}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                isInCart
                  ? 'bg-primary-600 text-white'
                  : 'bg-primary-500/10 text-primary-600 hover:bg-primary-500/20'
              } ${isCartLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isCartLoading ? (
                <ImSpinner2 className="animate-spin w-5 h-5" />
              ) : (
                <FaShoppingCart className="w-5 h-5" />
              )}
              <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
            </button>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-lg font-medium transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span className="hidden sm:inline">Chat</span>
            </a>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between">
            <button
              className={`flex items-center gap-2 text-sm ${
                isOnWishlist
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-red-600'
              } transition-colors`}
            >
              <FaHeart
                className={`w-5 h-5 ${
                  isOnWishlist ? 'fill-current' : 'stroke-current'
                }`}
              />
              <span>{isOnWishlist ? 'Saved' : 'Save'}</span>
            </button>

            <Link
              to={`/product/${slug}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              View details →
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
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
