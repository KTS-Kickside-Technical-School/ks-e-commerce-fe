import { useFormik } from 'formik';
import { useState } from 'react';
import { FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';
import Bg from '/create-account-bg.jpg';
import authRequests from '../../../requests/authRequests.ts';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['seller', 'customer'], 'Invalid role')
    .required('Role is required'),
});

const UserCreateAccount = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: 'customer',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authRequests.userCreateAccount(values);

        if (response.status !== 201) {
          toast.error(response.message, {
            duration: 3000,
            position: 'top-right',
          });
          return;
        }
        toast.success('User is created successfully.', {
          duration: 3000,
          position: 'top-right',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error: any) {
        toast.error(error.message || 'Error occured creating the user.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster richColors />
      <Header />
      <div className="flex flex-1 bg-gray-100 py-10 px-6 md:px-20 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full flex transition-transform duration-300 hover:scale-[1.02]">
          <div className="hidden md:block w-1/2">
            <img
              src={Bg}
              alt="Create Account"
              className="rounded-lg w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-2xl font-semibold text-primary-500 text-center mb-6 flex">
              <FaUser className="m-1 w-5" />
              <span>Create Your Account</span>
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="relative">
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  {...formik.getFieldProps('role')}
                >
                  <option value="customer">👤 Customer</option>
                  <option value="seller">🛍️ Seller</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.role}
                  </p>
                )}
              </div>

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

              <button
                type="submit"
                className="w-full flex justify-center items-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-6 h-6"></div>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2" /> Create Account
                  </>
                )}
              </button>
              <p>
                Already have account?{' '}
                <Link to="/login" className="text-primary-500">
                  Login
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

export default UserCreateAccount;
