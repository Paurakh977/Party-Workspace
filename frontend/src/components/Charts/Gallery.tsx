"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image"; // Import the Image component
import ImageFetchLoader from "../ImageFetchLoader";

const Gallery: React.FC = () => {
  // Fetch images for the gallery
  const carousel = ImageFetchLoader();

  // Check if carousel data is loaded
  if (!carousel) {
    return <div>Loading...</div>; // Show loading state if carousel data isn't ready
  }

  const images = [
    {
      src: carousel.carousel1,
      alt: "Gallery Image 1",
    },
    {
      src: carousel.carousel2,
      alt: "Gallery Image 2",
    },
    {
      src: carousel.carousel3,
      alt: "Gallery Image 3",
    },
    {
      src: carousel.carousel4,
      alt: "Gallery Image 4",
    },
    {
      src: carousel.carousel5,
      alt: "Gallery Image 5",
    },
  ];

  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <h2 className="mb-4 text-center text-title-lg font-semibold text-black">
        बिगतका कार्यक्रमा केहि झलकहरु
      </h2>
      <div className="gallery">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="flex justify-center">
              {image.src ? ( // Check if the image.src is valid
                <Image
                  src={image.src} // Directly use the URL from the carousel data
                  alt={image.alt}
                  width={1000} // Specify the width
                  height={400} // Specify the height
                  className=""
                  style={{ objectFit: "cover" }} // Maintain aspect ratio
                />
              ) : (
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "1000px",
                    height: "400px",
                    backgroundColor: "#f0f0f0",
                  }}
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
