const SingleOrderSkeleton = () => {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <div className="mb-6 h-4 w-24 rounded bg-gray-200"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between mb-6">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-6">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="flex items-start">
                  <div className="h-32 w-32 bg-gray-200 rounded mr-4"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default SingleOrderSkeleton;