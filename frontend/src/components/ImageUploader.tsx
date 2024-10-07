"use client"; // Ensure this component runs on the client side

import axios from "axios";
import React, { useState } from "react";

const ImgUpldr = () => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("icon", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_HOST}/settings`, // Adjust the URL as needed
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSuccessMessage("File uploaded successfully!");
      setErrorMessage(null); // Clear any previous errors
      console.log(response.data); // Handle response data as needed
    } catch (error) {
      setErrorMessage("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="file-upload">Upload Icon:</label>
        <input
          type="file"
          id="file-upload"
          accept="image/*" // Optional: restrict to image files
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>
      <button type="submit">Submit</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
};

export default ImgUpldr;
