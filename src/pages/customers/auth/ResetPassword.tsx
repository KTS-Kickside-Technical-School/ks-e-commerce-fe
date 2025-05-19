import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaSave, FaUser } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';
import Bg from '/login-bg.jpg';
import authRequests from '../../../requests/authRequests.ts';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  retype: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    const tokenFromUrl = searchParams.get('token');

    if (!emailFromUrl || !tokenFromUrl) {
      toast.error('Email or token missing. Please retry from the reset email.');
      return;
    }

    setEmail(emailFromUrl);
    setToken(tokenFromUrl);

    (async () => {
      try {
        const response = await authRequests.validateResetToken({
          email: emailFromUrl,
          token: tokenFromUrl,
        });
        if (response.status !== 200) {
          toast.error('⛔ Token expired or invalid', {
            description: 'Try requesting a new reset email.',
          });
          setTimeout(() => navigate('/forgot-password'), 2000);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to validate token.');
      }
    })();
  }, []);

  const formik = useFormik({
    initialValues: {
      password: '',
      retype: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const dataToSend = {
          email,
          token,
          password: values.password,
        };

        const response = await authRequests.resetPassword(dataToSend);

        if (response.status === 200) {
          toast.success(
            '✅ Password reset successful. Please login with your new password.'
          );
          setTimeout(() => navigate('/login'), 2000);
        } else {
          toast.error('❌ Failed to reset password', {
            description: response.message || 'Unknown error occurred.',
          });
        }
      } catch (error: any) {
        toast.error(
          error.message || 'An error occurred during password reset.'
        );
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
              alt="Reset Password"
              className="rounded-lg w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-2xl font-semibold text-primary-500 text-center mb-6 flex items-center justify-center">
              <FaUser className="mr-2" />
              Reset Password
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  {...formik.getFieldProps('password')}
                />
                <span
                  className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-blue-500"
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

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  {...formik.getFieldProps('retype')}
                />
                <span
                  className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-blue-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {formik.touched.retype && formik.errors.retype && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.retype}
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
                    <FaSave className="mr-2" /> Save New Password
                  </>
                )}
              </button>

              <p>
                Don't have an account?{' '}
                <Link
                  to="/create-account"
                  className="text-primary-500 hover:underline"
                >
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

export default ResetPassword;
