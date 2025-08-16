import { useEffect, useState, useMemo } from 'react';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';
import SEO from '../../../middlewares/SEO';
import { fetchActiveTermsAndConditions } from '../../../requests/termsAndConditionsRequests';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaSort,
  FaFilter,
  FaCalendarAlt,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaTimes,
  FaArrowRight,
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CustomersTermsAndConditions = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState<string>('newest');
  const [filterType, setFilterType] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const itemsPerPage = 6;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchActiveTermsAndConditions();
      if (response.status !== 200) {
        throw new Error(
          response.message || 'Failed to fetch terms and conditions'
        );
      }
      const sortedData = response.data.terms.sort(
        (a: any, b: any) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      );
      setData(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      console.error('Error fetching terms and conditions:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Extract unique types for filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    data.forEach((term) => types.add(term.type));
    return Array.from(types).sort();
  }, [data]);

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (term) =>
          term.title.toLowerCase().includes(lower) ||
          term.summary.toLowerCase().includes(lower) ||
          term.type.toLowerCase().includes(lower)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter((term) => term.type === filterType);
    }

    // Apply sorting
    switch (sortCriteria) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.effectiveDate).getTime() -
            new Date(a.effectiveDate).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.effectiveDate).getTime() -
            new Date(b.effectiveDate).getTime()
        );
        break;
      case 'a-z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, filterType, sortCriteria, data]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setSortCriteria('newest');
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="border rounded-xl p-5 shadow-sm transition-all bg-white"
        >
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
            <div className="h-8 bg-gray-200 rounded mt-6 w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <SEO
        title="Terms and Conditions of Use - Kickside Shop"
        description="Kickside Shop Terms and Conditions of Use, including the Privacy Policy and Refund Policy."
      />
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Stay informed about our policies and agreements. Find all the
            documents you need to understand how we operate and serve you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-xl">
              <input
                type="text"
                placeholder="Search by title, summary or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex gap-3 flex-wrap">
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition"
                >
                  <FaFilter className="text-gray-600" />
                  <span>Filter</span>
                  {filterType !== 'all' && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </button>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                  <div className="absolute z-10 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Filter by Type</h3>
                        <button onClick={() => setIsFilterOpen(false)}>
                          <FaTimes className="text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="radio"
                            name="filterType"
                            checked={filterType === 'all'}
                            onChange={() => setFilterType('all')}
                            className="rounded-full text-blue-600"
                          />
                          <span>All Types</span>
                        </label>
                        {uniqueTypes.map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="filterType"
                              checked={filterType === type}
                              onChange={() => setFilterType(type)}
                              className="rounded-full text-blue-600"
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition"
                >
                  <FaSort className="text-gray-600" />
                  <span>Sort</span>
                </button>

                {/* Sort Dropdown */}
                {isSortOpen && (
                  <div className="absolute z-10 mt-2 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Sort by</h3>
                        <button onClick={() => setIsSortOpen(false)}>
                          <FaTimes className="text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSortCriteria('newest');
                            setIsSortOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded transition ${
                            sortCriteria === 'newest' ? 'text-blue-600' : ''
                          }`}
                        >
                          <FaCalendarAlt />
                          <span>Newest First</span>
                        </button>
                        <button
                          onClick={() => {
                            setSortCriteria('oldest');
                            setIsSortOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded transition ${
                            sortCriteria === 'oldest' ? 'text-blue-600' : ''
                          }`}
                        >
                          <FaCalendarAlt />
                          <span>Oldest First</span>
                        </button>
                        <button
                          onClick={() => {
                            setSortCriteria('a-z');
                            setIsSortOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded transition ${
                            sortCriteria === 'a-z' ? 'text-blue-600' : ''
                          }`}
                        >
                          <FaSortAlphaDown />
                          <span>A to Z</span>
                        </button>
                        <button
                          onClick={() => {
                            setSortCriteria('z-a');
                            setIsSortOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded transition ${
                            sortCriteria === 'z-a' ? 'text-blue-600' : ''
                          }`}
                        >
                          <FaSortAlphaUp />
                          <span>Z to A</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Button */}
              {(searchTerm ||
                filterType !== 'all' ||
                sortCriteria !== 'newest') && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-200 transition"
                >
                  <FaTimes className="text-gray-600" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-blue-700 hover:text-blue-900"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
            {filterType !== 'all' && (
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Type: {filterType}
                <button
                  onClick={() => setFilterType('all')}
                  className="ml-1 text-blue-700 hover:text-blue-900"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
            {sortCriteria !== 'newest' && (
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Sort:{' '}
                {sortCriteria === 'oldest'
                  ? 'Oldest First'
                  : sortCriteria === 'a-z'
                  ? 'A to Z'
                  : sortCriteria === 'z-a'
                  ? 'Z to A'
                  : ''}
                <button
                  onClick={() => setSortCriteria('newest')}
                  className="ml-1 text-blue-700 hover:text-blue-900"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            Showing {Math.min(filteredData.length, itemsPerPage)} of{' '}
            {filteredData.length} documents
          </div>
          <div className="text-sm text-gray-500">
            {sortCriteria === 'newest'
              ? 'Sorted by Newest'
              : sortCriteria === 'oldest'
              ? 'Sorted by Oldest'
              : sortCriteria === 'a-z'
              ? 'Sorted A-Z'
              : 'Sorted Z-A'}
          </div>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="bg-red-50 rounded-xl p-6 text-center max-w-2xl mx-auto">
            <div className="text-red-600 font-medium text-lg mb-2">
              Error Loading Terms
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div className="text-gray-500 text-5xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No matching terms found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((term, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all bg-white group hover:border-blue-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        term.type === 'Privacy Policy'
                          ? 'bg-purple-100 text-purple-800'
                          : term.type === 'Refund Policy'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {term.type} - &nbsp;{term.version}
                    </div>
                    <div className="text-xs text-gray-500">
                      <FaCalendarAlt className="inline mr-1" />
                      {new Date(term.effectiveDate).toLocaleDateString()}
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition">
                    {term.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {term.summary}
                  </p>

                  <Link
                    to={`/terms/${term.slug}`}
                    className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition"
                  >
                    View full details
                    <FaArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-full text-sm ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="text-gray-400">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-10 h-10 rounded-full text-sm ${
                        totalPages === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-gray-50 py-10 mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Need Help Understanding Our Policies?
            </h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about our terms and conditions, privacy
              policy, or refund policy, our support team is here to help you
              understand everything clearly.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to={'/help-center'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CustomersTermsAndConditions;
