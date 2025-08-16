import { FaCheckCircle, FaClock } from 'react-icons/fa';
import SEO from '../../../middlewares/SEO';
import OnboardingSubnavbar from './OnboardingSubnavbar';

const OnboardingWaitingForApproval = () => {
  return (
    <div className="fixed inset-0 bg-black min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col bg-opacity-50 z-[300] overflow-y-auto">
      <OnboardingSubnavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
        <SEO title="Shop Pending Approval - Kickside Shop" />
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaClock className="text-yellow-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Your Shop is Pending Approval
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for registering your shop on Kickside. Your application is
            currently being reviewed by our team.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">
              What to Expect Next
            </h3>
            <ul className="text-gray-700 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>
                  Our team will review your application within 1-3 business days
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>
                  You will receive an email notification once your shop is
                  approved
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>
                  After approval, you can start adding products and managing
                  your shop
                </span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
            <div className="w-3 h-3 rounded-full bg-blue-300"></div>
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWaitingForApproval;
