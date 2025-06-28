import { useEffect, useState } from 'react';
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

const ITEMS_PER_PAGE = 40;

const SearchResults = () => {
  const [products, setProducts] = useState<iProduct[]>([]);
  const [filtered, setFiltered] = useState<iProduct[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const min = Number(searchParams.get('min') || '0');
  const max = Number(searchParams.get('max') || '9999999');
  const page = parseInt(searchParams.get('page') || '1');

  const updateFilter = (type: string, value: string) => {
    const updated = new URLSearchParams(searchParams);
    updated.set(type, value);
    updated.set('page', '1');
    setSearchParams(updated);
  };

  const filterProducts = () => {
    let result = [...products];

    if (q) {
      const keywords = q.toLowerCase().split(/\s+/);
      result = result.filter((p) => {
        const name = p?.productName?.toLowerCase() || '';
        const description = p?.description?.toLowerCase() || '';
        const category = p?.category?.toLowerCase() || '';
        return keywords.some(
          (kw) =>
            name.includes(kw) ||
            category.includes(kw) ||
            description.includes(kw)
        );
      });
    }

    if (category) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    result = result.filter((p) => p.price >= min && p.price <= max);

    setFiltered(result);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    updateFilter('q', e.target.search.value.trim());
  };

  const getCategories = async () => {
    try {
      const res = await adminViewCategories();
      if (res.status === 200) setCategories(res.data.categories);
    } catch (err) {
      toast.error('Could not load categories');
    }
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentData = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await userViewProducts();
        if (res.status === 200) {
          setProducts(res.data.products);
        } else {
          toast.error('Failed to fetch products.');
        }
      } catch (err) {
        toast.error('Error loading products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    getCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchParams]);

  return (
    <div className="bg-white">
      <SEO title={`${q + ':' || ''} Search Products :- Kickside Store`} />
      <Header />
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-10 px-4 gap-6">
        <aside className="w-full md:w-1/4 bg-blue-50 rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold text-blue-700 mb-3">Filters</h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
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
              : currentData.map((product) => (
                  <Product
                    key={product._id}
                    product={product}
                    isFetchingData={false}
                    isOnWishlist={false}
                    isInCart={false}
                  />
                ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => updateFilter('page', String(i + 1))}
                className={`px-3 py-1 rounded-md border ${
                  page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
