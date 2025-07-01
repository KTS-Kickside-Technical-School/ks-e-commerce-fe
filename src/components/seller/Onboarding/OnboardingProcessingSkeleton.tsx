import SEO from '../../../middlewares/SEO';

const OnboardingProcessingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
    <SEO title="Processing - Kickside Store" />

    <div className="w-full bg-white h-2">
      <div className="bg-blue-600 h-full w-full" />
    </div>

    <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
        <div className="text-center mb-10 mt-4">
          <div className="h-12 bg-gray-200 rounded-full mx-auto w-2/3 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-full mx-auto w-1/2 mt-4 animate-pulse"></div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden flex-grow flex flex-col">
          <div className="flex border-b border-gray-200">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 py-4 flex items-center justify-center gap-2 ${'bg-blue-50 text-blue-600 font-medium border-b-2 border-blue-600'}`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-400"></div>
                <div className="w-10 h-4 bg-gray-700 rounded-full"></div>
              </div>
            ))}
          </div>

          <div className="flex-grow p-6 md:p-10 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OnboardingProcessingSkeleton;
