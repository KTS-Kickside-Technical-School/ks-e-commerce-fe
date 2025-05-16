import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBox,
  FaUser,
  FaSignOutAlt,
  FaStore,
  FaShippingFast,
} from 'react-icons/fa';
import { toast, Toaster } from 'sonner';

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  sideBarToggle: () => void;
}

const DashboardSidebar = ({
  isSidebarOpen,
  sideBarToggle,
}: DashboardSidebarProps) => {
  const [activeLink, setActiveLink] = useState('dashboard');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('profile');
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setUserRole(parsedProfile.role);
    }
  }, []);

  const commonLinks = [{ name: 'I', icon: <FaUser />, path: '/admin/profile' }];
  const adminLinks = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin/' },
    { name: 'Sellers', icon: <FaStore />, path: '/admin/sellers' },
    { name: 'Products', icon: <FaBox />, path: '/admin/products' },
    { name: 'Profile', icon: <FaUser />, path: '/admin/profile' },
  ];
  const sellerLinks = [
    { name: 'Dashboard', icon: <FaHome />, path: '/seller/' },
    { name: 'Products', icon: <FaStore />, path: '/seller/products' },
    { name: 'Orders', icon: <FaShippingFast />, path: '/seller/orders' },
  ];

  let visibleLinks = commonLinks;
  if (userRole === 'admin') visibleLinks = [...adminLinks, ...commonLinks];
  else if (userRole === 'seller')
    visibleLinks = [...sellerLinks, ...commonLinks];

  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully!');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };
  return (
    <>
      <Toaster richColors position="top-center" />
      <aside
        className={`fixed md:relative z-30 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-primary h-full flex flex-col justify-between`}
      >
        <nav className="p-4 space-y-2">
          {visibleLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setActiveLink(link.name)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                activeLink === link.name
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-blue-500/50 text-white/80'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors bg-red-600 text-white hover:bg-red-700"
          >
            <span className="text-xl">
              <FaSignOutAlt />
            </span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={sideBarToggle}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
