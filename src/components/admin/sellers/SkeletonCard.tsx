
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-gray-200 border rounded-full w-12 h-12" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="h-5 bg-gray-200 rounded-full w-16 mb-3" />
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
