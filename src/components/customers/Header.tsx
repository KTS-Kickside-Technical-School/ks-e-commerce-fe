import { getToken, getProfile } from '../../utils/axios';
import {
  FaBars,
  FaChevronDown,
  FaSearch,
  FaTimes,
  FaTruck,
  FaUser,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Logo from '/logo.png';
import { adminViewCategories } from '../../requests/categoriesRequest';
import { IProductCategory } from '../../types/store';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [token, setToken] = useState(getToken());
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

  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const fallbackCategories = useMemo(
    () => ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Toys'],
    []
  );
  const getCategories = async () => {
    try {
      const response = await adminViewCategories();
      if (response && response.data) {
        setCategories(response.data.categories);
      } else {
        setCategories(
          fallbackCategories.map((name, idx) => ({
            id: idx,
            name,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <header className="shadow-md">
      {!profile?.role || profile?.role === 'customer' ? (
        <div className="bg-blue-600 text-white text-center text-xs sm:text-sm md:text-base p-2 md:p-3">
          <span className="font-semibold">Interested in selling?</span>
          <span className="ml-1 sm:ml-2 hidden sm:inline">
            {token
              ? 'Start your seller journey and reach millions of customers.'
              : 'Create an account to become a seller and start selling products.'}
          </span>
          <Link
            to={token ? '/apply-seller' : '/create-account'}
            className="inline-block mt-1 sm:mt-0 sm:ml-3 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm md:text-base"
          >
            {token ? 'Apply to be Seller' : 'Register as Seller'}
          </Link>
        </div>
      ) : null}

      <nav className="bg-white flex items-center justify-between px-4 py-3 sm:px-6 md:px-8 lg:px-12 shadow-sm relative z-40">
        <Link to="/">
          <img src={Logo} alt="Kickside Logo" className="w-10 md:w-14" />
        </Link>

        <div className="hidden md:flex items-center gap-4 flex-grow mx-4">
          <form method="GET" action={`/search`} className="relative w-full">
            <input
              name="q"
              placeholder="Search products..."
              className="w-full py-2 pl-4 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition"
              title="Search"
              type="submit"
            >
              <FaSearch className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {['Home', 'Shops', 'About'].map((item, index) => (
            <Link
              key={index}
              to={item === 'Home' ? '/' : `/${item}`}
              className="hover:text-blue-500"
            >
              {item}
            </Link>
          ))}

          <div className="relative">
            <button
              className="hover:text-blue-500 flex items-center gap-1"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              Shop by Category <FaChevronDown className="text-sm" />
            </button>
            {categoriesOpen && (
              <ul className="absolute bg-white shadow-md mt-2 py-2 rounded-md w-48 z-50">
                <li>
                  <Link
                    to={`/category/All`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    All
                  </Link>
                </li>
                {categories.map((category: IProductCategory) => (
                  <li key={category._id}>
                    <Link
                      to={`/category/${category.name}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {token ? (
            <Link
              to="/my-orders"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium shadow-sm"
            >
              <FaTruck className="text-blue-600 text-lg" />
              <span>My Orders</span>
            </Link>
          ) : (
            <Link
              to="/track-order"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium shadow-sm"
            >
              Track order
            </Link>
          )}

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
            <Link to="/login" className="flex items-center gap-2">
              <FaUser className="text-2xl text-gray-700 hover:text-blue-500" />
              <div className="text-gray-700 text-sm">
                <p className="font-semibold">User</p>
                <span className="text-gray-500">Account</span>
              </div>
            </Link>
          )}
        </div>

        <div className="flex md:hidden items-center gap-4">
          <button onClick={() => setSearchOpen(!searchOpen)}>
            <FaSearch className="text-2xl text-gray-700" />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <FaTimes className="text-2xl text-gray-700" />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden  bg-white p-4 shadow-md w-full">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            {['Home', 'Shops', 'About'].map((item, index) => (
              <li key={index}>
                <Link
                  to={item === 'Home' ? '/' : `/${item}`}
                  onClick={() => setMenuOpen(false)}
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
                <ul className="bg-white shadow-md mt-2 py-2 rounded-md w-48">
                  <li>
                    <Link
                      to={`/category/All`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      All
                    </Link>
                  </li>
                  {categories.map((category: IProductCategory) => (
                    <li key={category._id}>
                      <Link
                        to={`/category/${category.name}`}
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {token ? (
              <Link
                to="/my-orders"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium shadow-sm"
              >
                <FaTruck className="text-blue-600 text-lg" />
                <span>My Orders</span>
              </Link>
            ) : (
              <Link
                to="/track-order"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium shadow-sm"
              >
                Track order
              </Link>
            )}

            <li className="flex items-center gap-2">
              {token && profile ? (
                <Link
                  to="/my-account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <FaUser className="text-xl text-gray-700" />
                  My Account
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <FaUser className="text-xl text-gray-700" />
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}

      {searchOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-md px-4 py-3">
          <form
            method="GET"
            action={`/search`}
            className="flex items-center gap-2"
          >
            <input
              name="q"
              placeholder="Search products..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              title="Search"
              type="submit"
            >
              <FaSearch className="w-5 h-5" />
            </button>

            <button
              onClick={() => setSearchOpen(false)}
              className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition"
              title="Close"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
