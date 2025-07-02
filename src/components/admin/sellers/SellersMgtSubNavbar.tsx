import { FaList } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Toaster } from 'sonner';

const SellersMgtSubNavbar = () => {
  return (
    <>
      <Toaster richColors position="top-center" />
      <nav className="p-3 rounded-lg shadow-md flex items-center gap-4 mb-2">
        <Link
          to="/admin/users"
          className="bg-primary-500 hover:bg-primary-500-dark text-white px-4 py-2 rounded flex items-center gap-2 transition"
        >
          <FaList /> Users list
        </Link>
        <Link
          to="/admin/shops-list"
          className="bg-primary-500 hover:bg-primary-500-dark text-white px-4 py-2 rounded flex items-center gap-2 transition"
        >
          <FaList /> Shops list
        </Link>
      </nav>
    </>
  );
};

export default SellersMgtSubNavbar;
