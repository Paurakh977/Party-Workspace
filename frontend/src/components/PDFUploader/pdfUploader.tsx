"use client";
import React, { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

interface PdfUploaderProps {
  onUploadSuccess: () => void; // Function to call when upload is successful
  eventId: number; // Add eventId prop to associate the upload with an event
}

const PdfUploader: React.FC<PdfUploaderProps> = ({
  onUploadSuccess,
  eventId,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null); // Clear previous error
    } else {
      setError("Please select a valid PDF file.");
      setFile(null); // Reset file if invalid
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventId", eventId.toString()); // Ensure this is sent in the body

    setUploading(true);
    setSuccessMessage(null);
    setError(null);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BE_HOST}/pdf-upload/upload`, // Correct endpoint
        formData, // Send formData which includes file and eventId
      );
      setSuccessMessage("File uploaded successfully!");
      setFile(null); // Clear file after upload
      onUploadSuccess(); // Trigger table reload after successful upload
    } catch (err) {
      setError("Error uploading file.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden" // Hide the file input for better UI
        id="pdf-upload" // ID for the label to refer to
      />

      {/* Render Select PDF button or file name and Upload button */}
      {!file ? (
        <label
          htmlFor="pdf-upload"
          className="flex cursor-pointer items-center rounded-md bg-blue-600 px-4 py-2 text-white transition duration-200 hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Select PDF
        </label>
      ) : (
        <>
          <p className="text-gray-600">{file.name}</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`flex items-center rounded-md px-4 py-2 transition duration-200 
              ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
              text-white focus:outline-none`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default PdfUploader;
