import { useState, useEffect } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { userViewProducts } from '../../requests/productsRequests';
import ProductPrice from './products/ProductPrice';
import { Link } from 'react-router-dom';
import { FaShop } from 'react-icons/fa6';

const Hero = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await userViewProducts();
      if (response.status === 200) {
        setProducts(response.data.products.slice(0, 5));
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
      <section className="w-full h-screen flex items-center justify-center bg-primary-50 text-primary-900">
        <div className="text-lg font-semibold animate-pulse">
          Loading featured products...
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-screen max-h-[90vh] bg-gradient-to-br from-primary-100 to-primary-500 text-white overflow-hidden relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000 }}
        loop
        className="w-full h-full"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="relative w-full h-full">
              <img
                src={product.images?.[0] || '/fallback-product.jpg'}
                alt={product.productName || 'Product'}
                className="w-full h-full object-cover object-center"
                onError={(e) => (e.currentTarget.src = '/fallback-product.jpg')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-12">
                <div className="space-y-4">
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-4xl md:text-5xl font-extrabold max-w-[85%] line-clamp-2"
                    aria-label={`View details for ${product.productName}`}
                  >
                    {product.productName}
                  </Link>
                  <ProductPrice
                    price={product.price}
                    discount={product.discount}
                    className="text-2xl"
                  />
                  <div className="flex gap-4">
                    <Link
                      to={`/product/${product.slug}`}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full transition font-semibold ${
                        product.stock > 0
                          ? 'bg-primary-500 hover:bg-primary-100 text-white'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FaShop />
                      {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                    </Link>
                    <button
                      aria-label="Add to wishlist"
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
                      onClick={() => alert('Add to wishlist logic here')}
                    >
                      <FaRegHeart className="text-xl text-pink-400 hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
