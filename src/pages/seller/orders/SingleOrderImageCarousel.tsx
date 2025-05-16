import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SingleOrderImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative">
      <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
        <img
          src={images[currentIndex]}
          alt="Product"
          className="h-full w-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + images.length) % images.length
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 text-white hover:bg-black/50"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 p-1 text-white hover:bg-black/50"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleOrderImageCarousel;
