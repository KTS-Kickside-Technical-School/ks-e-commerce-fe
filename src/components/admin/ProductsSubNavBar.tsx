import { FaPlus, FaList, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Toaster } from 'sonner';

const ProductsSubNavBar = () => {
  return (
    <>
      <Toaster richColors position="top-center" />
      <nav className="p-3 rounded-lg shadow-md flex items-center gap-4">
        <Link
          to=""
          className="bg-primary-500 hover:bg-primary-500-dark text-white px-4 py-2 rounded flex items-center gap-2 transition"
        >
          <FaPlus /> New Product
        </Link>
        <Link
          to=""
          className="bg-primary-500 hover:bg-primary-500-dark text-white px-4 py-2 rounded flex items-center gap-2 transition"
        >
          <FaList /> Products List
        </Link>

        <Link
          to="/admin/categories"
          className="bg-primary-500 hover:bg-primary-500-dark text-white px-4 py-2 rounded flex items-center gap-2 transition"
        >
          <FaTags /> Categories
        </Link>
      </nav>
    </>
  );
};

export default ProductsSubNavBar;
