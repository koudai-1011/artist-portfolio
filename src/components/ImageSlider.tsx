'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import Lightbox from './Lightbox';

type ImageData = {
  url: string;
  height: number;
  width: number;
};

type Props = {
  images: ImageData[];
  alt: string;
  autoSlideInterval?: number; // in milliseconds, default 5000 (5 seconds)
};

export default function ImageSlider({ images, alt, autoSlideInterval = 5000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    setIsPaused(true); // Pause auto-slide when lightbox opens
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsPaused(false); // Resume auto-slide when lightbox closes
  };

  // Auto-slide effect (only for multiple images)
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, isPaused, autoSlideInterval, currentIndex]);

  if (!images || images.length === 0) {
    return null;
  }

  // Single image with zoom capability
  if (images.length === 1) {
    return (
      <>
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer group"
          onClick={openLightbox}
        >
          <Image
            src={images[0].url}
            alt={alt}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            priority
          />
          {/* Zoom Icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
            <div className="p-3 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <FaExpand className="text-black text-xl" />
            </div>
          </div>
        </div>

        {isLightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={0}
            onClose={closeLightbox}
            onNext={() => {}}
            onPrevious={() => {}}
            alt={alt}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-900 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-pointer"
            onClick={openLightbox}
          >
            <Image
              src={images[currentIndex].url}
              alt={`${alt} - ${currentIndex + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              priority={currentIndex === 0}
            />
            {/* Zoom Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
              <div className="p-3 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <FaExpand className="text-black text-xl" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
                setIsPaused(true); // Pause when user manually navigates
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95 z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-black dark:text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
                setIsPaused(true); // Pause when user manually navigates
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95 z-10"
              aria-label="Next image"
            >
              <FaChevronRight className="text-black dark:text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                    setIsPaused(true); // Pause when user manually selects
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {isLightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={goToNext}
          onPrevious={goToPrevious}
          alt={alt}
        />
      )}
    </>
  );
}
