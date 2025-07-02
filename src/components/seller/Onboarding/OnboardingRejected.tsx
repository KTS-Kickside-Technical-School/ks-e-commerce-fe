import { FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';
import SEO from '../../../middlewares/SEO';
import OnboardingSubnavbar from './OnboardingSubnavbar';

const OnboardingRejected = ({
  rejectionReason,
}: {
  rejectionReason?: string;
}) => {
  const adminEmail =
    import.meta.env.VITE_ADMIN_EMAIL || 'ndahimana154@gmail.com';

  return (
    <div className="fixed inset-0 bg-black min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex flex-col bg-opacity-50 z-[300] overflow-y-auto">
      <OnboardingSubnavbar />
      <div className="min-h-screen flex items-center justify-center p-6">
        <SEO title="Shop Rejected - Kickside Store" />
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Your Shop Application Was Rejected
          </h1>

          {rejectionReason && (
            <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-red-800 mb-2">
                Reason for Rejection
              </h3>
              <p className="text-gray-700">{rejectionReason}</p>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            We're sorry to inform you that your shop application did not meet
            our requirements at this time.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Appeal Process</h3>
            <ul className="text-gray-700 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" />
                <span>
                  If you believe this was a mistake, you can appeal the decision
                  by emailing our admin team
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" />
                <span>
                  Please include your shop name and any additional information
                  that might help us review your application
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" />
                <span>
                  Send your appeal to:
                  <a
                    href={`mailto:${adminEmail}`}
                    className="ml-1 text-blue-600 hover:underline"
                  >
                    {adminEmail}
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <p className="text-gray-500 text-sm">
              We aim to respond to all appeals within 3-5 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingRejected;
