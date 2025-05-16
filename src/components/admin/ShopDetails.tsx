import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminGetShopBySellerId } from '../../requests/shopRequest';
import { toast, Toaster } from 'sonner';
import SEO from '../../middlewares/SEO';
import defaultShopLogo from '/Avatar.png';
import { ISellerShop } from '../../types/store';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ShopDetails = () => {
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');
  const [shop, setShop] = useState<ISellerShop>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        if (!sellerId) return;
        const response = await adminGetShopBySellerId(sellerId);
        if (response.status !== 200) {
          toast.error(response.message);
          return;
        }
        setShop(response.data.shop);
      } catch (error) {
        toast.error('Failed to fetch shop details.');
      } finally {
        setLoading(false);
      }
    };
    fetchShopDetails();
  }, [sellerId]);

  return (
    <>
      <SEO
        title={
          shop?.name ? `${shop.name} - Shop Details` : 'Admin View Shop Details'
        }
        description={
          shop?.description ||
          'View shop details including products, orders, sales, and ratings.'
        }
        image={shop?.logo || defaultShopLogo}
        url={window.location.href}
      />
      <Toaster richColors position="top-center" />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-300 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            <div className="h-40 bg-gray-300 rounded"></div>
          </div>
        ) : shop ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
              >
                {shop?.images?.length
                  ? shop.images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={`Cover ${index + 1}`}
                          className="w-full h-60 object-cover rounded-lg"
                        />
                      </div>
                    ))
                  : [
                      <div key="default">
                        <img
                          src={defaultShopLogo}
                          alt="Default Cover"
                          className="w-full h-60 object-cover rounded-lg"
                        />
                      </div>,
                    ]}
              </Carousel>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <img
                src={shop?.logo || defaultShopLogo}
                alt={shop?.name}
                className="w-24 h-24 rounded-full border border-primary-500 object-cover"
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-primary-500">
                  {shop?.name}
                </h1>
                <p className="text-gray-600">{shop?.description}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary-100 p-4 rounded-lg text-center">
                <p className="text-xl font-semibold text-primary-500">0</p>
                <p className="text-gray-500 text-sm">Total Products</p>
              </div>
              <div className="bg-primary-100 p-4 rounded-lg text-center">
                <p className="text-xl font-semibold text-primary-500">0</p>
                <p className="text-gray-500 text-sm">Total Orders</p>
              </div>
              <div className="bg-primary-100 p-4 rounded-lg text-center">
                <p className="text-xl font-semibold text-primary-500">0</p>
                <p className="text-gray-500 text-sm">Total Sales</p>
              </div>
              <div className="bg-primary-100 p-4 rounded-lg text-center">
                <p className="text-xl font-semibold text-primary-500">0 ★</p>
                <p className="text-gray-500 text-sm">Average Rating</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No shop found.</p>
        )}
      </div>
    </>
  );
};

export default ShopDetails;
