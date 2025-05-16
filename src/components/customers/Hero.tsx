import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const products = [
    {
      _id: 1,
      name: 'Product 1',
      price: 1000,
      discount: 0.1,
      description: 'High-quality product with great value.',
      image: '/product.jpg',
    },
    {
      _id: 2,
      name: 'Product 2',
      price: 1200,
      discount: 0.15,
      description: 'Durable and stylish product for daily use.',
      image: '/logo.png',
    },
    {
      _id: 3,
      name: 'Product 3',
      price: 1500,
      discount: 0.2,
      description: 'Premium product with exceptional performance.',
      image: '/product.jpg',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleSelectProduct = (index: any) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative w-full h-[500px] flex items-center justify-start p-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={products[currentIndex].image}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${products[currentIndex].image})` }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Dark Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Product Details with Fade and Slide Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={products[currentIndex]._id}
          className="relative z-10 w-1/2 text-left text-white p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <h1 className="text-4xl font-bold">{products[currentIndex].name}</h1>
          <p className="text-lg mt-2">
            Price:{' '}
            <span className="font-semibold">
              <del className="text-red-500">
                {products[currentIndex].price} RWF
              </del>
              <span className="text-yellow-400 ml-2">
                {products[currentIndex].price -
                  products[currentIndex].price *
                    products[currentIndex].discount}{' '}
                RWF
              </span>
            </span>
          </p>
          <p className="mt-2">{products[currentIndex].description}</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md flex items-center gap-2">
            <FaShoppingCart /> Add To Cart
          </button>

          <div className="mt-6 flex gap-3">
            {products.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleSelectProduct(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? 'bg-blue-500' : 'bg-gray-400'
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
