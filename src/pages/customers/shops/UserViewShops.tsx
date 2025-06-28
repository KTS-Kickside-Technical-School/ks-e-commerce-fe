import { useEffect, useState } from 'react';
import {
  FaPhone,
  FaSearch,
  FaArrowRight,
  FaArrowLeft,
  FaStore,
  FaTimes,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';
import { userViewAllShops } from '../../../requests/shopRequest';
import { Link } from 'react-router-dom';
import { ISellerShop } from '../../../types/store';
import { adminViewCategories } from '../../../requests/categoriesRequest';
import SEO from '../../../middlewares/SEO';

const ITEMS_PER_PAGE = 21;

const ShopExplorer = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [filteredShops, setFilteredShops] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        const response = await userViewAllShops();
        if (response.status === 200) {
          setShops(response.data.shops);
          setFilteredShops(response.data.shops);
        } else {
          setError('Failed to load shops. Please try again later.');
        }
      } catch (error) {
        setError('Network error. Please check your connection.');
        console.error('Error fetching shops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    let results = shops;

    if (searchTerm) {
      results = results.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      results = results.filter((shop) =>
        shop.products.some(
          (product: any) => product.category === selectedCategory
        )
      );
    }

    setFilteredShops(results);
    setCurrentPage(1);
    getCategories();
  }, [searchTerm, selectedCategory, shops]);

  const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE);
  const paginatedShops = filteredShops.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const [categories, setCategories] = useState<string[]>(['All']);

  const getCategories = async () => {
    try {
      const response = await adminViewCategories();
      if (
        response &&
        response.data &&
        Array.isArray(response.data.categories)
      ) {
        const categoryNames = response.data.categories.map(
          (category: { name: string }) => category.name
        );
        setCategories(['All', ...categoryNames]);
      } else {
        setCategories(['All']);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['All']);
    }
  };

  return (
    <>
      <SEO
        title="Shop Explorer - Discover Local Shops"
        description="Explore unique local shops and support small businesses in your community."
        ogUrl={window.location.href}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Discover Local Shops
            </motion.h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore unique stores and support local businesses in your
              community
            </p>
          </div>

          <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search shops by name or description..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaTimes className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                <FaStore className="mr-1" />
                {filteredShops.length} shops
              </span>
            </div>
          </div>

          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 text-red-700 p-6 rounded-xl max-w-md mx-auto">
                <h3 className="font-bold text-xl mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                <ShopCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredShops.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${selectedCategory}-${searchTerm}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {paginatedShops.map((shop: ISellerShop) => (
                    <ShopCard key={shop._id} shop={shop} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="flex justify-center mt-14 gap-2 items-center">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-3 rounded-full ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <FaArrowLeft />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    if (
                      Math.abs(page - currentPage) <= 2 ||
                      page === 1 ||
                      page === totalPages
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-full font-medium transition ${
                            page === currentPage
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }

                    if (Math.abs(page - currentPage) === 3) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-3 rounded-full ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaStore className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No shops found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? `No shops match "${searchTerm}"`
                    : 'No shops available at the moment'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

const ShopCard = ({ shop }: any) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div
        className="h-40 flex items-center justify-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${
            shop?.images[0] || '/logo.png'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white rounded-full p-1 shadow-lg">
          <img
            src={shop.logo}
            alt={shop.name}
            className="w-20 h-20 object-cover rounded-full"
          />
        </div>

        <div className="absolute bottom-4 right-4 bg-white text-yellow-600 font-bold px-3 py-1 rounded-full text-sm flex items-center">
          <span className="mr-1">★</span>
          {0}
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {shop.name}
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-12">
          {shop.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {[...new Set(shop.products.map((p: any) => p.category))]
            .slice(0, 4)
            .map((category: any, idx: number) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Link
            to={`tel:${shop.phone}`}
            aria-label={`Call ${shop.name}`}
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 font-medium"
          >
            <FaPhone className="mr-2" />
            {shop.phone}
          </Link>
          <Link
            to={`/shop/${shop._id}`}
            className="bg-gradient-to-r from-blue-500 to-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Visit Shop
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ShopCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="bg-gray-200 animate-pulse h-40"></div>

      <div className="p-6">
        <div className="bg-gray-200 animate-pulse h-6 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 animate-pulse h-4 rounded w-full"></div>
          <div className="bg-gray-200 animate-pulse h-4 rounded w-5/6"></div>
        </div>

        <div className="flex flex-wrap gap-2 my-4">
          <div className="bg-gray-200 animate-pulse h-6 rounded w-16"></div>
          <div className="bg-gray-200 animate-pulse h-6 rounded w-20"></div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="bg-gray-200 animate-pulse h-4 rounded w-16"></div>
          <div className="bg-gray-200 animate-pulse h-8 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default ShopExplorer;
