import { FaList } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Toaster } from 'sonner';

const SellerOrdersNavBar = () => {
  return (
    <>
      <Toaster richColors position="top-center" />
      <nav className="p-3 rounded-lg shadow-md flex items-center gap-4">
        <Link
          to="/seller/products"
          className="bg-primary-500 hover:bg-primary-500-dark text-white px-4 py-2 rounded flex items-center gap-2 transition"
        >
          <FaList /> Products List
        </Link>
      </nav>
    </>
  );
};

export default SellerOrdersNavBar;
