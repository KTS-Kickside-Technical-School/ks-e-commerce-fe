import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Props {
  images: string[];
}

const CoverCarousel = ({ images }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl shadow-inner">
        No cover images available
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative w-full h-64 sm:h-80 md:h-[25rem] overflow-hidden rounded-2xl mb-10 shadow-xl">
        <img
          src={images[0]}
          alt="Shop cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-[25rem] overflow-hidden rounded-2xl mb-10 shadow-xl group">
      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`Shop image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-100 group-hover:scale-[1.02]"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 hover:scale-110 text-black p-2 rounded-full shadow-md transition-all z-20"
        aria-label="Previous Slide"
      >
        <FaChevronLeft size={18} />
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 hover:scale-110 text-black p-2 rounded-full shadow-md transition-all z-20"
        aria-label="Next Slide"
      >
        <FaChevronRight size={18} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'bg-white shadow-sm shadow-white'
                : 'bg-white/40'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CoverCarousel;
