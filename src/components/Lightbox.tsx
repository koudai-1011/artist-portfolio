'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type ImageData = {
  url: string;
  height: number;
  width: number;
};

type Props = {
  images: ImageData[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  alt: string;
};

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrevious, alt }: Props) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const minDistance = 50;

    if (Math.abs(diff) > minDistance && images.length > 1) {
      if (diff > 0) {
        // Swiped left - show next image
        onNext();
      } else {
        // Swiped right - show previous image
        onPrevious();
      }
    }

    setTouchStartX(null);
  };

  // Handle click - close if clicking outside the image
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Close if clicking directly on the background
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={handleBackgroundClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
          aria-label="Close lightbox"
        >
          <FaTimes className="text-white text-xl" />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 text-white rounded-full text-sm z-20">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Main Image Container */}
        <div
          ref={imageRef}
          className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto px-4 sm:px-16 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            >
              <Image
                src={images[currentIndex].url}
                alt={`${alt} - ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 z-20"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-white text-2xl" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 z-20"
              aria-label="Next image"
            >
              <FaChevronRight className="text-white text-2xl" />
            </button>
          </>
        )}

        {/* Thumbnail Strip (for multiple images) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 z-20 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to the clicked thumbnail's index
                  const diff = index - currentIndex;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) onNext();
                  } else if (diff < 0) {
                    for (let i = 0; i < Math.abs(diff); i++) onPrevious();
                  }
                }}
                className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden transition-all ${index === currentIndex
                    ? 'ring-2 ring-white scale-110'
                    : 'opacity-50 hover:opacity-100'
                  }`}
              >
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
