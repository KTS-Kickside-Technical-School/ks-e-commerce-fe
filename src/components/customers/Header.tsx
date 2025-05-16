import { getToken, getProfile } from '../../utils/axios';
import { customerViewCartProducts } from '../../requests/cartRequests';
import {
  FaBars,
  FaChevronDown,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from '/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [token, setToken] = useState(getToken());
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(() => {
    try {
      return JSON.parse(getProfile() || '') || {};
    } catch {
      return {};
    }
  });

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (token) {
        try {
          const response = await customerViewCartProducts();
          setCartItems(response.data.cartProducts);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };

    fetchCartItems();

    const interval = setInterval(fetchCartItems, 30000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const checkAuth = () => {
      setToken(getToken());
      try {
        const profile = JSON.parse(getProfile() || '');
        if (profile.role === 'admin') navigate('/admin');
        if (profile.role === 'seller') navigate('/seller');
        setProfile(profile || {});
      } catch {
        setProfile({});
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const categories = ['Electronics', 'Clothing', 'Home', 'Books'];

  return (
    <header className="shadow-md">
      {!profile?.role || profile?.role === 'customer' ? (
        <div className="bg-blue-600 text-white p-3 text-center text-xs sm:text-sm md:text-base">
          <span className="font-semibold">Interested in selling?</span>
          <span className="ml-2 hidden sm:inline">
            {token
              ? 'Start your seller journey and reach millions of customers.'
              : 'Create an account to become a seller and start selling products.'}
          </span>
          <Link
            to={token ? '/apply-seller' : '/create-account'}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md ml-3 text-xs sm:text-sm md:text-base"
          >
            {token ? 'Apply to be Seller' : 'Register as Seller'}
          </Link>
        </div>
      ) : null}

      <nav className="bg-white flex items-center justify-between p-4 shadow-sm">
        <div>
          <Link to="/">
            <img src={Logo} alt="Kickside Logo" className="w-10 md:w-14" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-grow mx-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-md pl-10"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>

        <ul className="hidden md:flex gap-6 text-gray-700 font-medium mx-2">
          {['Home', 'Shops', 'About'].map((item, index) => (
            <li key={index}>
              <Link
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="hover:text-blue-500"
              >
                {item}
              </Link>
            </li>
          ))}
          <li className="relative">
            <button
              className="hover:text-blue-500 flex items-center gap-1"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              Shop by Category <FaChevronDown className="text-sm" />
            </button>
            {categoriesOpen && (
              <ul className="absolute bg-white shadow-md mt-2 py-2 rounded-md w-48 z-[10]">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <FaSearch />
          </button>

          <Link to="/my-cart" className="relative cursor-pointer">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-500" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {token && profile ? (
            <Link to="/my-account" className="text-gray-700 text-sm">
              <p className="font-semibold">
                {profile?.email?.split('@')[0].length > 10
                  ? `${profile?.email?.split('@')[0].substring(0, 10)}...`
                  : profile?.email?.split('@')[0]}
              </p>
              <span className="text-gray-500">My Account</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 cursor-pointer"
            >
              <FaUser className="text-2xl text-gray-700 hover:text-blue-500" />
              <div className="text-gray-700 text-sm">
                <p className="font-semibold">User</p>
                <span className="text-gray-500">Account</span>
              </div>
            </Link>
          )}

          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      <div
        className={`${
          menuOpen ? 'block' : 'hidden'
        } md:hidden bg-white p-4 shadow-md absolute w-full z-50`}
      >
        <ul className="flex flex-col gap-4 text-gray-700 font-medium">
          {['Home', 'Shops', 'About'].map((item, index) => (
            <li key={index}>
              <Link
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="hover:text-blue-500"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            </li>
          ))}
          <li className="relative">
            <button
              className="hover:text-blue-500 flex items-center gap-1"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              Shop by Category <FaChevronDown className="text-sm" />
            </button>
            {categoriesOpen && (
              <ul className="bg-white shadow-md mt-2 py-2 rounded-md w-48">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="flex items-center gap-2">
            {token && profile ? (
              <div className="flex items-center gap-2 cursor-pointer">
                <FaUser className="text-xl text-gray-700" />
                <Link to="/account" onClick={() => setMenuOpen(false)}>
                  My Account
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 cursor-pointer">
                <FaUser className="text-xl text-gray-700" />
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>

      {searchOpen && (
        <div className="md:hidden bg-white shadow-md p-4 absolute top-16 left-0 w-full z-50 flex items-center gap-2 border rounded-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600 transition"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
