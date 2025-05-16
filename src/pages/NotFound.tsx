import { Link } from 'react-router-dom';
import Header from '../components/customers/Header';
import Footer from '../components/customers/Footer';
import NotFoundImage from '/notfound.jpg';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <img
            src={NotFoundImage}
            alt="Page Not Found"
            className="w-48 sm:w-56 md:w-72 lg:w-80"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              404 - Page Not Found
            </h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base md:text-lg">
              Oops! The page you are looking for does not exist.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;