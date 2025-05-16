const CartSkeletonLoader = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
        >
          <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 w-24 h-8 animate-pulse" />
              <div className="ml-auto w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default CartSkeletonLoader;
