import { useEffect, useState } from 'react';
import { sellerGetShopDetails } from '../../requests/shopRequest';
import { ISellerShop } from '../../types/store';
import SEO from '../../middlewares/SEO';
import OnboardingLoadingSkeleton from './Onboarding/OnboardingLoadingSkeleton';
import SellerOnboarding from './Onboarding/SellerOnboarding';
import { FaCheckCircle } from 'react-icons/fa';
import OnboardingWaitingForApproval from './Onboarding/OnboardingWaitingForApproval';
import OnboardingRejected from './Onboarding/OnboardingRejected';

const SellerDashboard = () => {
  const [shop, setShop] = useState<ISellerShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await sellerGetShopDetails();

        if (response.status === 200 && response.data.shop) {
          const shopData = response.data.shop;
          setShop(shopData);

          if (
            !shopData ||
            (!shopData.isApproved && !shopData.isWaitingForApproval)
          ) {
            setShowOnboarding(true);
          }
        } else {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, []);

  if (isLoading) {
    return <OnboardingLoadingSkeleton />;
  }

  if (shop?.isWaitingForApproval) {
    return <OnboardingWaitingForApproval />;
  }

  if (shop?.status === 'rejected') {
    return <OnboardingRejected rejectionReason={shop?.rejectReason} />;
  }

  if (showOnboarding) {
    return <SellerOnboarding shop={shop} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <SEO title="Seller Dashboard - Kickside Store" />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                {shop?.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <FaCheckCircle className="mr-1" /> Active
                </span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-medium">
                  {shop?.seller?.fullNames}
                </span>
                <img
                  src={shop?.seller?.profile || 'https://picsum.photos/200/200'}
                  alt="Seller avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          <p className="text-gray-700 mt-4">{shop?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-blue-800">Total Sales</h3>
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Add Your First Product
                </h3>
                <p className="text-gray-600 text-sm">
                  Start building your catalog by adding products to your shop
                </p>
                <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                  Add Product
                </button>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Set Up Shipping Options
                </h3>
                <p className="text-gray-600 text-sm">
                  Configure shipping methods and rates for your products
                </p>
                <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                  Manage Shipping
                </button>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="bg-purple-100 p-2 rounded-full text-purple-600 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 9a1 1 0 012 0v6a1 1 0 11-2 0V9zM14 9a1 1 0 012 0v6a1 1 0 11-2 0V9z" />
                  <path
                    fill-rule="evenodd"
                    d="M4 4a1 1 0 011-1h10a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h10a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h6a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  Customize Your Shop
                </h3>
                <p className="text-gray-600 text-sm">
                  Personalize your shop's appearance with a custom logo and
                  banner
                </p>
                <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                  Shop Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
