"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image"; // Import the Image component

const Gallery: React.FC = () => {
  // Sample images for the gallery
  const images = [
    {
      src: "/images/congress/NC0.jpg",
      alt: "Gallery Image 1",
    },
    {
      src: "/images/congress/NC1.jpg",
      alt: "Gallery Image 2",
    },
    {
      src: "/images/congress/NC4.jpg",
      alt: "Gallery Image 3",
    },
    {
      src: "/images/congress/NC5.jpg",
      alt: "Gallery Image 4",
    },
    {
      src: "/images/congress/NC8.jpg",
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
              <Image
                src={image.src}
                alt={image.alt}
                width={1000} // Specify the width
                height={400} // Specify the height
                className=""
                style={{ objectFit: "cover" }} // Maintain aspect ratio
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Gallery;
