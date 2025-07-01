import Logo from '/logo.png';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const OnboardingSubnavbar = () => {
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
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src={Logo} alt="Kickside Logo" className="h-10 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">
              Kickside Seller Center
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition"
            >
              <FaTimes />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingSubnavbar;
