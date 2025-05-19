import { useFormik } from 'formik';
import { useState } from 'react';
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';
import Bg from '/login-bg.jpg';
import authRequests from '../../../requests/authRequests.ts';
import { handleAddProductToCartHelper } from '../../../helpers/cartHelpers.ts';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const UserLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authRequests.userLogin(values);

        if (response.status !== 200) {
          toast.error(response.message);
          return;
        }

        toast.success('Login successful.');

        const { password, ...userWithoutPassword } = response.user;

        if (response.session && response.session.content) {
          sessionStorage.setItem('token', response.session.content);
        }
        sessionStorage.setItem('profile', JSON.stringify(userWithoutPassword));

        setTimeout(async () => {
          if (userWithoutPassword.role === 'customer') {
            const itemPendingToCart =
              localStorage.getItem('productToAddToCart');
            if (itemPendingToCart) {
              await handleAddProductToCartHelper(itemPendingToCart, navigate);
              return;
            } else {
              navigate('/');
            }
          } else if (userWithoutPassword.role === 'seller') {
            navigate('/seller/');
          } else if (userWithoutPassword.role === 'admin') {
            navigate('/admin/');
          } else {
            toast.error('User role is not found!');
          }
        }, 2000);
      } catch (error: any) {
        toast.error(error.message || 'Error occurred during login.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster richColors position="top-center" />
      <Header />
      <div className="flex flex-1 bg-gray-100 py-10 px-6 md:px-20 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full flex transition-transform duration-300 hover:scale-[1.02]">
          <div className="hidden md:block w-1/2">
            <img
              src={Bg}
              alt="Login"
              className="rounded-lg w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-2xl font-semibold text-primary-500 text-center mb-6 flex">
              <FaUser className="m-1 w-5" />
              <span>Login to Your Account</span>
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  {...formik.getFieldProps('password')}
                />
                <span
                  className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-blue-500 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>
              <p>
                Forgot your password? &nbsp;
                <Link to="/forgot-password" className="text-primary-500">
                  Click here
                </Link>
              </p>
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-6 h-6"></div>
                ) : (
                  <>
                    <FiLogIn className="mr-2" /> Login
                  </>
                )}
              </button>
              <p>
                Don't have an account?{' '}
                <Link to="/create-account" className="text-primary-500">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserLogin;
