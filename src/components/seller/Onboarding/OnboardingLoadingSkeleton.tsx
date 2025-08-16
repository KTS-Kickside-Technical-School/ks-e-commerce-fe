import SEO from '../../../middlewares/SEO';

const OnboardingLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
    <SEO title="Loading - Kickside Shop" />

    <div className="w-full bg-white h-2">
      <div className="bg-blue-600 h-full w-1/3" />
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
                className={`flex-1 py-4 flex items-center justify-center gap-2 ${
                  step === 1
                    ? 'bg-blue-50 text-blue-600 font-medium border-b-2 border-blue-600'
                    : 'text-gray-300 bg-gray-50'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-10 h-4 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="flex-grow p-6 md:p-10">
            <div className="space-y-6 flex-grow flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded-full w-40 animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                <div>
                  <div className="h-5 bg-gray-200 rounded-full w-32 mb-2 animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                <div>
                  <div className="h-5 bg-gray-200 rounded-full w-48 mb-2 animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                <div className="md:col-span-2">
                  <div className="h-5 bg-gray-200 rounded-full w-40 mb-2 animate-pulse"></div>
                  <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                <div className="md:col-span-2">
                  <div className="h-5 bg-gray-200 rounded-full w-64 mb-2 animate-pulse"></div>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-100 animate-pulse">
                    <div className="mx-auto w-10 h-10 bg-gray-300 rounded-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-full mx-auto w-2/3 mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded-full mx-auto w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OnboardingLoadingSkeleton;
