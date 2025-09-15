"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventImage {
  id: number;
  eventId: number;
  fileName: string;
  filePath: string;
}

interface Props {
  eventId: number | string;
  refreshKey?: number;
}

const EventImageGallery: React.FC<Props> = ({ eventId, refreshKey }) => {
  const [images, setImages] = useState<EventImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_HOST}/event-images/event/${eventId}`,
        );
        setImages(res.data || []);
        setCurrent(0);
      } catch (e) {
        setImages([]);
      }
    };
    run();
  }, [eventId, refreshKey]);

  const hasImages = images.length > 0;
  const next = () => setCurrent((p) => (p + 1) % images.length);
  const prev = () => setCurrent((p) => (p - 1 + images.length) % images.length);

  if (!hasImages) return null;

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        className="relative w-full h-56 md:h-64 xl:h-72 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none"
      >
        <Image
          src={images[current]?.filePath || ""}
          alt={images[current]?.fileName || "Event image"}
          fill
          className="object-contain"
        />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative w-full max-w-5xl h-[80vh] bg-black rounded-lg overflow-hidden">
            <Image src={images[current]?.filePath || ""} alt="preview" fill className="object-contain" />
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

export default EventImageGallery;


