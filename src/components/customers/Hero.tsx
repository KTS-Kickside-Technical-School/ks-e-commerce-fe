import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { customerGetFeaturedShops } from '../../requests/adsRequests';
import ProductPrice from './products/ProductPrice';
import { Link } from 'react-router-dom';
import { FaShop, FaStar } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { iProduct } from '../../types/store';

const Hero = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await customerGetFeaturedShops();
      if (response.status === 200) {
        setShops(response.data.featuredShops);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full h-[80vh] bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 w-full"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
                    <div className="h-8 bg-gray-400 rounded w-3/4"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-[80vh] bg-gradient-to-b from-blue-600 to-gray-900 text-white">
      {shops.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 7000,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={1000}
          className="w-full h-full"
        >
          {shops.map((featured) => (
            <SwiperSlide key={featured.shop._id}>
              <div className="container mx-auto px-4 py-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center mb-10"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FaShop className="text-yellow-400 text-2xl" />
                    <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                      Featured Shop
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
                    {featured.title}
                  </h2>
                  <p className="text-xl text-white flex items-center gap-1">
                    <span>{featured.shop.name}</span>
                    <span className="flex items-center text-yellow-400 ml-2">
                      <FaStar className="mr-1" />
                      {featured.shop.rating?.toFixed(1) || '4.8'}
                    </span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {featured.shop?.products?.map(
                    (product: iProduct, idx: number) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: idx * 0.1,
                        }}
                        whileHover={{
                          y: -10,
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                        }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
                      >
                        <Link to={`/product/${product.slug}`}>
                          <div className="relative h-60 overflow-hidden">
                            <motion.img
                              src={product.images[0]}
                              alt={product.productName}
                              className="w-full h-full object-contain p-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            />
                            {product.discount > 0 && (
                              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                Save {product.discount}%
                              </span>
                            )}
                          </div>

                          {/* Product details */}
                          <div className="p-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
                              {product.productName}
                            </h3>

                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`text-sm ${
                                    i < Math.floor(4)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>

                            <ProductPrice
                              price={product.price}
                              discount={product.discount}
                            />

                            {product.shippingOptions && (
                              <div className="mt-3 text-sm font-medium text-blue-600 flex items-center">
                                <span className="bg-blue-100 px-2 py-1 rounded">
                                  {product.shippingOptions.note}
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-xl font-semibold text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="text-5xl mb-4">🛍️</div>
            No featured shops available at the moment.
            <br />
            <span className="text-gray-300 text-lg">Check back later!</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
