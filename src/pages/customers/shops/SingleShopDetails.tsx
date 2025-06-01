import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaShareAlt, FaCopy } from 'react-icons/fa';
import { iProduct, ISellerShop } from '../../../types/store';
import { getShopDetailsById } from '../../../requests/shopRequest';
import Product from '../../../components/customers/products/Product';
import Header from '../../../components/customers/Header';
import CoverCarousel from '../../../components/customers/shops/CoverCarousel';
import { toast, Toaster } from 'sonner';
import Footer from '../../../components/customers/Footer';
import SEO from '../../../middlewares/SEO';

const PRODUCTS_PER_PAGE = 15;

const SingleShopDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<ISellerShop | null>(null);
  const [products, setProducts] = useState<iProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await getShopDetailsById(id);
        if (response.status === 200) {
          setShop(response.data.shop);
          setProducts(response.data.products || []);
          setError('');
        } else {
          setError('Shop not found or failed to load.');
        }
      } catch (err) {
        setError('Something went wrong while fetching shop details.');
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

  if (error || !shop) {
    return (
      <div className="text-center text-red-600 py-10">
        <p>{error || 'Shop not found'}</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="w-full h-64 bg-gray-200 rounded-md" />
          <div className="w-32 h-32 bg-gray-200 rounded-full mt-4" />
          <div className="h-4 bg-gray-200 w-1/2 rounded" />
          <div className="grid grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <SEO
        title={`${shop.name} - Shop Details on Kickside Store`}
        description={shop.description}
        keywords="Kickside Store, Shop Details, Online Shopping, Rwanda"
        ogImage={shop.logo}
        ogUrl={window.location.href}
      />
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="relative w-full h-64 mb-12">
          <CoverCarousel
            images={Array.isArray(shop.images) ? shop.images : []}
          />
          <div className="absolute bottom-[-3rem] z-[10] left-6 flex items-center gap-4">
            <img
              src={shop.logo}
              alt={`${shop.name} logo`}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="">
              <h1 className="text-2xl font-bold text-white">{shop.name}</h1>
              <p className="text-white">{shop.description}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleCopyLink}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              title="Copy Shop Link"
            >
              <FaCopy />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <FaShareAlt />
            </button>
          </div>
        </div>

        <div className="pt-8">
          <div className="mt-28">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Explore our products
            </h2>
            {products && products.length > 0 ? (
              <>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-md border ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border-gray-300'
                      } hover:bg-blue-500 hover:text-white`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                No products available in this shop.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleShopDetails;
