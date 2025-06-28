import { motion } from 'framer-motion';
import { FaTag } from 'react-icons/fa';
import { formatRWF } from '../../../helpers/round';

interface ProductPriceProps {
  price: number;
  discount?: number;
  className?: string;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  discount = 0,
  className,
}) => {
  const hasDiscount = discount > 0;
  const discountedPrice = Math.round(price - (price * discount) / 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {hasDiscount ? (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          style={{ userSelect: 'none' }}
          aria-label="Discounted price"
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 px-3 py-2 rounded-full shadow-lg text-white"
        >
          <FaTag className="text-base sm:text-lg" />
          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg font-semibold">
              {formatRWF(discountedPrice)}
            </span>
            <del className="text-xs sm:text-sm opacity-70">
              {formatRWF(price)}
            </del>
          </div>
        </motion.div>
      ) : (
        <span
          className="text-primary-600 bg-green-500 p-3  rounded-full shadow-lg text-white font-semibold text-base sm:text-lg"
          style={{ userSelect: 'none' }}
          aria-label="Regular price"
        >
          {formatRWF(price)}
        </span>
      )}
    </motion.div>
  );
};

export default ProductPrice;
