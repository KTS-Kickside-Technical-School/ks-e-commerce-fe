import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { userViewProducts } from '../../requests/productsRequests';
import ProductPrice from './products/ProductPrice';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await userViewProducts();
      if (response.status === 200) {
        setProducts(response.data.products.slice(0, 5));
      } else {
        console.error(response);
      }
    } catch (error: any) {
      console.error(
        error.message || 'Unknown error occurred while fetching products'
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && products.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, products.length]);

  const handleSelectProduct = (index: number) => {
    setCurrentIndex(index);
  };

  const product = products[currentIndex];

  return (
    <div
      className="relative w-full h-[500px] flex items-center justify-start p-8 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product?.images[0]}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${product?.images[0]})` }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product?._id}
          className="relative z-10 w-full max-w-xl text-white p-6 backdrop-blur-sm bg-black/30 rounded-xl shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Link
            to={`/product/${product?.slug}`}
            className="text-2xl font-bold line-clamp-2 leading-snug tracking-tight"
          >
            {product?.productName}
          </Link>

          <Link
            to={`/product/${product?.slug}`}
            className="mt-3 text-sm text-gray-200 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: product?.description || '',
            }}
          />
          <p className="mt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <ProductPrice
                price={product?.price}
                discount={product?.discount}
              />
            </motion.div>
          </p>

          <Link
            to={`/product/${product?.slug}`}
            className="mt-5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition px-6 py-2 rounded-full flex items-center gap-2 font-semibold shadow-md hover:scale-105 active:scale-95"
          >
            <FaShoppingCart className="text-white" />
            Buy now
          </Link>

          {/* Dots */}
          <div className="mt-6 flex gap-2">
            {products.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleSelectProduct(index)}
                className={`w-3 h-3 rounded-full transition ${
                  currentIndex === index
                    ? 'bg-blue-400 scale-110'
                    : 'bg-white/30'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Hero;
