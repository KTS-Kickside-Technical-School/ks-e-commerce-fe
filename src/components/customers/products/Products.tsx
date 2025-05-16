import { Link } from 'react-router-dom';
import Product from './Product';
import { useEffect, useState } from 'react';
import { userViewProducts } from '../../../requests/productsRequests';
import { iProduct } from '../../../types/store';

interface ProductsProps {
  title: string;
  link: {
    text: string;
    location: string;
  };
}

const Products = ({ title, link }: ProductsProps) => {
  const [products, setProducts] = useState<iProduct[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetchingData(true);
      try {
        const response = await userViewProducts();
        if (response.status === 200) {
          setProducts(response.data.products);
          return;
        }
        throw new Error(response.message);
      } catch (error: any) {
        console.error('Error fetching products:', error.message);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 text-primary-500">
            {title}
          </h1>
          <Link
            to={link.location}
            className="text-primary-500 text-lg font-semibold hover:text-primary-600 transition-colors duration-200"
          >
            {link.text} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: iProduct) => (
            <Product
              key={product._id}
              product={product}
              isFetchingData={isFetchingData}
              isOnWishlist={false}
              isInCart={false}
            />
          ))}
        </div>

        {products.length === 0 && !isFetchingData && (
          <div className="text-center py-12 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
