import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';
import { iProduct, IProductCategory } from '../../../types/store';
import { userViewProducts } from '../../../requests/productsRequests';
import ProductSkeletonLoader from '../../../components/customers/products/ProductSkeletonLoader';
import Product from '../../../components/customers/products/Product';
import SEO from '../../../middlewares/SEO';
import { toast } from 'sonner';
import { adminViewCategories } from '../../../requests/categoriesRequest';
import { FaSearch } from 'react-icons/fa';

const ITEMS_PER_PAGE = 80;

const SearchResults = () => {
  const [products, setProducts] = useState<iProduct[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const min = Number(searchParams.get('min') || '0');
  const max = Number(searchParams.get('max') || '9999999');
  const pageParam = Number(searchParams.get('page')) || 1;

  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', currentPage.toString());
    setSearchParams(updated);
  }, [currentPage]);

  const getCategories = async () => {
    try {
      const res = await adminViewCategories();
      if (res.status === 200) setCategories(res.data.categories);
    } catch {
      toast.error('Could not load categories');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await userViewProducts();
        if (res.status === 200) setProducts(res.data.products);
        else toast.error('Failed to fetch products.');
      } catch {
        toast.error('Error loading products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    getCategories();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (q) {
      const keywords = q.toLowerCase().split(/\s+/);
      result = result.filter((p) => {
        const name = p?.productName?.toLowerCase() || '';
        const description = p?.description?.toLowerCase() || '';
        const cat = p?.category?.toLowerCase() || '';
        const productKeywords = p?.keywords?.map((k) => k.toLowerCase()) || [];
        return keywords.some(
          (kw) =>
            name.includes(kw) ||
            description.includes(kw) ||
            cat.includes(kw) ||
            productKeywords.includes(kw)
        );
      });
    }

    if (categoryParam) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    result = result.filter((p) => p.price >= min && p.price <= max);

    return result;
  }, [products, q, categoryParam, min, max]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: any) => {
    e.preventDefault();
    const updated = new URLSearchParams(searchParams);
    updated.set('q', e.target.search.value.trim());
    updated.set('page', '1');
    setSearchParams(updated);
    setCurrentPage(1);
  };

  const updateFilter = (type: string, value: string) => {
    const updated = new URLSearchParams(searchParams);
    updated.set(type, value);
    updated.set('page', '1');
    setSearchParams(updated);
    setCurrentPage(1);
  };

  const keywordsSet = useMemo(() => {
    const kwSet = new Set<string>();
    products.forEach((p) => p.keywords?.forEach((k) => kwSet.add(k)));
    return Array.from(kwSet);
  }, [products]);

  return (
    <div className="bg-white min-h-screen">
      <SEO title={`${q ? q + ':' : ''} Search Products - Kickside Shop`} />
      <Header />

      <div className="max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4 bg-blue-50 rounded-lg p-4 shadow-md flex-shrink-0">
          <h2 className="text-lg font-semibold text-blue-700 mb-3">Filters</h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              value={categoryParam}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All</option>
              {[
                ...new Set([
                  ...products.map((p) => p.category),
                  ...categories.map((c) => c.name),
                ]),
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={min}
                onChange={(e) => updateFilter('min', e.target.value)}
                placeholder="Min"
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                min="0"
                value={max}
                onChange={(e) => updateFilter('max', e.target.value)}
                placeholder="Max"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {keywordsSet.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Keywords
              </label>
              <div className="flex flex-wrap gap-2">
                {keywordsSet.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => updateFilter('q', kw)}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1">
          <form onSubmit={handleSearch} className="relative mb-6">
            <input
              name="search"
              defaultValue={q}
              placeholder="Search products..."
              className="w-full py-2 pl-4 pr-12 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              <FaSearch />
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Showing results for "{q || 'all products'}"
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeletonLoader key={i} />
                ))
              : paginatedData.map((product) => (
                  <Product
                    key={product._id}
                    product={product}
                    isFetchingData={false}
                    isOnWishlist={false}
                    isInCart={false}
                  />
                ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
