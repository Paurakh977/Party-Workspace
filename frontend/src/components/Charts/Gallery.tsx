"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import ImageFetchLoader from "../ImageFetchLoader";
import axios from "axios";
import { resolveImageUrl, isExternalUrl } from "@/utils/imageUrl";

const PlaceholderImage = () => (
  <div className="w-full h-80 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <p className="text-sm font-light text-gray-400">कुनै तस्बिर उपलब्ध छैन</p>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="animate-pulse">
    <div className="h-80 bg-gray-100 dark:bg-gray-800"></div>
  </div>
);

const Gallery: React.FC = () => {
  const carousel = ImageFetchLoader();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [eventImages, setEventImages] = useState<{ src: string; alt: string }[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  // Process images
  const images = React.useMemo(() => {
    if (eventImages.length > 0) {
      return eventImages;
    }
    if (!carousel) return [];
    return [
      { src: resolveImageUrl(carousel.carousel1), alt: "Gallery Image 1" },
      { src: resolveImageUrl(carousel.carousel2), alt: "Gallery Image 2" },
      { src: resolveImageUrl(carousel.carousel3), alt: "Gallery Image 3" },
      { src: resolveImageUrl(carousel.carousel4), alt: "Gallery Image 4" },
      { src: resolveImageUrl(carousel.carousel5), alt: "Gallery Image 5" },
    ].filter((img) => img.src);
  }, [carousel, eventImages]);

  useEffect(() => {
    const fetchEventImages = async () => {
      try {
        const res = await axios.get(new URL('/event-images', process.env.NEXT_PUBLIC_BE_HOST as string).toString());
        const mapped = Array.isArray(res.data)
          ? res.data
              .filter((it) => it?.filePath)
              .map((it) => ({ src: resolveImageUrl(it.filePath as string), alt: it.fileName as string }))
          : [];
        setEventImages(mapped);
      } catch (e) {
        setEventImages([]);
      }
    };
    fetchEventImages();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const openPreview = () => {
    if (images[currentSlide]?.src) {
      setPreviewSrc(images[currentSlide].src);
      setIsPreviewOpen(true);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-light text-gray-900 dark:text-white">
          बिगतका कार्यक्रमका केहि झलकहरु
        </h2>
      </div>

      {/* Gallery Content */}
      {!carousel ? (
        <LoadingState />
      ) : images.length === 0 ? (
        <PlaceholderImage />
      ) : (
        <div className="relative group">
          {/* Main Image */}
          <div 
            className="relative w-full h-80 cursor-pointer overflow-hidden bg-gray-50 dark:bg-gray-900"
            onClick={openPreview}
          >
            <Image
              src={images[currentSlide]?.src || ""}
              alt={images[currentSlide]?.alt || "Gallery image"}
              fill
              className="object-cover transition-opacity duration-500"
              unoptimized={isExternalUrl(images[currentSlide]?.src)}
              priority={currentSlide === 0}
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="flex justify-center mt-6 gap-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 transition-all duration-200 ${
                    index === currentSlide
                      ? "bg-gray-900 dark:bg-white w-8"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-500 w-1"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Image Counter */}
          {images.length > 0 && (
            <div className="flex justify-center mt-4">
              <span className="text-sm font-light text-gray-400">
                {images.length > 1 ? `${currentSlide + 1} of ${images.length}` : `${images.length} तस्बिरहरु`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Full Screen Preview Modal */}
      {isPreviewOpen && previewSrc && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative w-full h-full">
            <Image
              src={previewSrc}
              alt="Full screen preview"
              fill
              className="object-contain"
              unoptimized={isExternalUrl(previewSrc)}
              priority
            />
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl font-light leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;