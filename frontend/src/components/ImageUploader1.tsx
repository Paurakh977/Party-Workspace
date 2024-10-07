"use client";
import axios from "axios";
import React, { useState } from "react";

const ImageUploader = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log(`event.target.files ${event.target.files}`);
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BE_HOST + "/settings",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);
      console.log(formData);
    } catch (error) {
      console.error("Error Uploading File: ", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="border-gray-200 dark:border-gray-700 m-2 p-4"
      >
        Upload
      </button>
    </div>
  );
};

export default ImageUploader;
