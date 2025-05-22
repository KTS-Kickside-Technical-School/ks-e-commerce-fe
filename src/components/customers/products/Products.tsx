import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Product from './Product';
import ProductSkeletonLoader from './ProductSkeletonLoader';
import { userViewProducts } from '../../../requests/productsRequests';
import { iProduct } from '../../../types/store';

interface ProductsProps {
  title: string;
  link: {
    text: string;
    location: string;
  };
  limit?: number; // Optional limit on how many products to display
}

const Products = ({ title, link, limit }: ProductsProps) => {
  const [products, setProducts] = useState<iProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await userViewProducts();
        if (response.status === 200) {
          setProducts(response.data.products);
        } else {
          console.error('Error:', response.message);
        }
      } catch (error: any) {
        console.error('Failed to fetch products:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayedProducts = limit ? products.slice(0, limit) : products;

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-primary-500">{title}</h2>
          <Link
            to={link.location}
            className="text-primary-500 text-lg font-semibold hover:text-primary-600 transition-colors"
          >
            {link.text} →
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeletonLoader key={index} />
              ))
            : displayedProducts.map((product) => (
                <Product
                  key={product._id}
                  product={product}
                  isFetchingData={false}
                  isOnWishlist={false}
                  isInCart={false}
                />
              ))}
        </div>

        {/* Empty State */}
        {!isLoading && displayedProducts.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-lg font-medium">
            No products found.
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
