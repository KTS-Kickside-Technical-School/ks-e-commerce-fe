import { Link } from 'react-router-dom';
import NotFoundImage from '/notfound.jpg';
import { FaHome } from 'react-icons/fa';

const AdminNotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="container flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <img
            src={NotFoundImage}
            alt="Page Not Found"
            className="w-48 sm:w-56 md:w-72 lg:w-80 max-w-full h-auto"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              404 - Page Not Found
            </h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base md:text-lg">
              Oops! The page you are looking for does not exist.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base"
            >
              <FaHome />
              <span>Go To Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFound;
