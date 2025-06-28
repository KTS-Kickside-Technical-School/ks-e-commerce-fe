const ShopCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="relative">
        <div className="bg-gray-200 animate-pulse h-32"></div>
      </div>

      <div className="p-6">
        <div className="bg-gray-200 animate-pulse h-6 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 animate-pulse h-4 rounded w-full"></div>
          <div className="bg-gray-200 animate-pulse h-4 rounded w-5/6"></div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="bg-gray-200 animate-pulse h-4 rounded w-16"></div>
          <div className="bg-gray-200 animate-pulse h-6 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ShopCardSkeleton;
