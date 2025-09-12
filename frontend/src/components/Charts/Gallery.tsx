"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon, Loader2 } from "lucide-react";
import ImageFetchLoader from "../ImageFetchLoader";

const Gallery: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const carousel = ImageFetchLoader();

  const images = carousel ? [
    carousel.carousel1,
    carousel.carousel2,
    carousel.carousel3,
    carousel.carousel4,
    carousel.carousel5,
  ].filter(Boolean) as string[] : [];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Loading state
  if (!carousel) {
    return (
      <div className="col-span-12 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm dark:bg-gray-900/80 dark:border-gray-800 xl:col-span-8">
        <div className="flex items-center justify-center h-80">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 xl:col-span-8">
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/20 to-transparent p-6">
          <h2 className="text-lg font-medium text-white drop-shadow-lg">
            बिगतका कार्यक्रमा केहि झलकहरु
          </h2>
        </div>

        {/* Main Content */}
        <div className="relative h-80 sm:h-96">
          {images.length > 0 ? (
            <>
              {/* Current Image */}
              <div className="relative w-full h-full">
                {images[currentSlide] ? (
                  <Image
                    src={images[currentSlide]}
                    alt={`Gallery image ${currentSlide + 1}`}
                    fill
                    className="object-cover"
                    priority={currentSlide === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    onMouseEnter={() => setIsAutoPlay(false)}
                    onMouseLeave={() => setIsAutoPlay(true)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    onMouseEnter={() => setIsAutoPlay(false)}
                    onMouseLeave={() => setIsAutoPlay(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      onMouseEnter={() => setIsAutoPlay(false)}
                      onMouseLeave={() => setIsAutoPlay(true)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "w-8 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Slide Counter */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-md rounded-full px-3 py-1 text-sm text-white font-medium">
                  {currentSlide + 1} / {images.length}
                </div>
              )}
            </>
          ) : (
            // No Images State
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">0</span>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-lg font-medium">कुनै छविहरू उपलब्ध छैन</p>
                <p className="text-sm opacity-70">No images available yet</p>
              </div>
              
              <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar (only when images exist) */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-white transition-all duration-4000 ease-linear"
              style={{
                width: `${((currentSlide + 1) / images.length) * 100}%`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;