import { motion } from 'framer-motion';
import { FaTag } from 'react-icons/fa';

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
  const formatRWF = (amount: number) =>
    new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {hasDiscount ? (
        <motion.div
          initial={{ rotate: -5 }}
          animate={{ rotate: 0 }}
          className="flex items-baseline gap-2 bg-gradient-to-r from-red-600 to-pink-500 px-4 py-2 rounded-full text-white"
        >
          <FaTag />
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold">
              {formatRWF(discountedPrice)}
            </span>
            <del className="text-xs opacity-70">{formatRWF(price)}</del>
          </div>
        </motion.div>
      ) : (
        <span className="text-primary-500 font-semibold text-lg">
          {formatRWF(price)}
        </span>
      )}
    </motion.div>
  );
};

export default ProductPrice;
  