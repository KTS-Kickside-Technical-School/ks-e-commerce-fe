import { motion, AnimatePresence } from 'framer-motion';

interface ProductPriceProps {
  price: number;
  discount?: number;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ price, discount = 0 }) => {
  const hasDiscount = discount > 0;
  const discountedPrice = Math.round(price - (price / 100) * discount);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hasDiscount ? 'discount' : 'no-discount'}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center gap-3 sm:gap-4"
      >
        {hasDiscount ? (
          <>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-red-500 font-semibold animate-bounce w-full sm:w-auto"
            >
              <span className="text-xs sm:text-sm bg-red-600 text-white px-2 py-0.5 rounded-full font-medium animate-pulse">
                -{discount}% OFF
              </span>
            </motion.span>
            <del
              aria-label={`Original price: ${price} RWF`}
              className="text-red-400 text-base sm:text-lg"
            >
              {price} RWF
            </del>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              {discountedPrice} RWF
            </span>
          </>
        ) : (
          <span className="text-lg sm:text-xl font-semibold text-red-400 text-base">
            {price} RWF
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductPrice;
