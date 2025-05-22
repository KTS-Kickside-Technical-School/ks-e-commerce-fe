import { useState, useEffect } from 'react';
import { FaShoppingCart, FaChevronRight, FaRegHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { userViewProducts } from '../../requests/productsRequests';
import ProductPrice from './products/ProductPrice';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [activeProduct, setActiveProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      const response = await userViewProducts();
      if (response.status === 200) {
        const featured = response.data.products.slice(0, 5);
        setProducts(featured);
        setActiveProduct(featured[0]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const scrollProduct = (delta: number) => {
    const index = products.indexOf(activeProduct);
    const nextIndex = Math.min(Math.max(0, index + delta), products.length - 1);
    setActiveProduct(products[nextIndex]);
  };

  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-primary-100 to-primary-500 text-white overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)`,
        }}
        animate={{ scale: [1, 1.1] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror' }}
      />

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] h-full gap-6 p-6 lg:p-12">
        {/* Main Display */}
        <motion.div
          onWheel={(e) => scrollProduct(e.deltaY > 0 ? 1 : -1)}
          className="relative h-full rounded-3xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="popLayout">
            {activeProduct && (
              <motion.div
                key={activeProduct._id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={activeProduct.images[0]}
                  alt={activeProduct.productName}
                  className="w-full h-full object-cover object-center"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-8">
                  <div className="space-y-4">
                    <Link
                      to={`/product/${activeProduct?.slug}`}
                      className="text-4xl font-extrabold max-w-[70%]"
                    >
                      {activeProduct.productName}
                    </Link>
                    <ProductPrice
                      price={activeProduct.price}
                      discount={activeProduct.discount}
                      className="text-2xl"
                    />
                    <div className="flex gap-4">
                      <Link
                        to={`/product/${activeProduct.slug}`}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 hover:bg-primary-100 text-white font-medium transition"
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </Link>
                      <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition">
                        <FaRegHeart className="text-xl text-pink-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Product List */}
        <div className="hidden lg:flex flex-col gap-4 overflow-y-auto scrollbar-hide">
          {products.map((p) => (
            <motion.div
              key={p._id}
              onClick={() => setActiveProduct(p)}
              whileHover={{ scale: 1.02 }}
              className={`relative h-44 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                p._id === activeProduct?._id
                  ? 'ring-4 ring-primary-500'
                  : 'opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={p.images[0]}
                alt={p.productName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60">
                <h4 className="text-white font-semibold truncate">
                  {p.productName}
                </h4>
                <ProductPrice
                  price={p.price}
                  discount={p.discount}
                  className="text-sm"
                />
              </div>
              <span className="absolute top-2 right-2 bg-black/50 text-sm px-2 py-1 rounded-full">
                #{p.category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <motion.div
            key={index}
            className="h-2 w-6 rounded-full"
            animate={{
              backgroundColor:
                products.indexOf(activeProduct) === index
                  ? 'rgba(59, 130, 246, 1)' // Tailwind primary-500
                  : 'rgba(255, 255, 255, 0.3)',
              scaleX: products.indexOf(activeProduct) === index ? 1.3 : 1,
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-6 right-6 flex gap-3">
        <button
          onClick={() => scrollProduct(-1)}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full"
        >
          <FaChevronRight className="rotate-180 text-white" />
        </button>
        <button
          onClick={() => scrollProduct(1)}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full"
        >
          <FaChevronRight className="text-white" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
