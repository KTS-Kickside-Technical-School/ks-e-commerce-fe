import { useEffect, useState } from 'react';
import { sellerGetShopDetails } from '../../requests/shopRequest';
import { ISellerShop } from '../../types/store';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const [shop, setShop] = useState<ISellerShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await sellerGetShopDetails();
        setShop(response.data.shop);
      } catch (error) {
        console.error('Error fetching shop details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShop();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : shop ? (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-4">
                {shop.name}
              </h1>
              <p className="text-gray-700">{shop.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-blue-800">
                  Total Sales
                </h3>
                <p className="text-2xl font-bold text-blue-600">$0.00</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-blue-800">
                  Total Orders
                </h3>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-blue-800">
                  Products Listed
                </h3>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              You don't have a shop yet. Please create a shop to start selling
              your products.
            </h1>
            <Link
              to="new-shop"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
