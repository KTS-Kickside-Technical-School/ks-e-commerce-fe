import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  // FaRegHeart,
  // FaHeart,
  // FaShoppingBag,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaShoppingBag,
  FaTruck,
  // FaShoppingCart,
} from 'react-icons/fa';
import Header from '../../../components/customers/Header';
import Footer from '../../../components/customers/Footer';
import {
  customerViewSingleProduct,
  whatsappNumber,
} from '../../../requests/productsRequests';
import { useNavigate, useParams } from 'react-router-dom';
import { safeToFixed } from '../../../helpers/round';
import { iProduct } from '../../../types/store';
// import { customerAddProductToCart } from '../../../requests/cartRequests';
import {
  // toast,
  Toaster,
} from 'sonner';
import LoginPromptModal from '../../../components/customers/LoginPromptModal';
// import { ImSpinner } from 'react-icons/im';
import BuyNowModal from '../../../components/customers/products/BuyNowModal';
import TextWhatsappButton from '../../../components/customers/products/TextWhatsappButton';
import Product from '../../../components/customers/products/Product';
import ProductTabs from '../../../components/customers/products/ProductTabs';
import SEO from '../../../middlewares/SEO';
import { ImSpinner } from 'react-icons/im';
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
  shippingOptions: {
    fee: 0,
    note: '',
    duration: '',
  },
};
export default function ProductDetails() {
  const [activeImage, setActiveImage] = useState(0);
  // const [isWishlisted, setIsWishlisted] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);
  const [product, setProduct] = useState<iProduct>(defaultProduct);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoginPromptOpen, setIsPromptModalOpen] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [shop, setShop] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<iProduct[]>([]);

  const whatsappMessage = `Hi! I'm interested in ${product.productName} (${window.location.href})`;

  const navigate = useNavigate();
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
      setShop(response.data.product.shop);
      setRelatedProducts(response.data.relatedProducts || []);
      // setIsWishlisted(false);
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
    // setIsWishlisted(false);
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
  // const [isCartLoading, setIsCartLoading] = useState(false);
  // const handleAddProductToCart = async (isBuySelected = false) => {
  //   setIsCartLoading(true);
  //   try {
  //     const response = await customerAddProductToCart({
  //       product: product._id,
  //     });

  //     if (response.status === 201) {
  //       toast.success(response.message || 'Product added to cart');
  //       if (isBuySelected) {
  //         navigate('/my-cart');
  //       }
  //     } else if (response.status === 401) {
  //       setIsPromptModalOpen(true);
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error(error instanceof Error ? error.message : 'Operation failed');
  //   } finally {
  //     setIsCartLoading(false);
  //   }
  // };

  if (isLoading) {
    return (
      <>
        <SEO title="Loading Product - Kickside Store" />
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
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEO title="Wait a moment, or try again later - Kickside Store" />
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
      <SEO
        title={`${product?.productName} - Kickside Store`}
        description={`${product.description}`}
        ogImage={product.images?.[0]}
        ogUrl={window.location.href}
        ogTitle={`${product.productName} - Kickside Store`}
        ogDescription={`${product.description.slice(0, 150)}...`}
        canonicalUrl={window.location.href}
      />
      <Toaster richColors position="top-center" />
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="px-4 lg:px-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {product.productName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>SKU: {product._id.slice(-6)}</span>
            <span className="text-gray-300">•</span>
            <span>{product.category}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Image Gallery Section */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group">
              <img
                src={
                  product.images?.[activeImage] ?? '/default-placeholder.jpg'
                }
                alt={product.productName}
                className="w-full h-full object-contain transition-opacity duration-500"
              />

              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    handleImageChange(
                      (activeImage - 1 + product.images.length) %
                        product.images.length
                    )
                  }
                  className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-transform duration-200 hover:scale-110"
                >
                  <FaChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={() =>
                    handleImageChange((activeImage + 1) % product.images.length)
                  }
                  className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-transform duration-200 hover:scale-110"
                >
                  <FaChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            <div className="grid grid-cols-10 gap-3">
              {product.images.map((img, index) => (
                <button
                  key={img}
                  onClick={() => handleImageChange(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === index
                      ? 'border-primary-500 scale-105 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
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

          <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-160px)] lg:overflow-y-auto lg:pb-8 space-y-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="space-y-4">
                <div className="space-y-4 mt-6">
                  <TextWhatsappButton
                    phoneNumber={product.shop?.phone || whatsappNumber}
                    message={whatsappMessage}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                    buttonText="Chat on WhatsApp"
                  />
                  <button
                    onClick={() => {
                      if (!sessionStorage.getItem('profile')) {
                        setIsPromptModalOpen(true);
                        return;
                      }
                      setShowBuyModal(true);
                    }}
                    disabled={showBuyModal}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                      showBuyModal
                        ? 'bg-primary-100 text-primary-500 cursor-not-allowed'
                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                    }`}
                  >
                    {showBuyModal ? (
                      <ImSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaShoppingBag className="w-5 h-5" />
                        Buy Now
                      </>
                    )}
                  </button>

                  {/* <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAddProductToCart()}
                    disabled={isCartLoading}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 ${
                      isCartLoading
                        ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {isCartLoading ? (
                      <ImSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 ${
                      isWishlisted
                        ? 'border-red-500 text-red-600 bg-red-50'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {isWishlisted ? (
                      <FaHeart className="w-5 h-5 text-red-600" />
                    ) : (
                      <FaRegHeart className="w-5 h-5" />
                    )}
                    <span>Wishlist</span>
                  </button>
                </div> */}
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 bg-blue-50/40 border border-blue-100 rounded-xl px-4 py-3 shadow-sm transition duration-300">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl flex font-extrabold text-blue-700 tracking-tight">
                        {discountedPrice} RWF
                      </span>
                      {product.discount > 0 && (
                        <span className="text-base text-gray-500 line-through">
                          {safeToFixed(product.price)} RWF
                        </span>
                      )}
                    </div>

                    {product.discount > 0 && (
                      <div className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full sm:ml-auto animate-pulse shadow-sm">
                        -{product.discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-md">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100 animate-fade-in space-y-3 transition-all duration-300 ease-in-out">
                <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <FaTruck className="text-blue-600" /> Shipping Info
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span className="font-medium">Fee:</span>
                  {product?.shippingOptions?.fee === 0 ||
                  product.shippingOptions.fee === 0 ? (
                    <span className="px-3 py-1 text-sm font-bold text-green-700 bg-green-100 rounded-full animate-bounce">
                      🎉 FREE Shipping
                    </span>
                  ) : (
                    <span className="font-semibold text-blue-700">
                      {product.shippingOptions.fee} RWF
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span className="font-medium">Estimated Time:</span>
                  <span className="text-gray-900">
                    {product.shippingOptions.duration}
                  </span>
                </div>

                {product.shippingOptions.note && (
                  <div className="text-sm text-gray-500 italic border-t border-blue-100 pt-2">
                    <FaInfoCircle className="inline-block mr-1 text-blue-400" />
                    {product.shippingOptions.note}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ProductTabs product={product} shop={shop} />

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 3).map((related) => (
                <Product
                  key={related._id}
                  product={related}
                  isInCart={false}
                  isOnWishlist={false}
                  isFetchingData={false}
                />
              ))}
            </div>
          </div>
        )}
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
