const SkeletonTable = ({ rows, cols }: { rows: number; cols: number }) => {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="animate-pulse flex justify-between items-center p-4 border-b"
        >
          <div className="flex space-x-4">
            {[...Array(cols)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gray-300 rounded"
                style={{ width: `${Math.floor(Math.random() * 100) + 50}px` }} // Random width for dynamic columns
              ></div>
            ))}
          </div>
          <div className="flex space-x-3">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;
