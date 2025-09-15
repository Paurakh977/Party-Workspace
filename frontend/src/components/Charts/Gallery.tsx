"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import ImageFetchLoader from "../ImageFetchLoader";
import axios from "axios";

const PlaceholderImage = () => (
  <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center group">
    <div className="text-center">
      <div className="mb-3 p-4 bg-white dark:bg-gray-700 rounded-full shadow-sm mx-auto w-fit">
        <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        कुनै तस्बिर उपलब्ध छैन
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        No images available
      </p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-lg"></div>
  </div>
);

const LoadingState = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4 dark:bg-gray-700"></div>
    <div className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
  </div>
);

const Gallery: React.FC = () => {
  // All hooks must be at the top level - no conditional hooks
  const carousel = ImageFetchLoader();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [eventImages, setEventImages] = useState<{ src: string; alt: string }[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  // Process images - this will be empty array if carousel is null
  const images = React.useMemo(() => {
    if (eventImages.length > 0) {
      return eventImages;
    }
    if (!carousel) return [];
    return [
      { src: carousel.carousel1, alt: "Gallery Image 1" },
      { src: carousel.carousel2, alt: "Gallery Image 2" },
      { src: carousel.carousel3, alt: "Gallery Image 3" },
      { src: carousel.carousel4, alt: "Gallery Image 4" },
      { src: carousel.carousel5, alt: "Gallery Image 5" },
    ].filter((img) => img.src);
  }, [carousel, eventImages]);

  useEffect(() => {
    const fetchEventImages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_HOST}/event-images`,
        );
        const mapped = Array.isArray(res.data)
          ? res.data
              .filter((it) => it?.filePath)
              .map((it) => ({ src: it.filePath as string, alt: it.fileName as string }))
          : [];
        setEventImages(mapped);
      } catch (e) {
        setEventImages([]);
      }
    };
    fetchEventImages();
  }, []);

  const hasImages = images.length > 0;

  // This useEffect will always run, but will handle empty states gracefully
  useEffect(() => {
    // Early return if no conditions are met, but hook still runs
    if (!carousel || !hasImages || !isAutoPlaying || images.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carousel, hasImages, isAutoPlaying, images.length]);

  // Reset current slide if images change
  useEffect(() => {
    if (currentSlide >= images.length && images.length > 0) {
      setCurrentSlide(0);
    }
  }, [images.length, currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="col-span-12 xl:col-span-8 rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stroke dark:border-strokedark">
        <h2 className="text-base font-semibold text-black dark:text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
          बिगतका कार्यक्रमका केहि झलकहरु
        </h2>
      </div>

      {/* Gallery Content */}
      <div className="p-4">
        {!carousel ? (
          <LoadingState />
        ) : !hasImages ? (
          <PlaceholderImage />
        ) : (
          <div className="relative group">
            {/* Main Image Container */}
            <button
              type="button"
              onClick={() => {
                setPreviewSrc(images[currentSlide]?.src || null);
                setIsPreviewOpen(true);
              }}
              className="relative w-full h-56 md:h-64 xl:h-72 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none"
            >
              <Image
                src={images[currentSlide]?.src || ""}
                alt={images[currentSlide]?.alt || "Gallery image"}
                fill
                className="object-contain transition-all duration-500 ease-in-out"
                priority={currentSlide === 0}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {images.length > 1 && (
              <div className="flex justify-center mt-3 gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-blue-500 w-4"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        {hasImages && carousel && (
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{images.length} तस्बिरहरु</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{isAutoPlaying ? 'Auto playing' : 'Paused'}</span>
            </div>
          </div>
        )}
      </div>
      {isPreviewOpen && previewSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative w-full max-w-5xl h-[80vh] bg-black rounded-lg overflow-hidden">
            <Image src={previewSrc} alt="preview" fill className="object-contain" />
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-2 right-2 bg-white/90 text-black rounded px-2 py-1 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;