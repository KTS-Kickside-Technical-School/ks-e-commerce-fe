import { useFormik } from 'formik';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';
import Bg from '/login-bg.jpg';
import authRequests from '../../../requests/authRequests.ts';
import { FaPaperPlane } from 'react-icons/fa6';
import { MdMarkEmailRead } from 'react-icons/md';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authRequests.userForgetPassword(values);

        if (response.status !== 200) {
          // Show error alert (or custom error block here if you want)
          alert(response.message || 'Failed to send reset email.');
          return;
        }

        // Set success flag
        setEmailSent(true);
      } catch (error: any) {
        alert(error.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
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
            {!emailSent ? (
              <>
                <h2 className="text-2xl font-semibold text-primary-500 text-center mb-6 flex">
                  <FaUser className="m-1 w-5" />
                  <span>Forgot password?</span>
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
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-6 h-6"></div>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" /> Submit
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center px-4 py-10">
                <MdMarkEmailRead className="text-primary-500 text-6xl mb-4" />
                <h2 className="text-2xl font-bold text-primary-500 mb-2">
                  Email Sent Successfully!
                </h2>
                <p className="text-gray-700 max-w-md">
                  📩 Please check your inbox and follow the instructions to
                  reset your password. If you don’t see it within a few minutes,
                  check your spam or junk folder.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
