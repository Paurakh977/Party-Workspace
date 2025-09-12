"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import ImageFetchLoader from "../ImageFetchLoader";

const Gallery: React.FC = () => {
  const carousel = ImageFetchLoader();

  if (!carousel) {
    return <div className="col-span-12 rounded-lg border border-stroke bg-white p-5 text-sm text-gray-600 shadow-sm dark:border-strokedark dark:bg-boxdark dark:text-gray-300 xl:col-span-8">Loading...</div>;
  }

  const images = [
    { src: carousel.carousel1, alt: "Gallery Image 1" },
    { src: carousel.carousel2, alt: "Gallery Image 2" },
    { src: carousel.carousel3, alt: "Gallery Image 3" },
    { src: carousel.carousel4, alt: "Gallery Image 4" },
    { src: carousel.carousel5, alt: "Gallery Image 5" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  } as const;

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <h2 className="mb-3 text-center text-base font-semibold text-black dark:text-white">
        बिगतका कार्यक्रमा केहि झलकहरु
      </h2>
      <div className="gallery">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="flex justify-center">
              {image.src ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={360}
                  className="rounded-md"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-md"
                  style={{ width: "100%", height: "360px", backgroundColor: "#f0f0f0" }}
                >
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Gallery;