import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../../components/customers/Header';
import Footer from '../../../components/customers/Footer';
import Product from '../../../components/customers/products/Product';
import { getProductsByCategory } from '../../../requests/productsRequests';
import { iProduct, IProductCategory } from '../../../types/store';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductsByCategory = () => {
  const { name } = useParams();
  const [category, setCategory] = useState<IProductCategory>({ name: '' });
  const [data, setData] = useState<iProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoryName = name || 'All';
        const response = await getProductsByCategory(categoryName);

        if (response.status !== 200) {
          throw new Error(response.message || 'Failed to load products');
        }

        setData(response.data.products);
        setCategory(response.data.category);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayName = name ? category?.name : 'View our products';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
              {displayName || 'View our products'}
            </h1>
            <p className="text-gray-600">
              {data.length} {data.length === 1 ? 'product' : 'products'}{' '}
              available
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center text-red-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Error:</span>
              </div>
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(itemsPerPage)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
                >
                  <div className="bg-gray-200 aspect-square w-full" />

                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>

                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-10 bg-gray-200 rounded-full w-10"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? null : data.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any products in this category. Please check
                back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((product) => (
                <Product
                  key={product._id}
                  product={product}
                  isFetchingData={isLoading}
                  isOnWishlist={false}
                  isInCart={false}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && data.length > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full text-gray-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full text-gray-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsByCategory;
