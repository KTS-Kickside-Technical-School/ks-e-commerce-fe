import { FaCircle } from 'react-icons/fa';

const SingleOrderTImeline = ({
  items,
}: {
  items: Array<{
    date: Date;
    title: string;
    description?: string;
    images?: string[];
  }>;
}) => {
  return (
    <div className="relative">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative pb-6 pl-6 border-l-2 border-gray-200"
        >
          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary-500">
            <FaCircle className="h-full w-full text-white" />
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {item.date.toLocaleDateString()} -{' '}
              {item.date.toLocaleTimeString()}
            </p>
            <h3 className="mt-1 font-medium">{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            )}

            {item.images && item.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {item.images.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img}
                    className="h-12 w-12 rounded border object-cover"
                    alt="Process documentation"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SingleOrderTImeline;
