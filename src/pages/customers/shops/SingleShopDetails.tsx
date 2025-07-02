import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaShareAlt,
  FaCopy,
  FaArrowLeft,
  FaStore,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { iProduct, ISellerShop } from '../../../types/store';
import { getShopDetailsById } from '../../../requests/shopRequest';
import Product from '../../../components/customers/products/Product';
import Header from '../../../components/customers/Header';
import CoverCarousel from '../../../components/customers/shops/CoverCarousel';
import { toast, Toaster } from 'sonner';
import Footer from '../../../components/customers/Footer';
import SEO from '../../../middlewares/SEO';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PRODUCTS_PER_PAGE = 15;

const SingleShopDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ISellerShop | null>(null);
  const [products, setProducts] = useState<iProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getShopDetailsById(id);

        if (response.status === 200) {
          setShop(response.data.shop);
          setProducts(response.data.products || []);
        } else if (response.status === 404) {
          setNotFound(true);
          setError('Shop not found');
        } else {
          setError('Failed to load shop details. Please try again later.');
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNotFound(true);
          setError('This shop does not exist or has been removed');
        } else if (err.message === 'Network Error') {
          setError('Network connection failed. Please check your internet.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchShopDetails();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Shop link copied to clipboard!');
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [currentPage, products]);

  const handleShare = async () => {
    const shareData = {
      title: shop?.name,
      text: `Check out ${shop?.name} - ${shop?.description?.substring(
        0,
        100
      )}...`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('Sharing failed. Please try again.');
    }
  };

  // Modern skeleton loading
  const LoadingSkeleton = () => (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="relative w-full h-64 md:h-80 mb-16 rounded-xl overflow-hidden bg-gray-100">
        <Skeleton height="100%" />
      </div>

      <div className="absolute -bottom-16 left-6 z-10 flex items-center gap-4">
        <Skeleton circle width={96} height={96} />
        <Skeleton width={200} height={32} />
      </div>

      <div className="pt-24 px-2">
        <Skeleton count={3} height={24} className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <Skeleton height={200} />
              <div className="p-4">
                <Skeleton height={24} width="70%" />
                <Skeleton height={20} width="40%" className="mt-2" />
                <Skeleton
                  height={36}
                  width="100%"
                  className="mt-4 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced error component
  const ErrorDisplay = () => (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mb-6">
          <FaExclamationTriangle size={36} />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {notFound ? 'Shop Not Found' : 'Something Went Wrong'}
        </h2>

        <p className="text-gray-600 mb-6">
          {error || "We couldn't load this shop. Please try again later."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Refresh Page
          </button>
          <button
            onClick={() => navigate('/shops')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <FaArrowLeft size={14} />
            Browse Shops
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Toaster richColors position="top-center" />
      <SEO
        title={`${shop?.name || 'Shop'} ${shop?.description} - Shop Details`}
        description={shop?.description || 'Shop details page'}
        keywords="online shop, products, shopping"
        ogImage={shop?.logo}
        ogUrl={window.location.href}
      />

      <Header />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorDisplay />
      ) : (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="relative w-full h-64 md:h-80 mb-16 rounded-xl overflow-hidden shadow-lg">
            {shop?.images && shop.images.length > 0 ? (
              <CoverCarousel images={shop.images} />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <FaStore className="text-white opacity-30" size={64} />
              </div>
            )}

            <div className="absolute bottom-10 left-6 z-100 flex items-center gap-4">
              <img
                src={shop?.logo}
                alt={`${shop?.name} logo`}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-xl bg-white"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/112';
                  e.currentTarget.classList.add('bg-gray-200', 'p-2');
                }}
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 drop-shadow-sm">
                  {shop?.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {products.length} products
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-3">
              <button
                onClick={handleCopyLink}
                className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 z-10 transition-transform hover:scale-105"
                title="Copy Shop Link"
              >
                <FaCopy className="text-gray-700" />
              </button>
              <button
                onClick={handleShare}
                className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 z-10 transition-transform hover:scale-105"
                title="Share Shop"
              >
                <FaShareAlt className="text-blue-600" />
              </button>
            </div>
          </div>

          <div className="pt-24 px-2">
            {shop?.description && (
              <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-3">
                  About This Shop
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {shop.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Explore Products
              </h2>

              {products.length > 0 && (
                <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <Product
                      key={product._id}
                      product={product}
                      isFetchingData={false}
                      isOnWishlist={false}
                      isInCart={false}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-10 flex-wrap gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentPage(index + 1);
                        window.scrollTo({ top: 600, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <FaStore className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Products Available
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This shop hasn't added any products yet. Check back later!
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default SingleShopDetails;
