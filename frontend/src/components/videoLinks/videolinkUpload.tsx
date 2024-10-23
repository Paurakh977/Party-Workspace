"use client";
import React, { useState } from "react";
import axios from "axios";

interface SocialLinkUploaderProps {
  onUploadSuccess: () => void; // Function to call when upload is successful
}

const SocialLinkUploader: React.FC<SocialLinkUploaderProps> = ({
  onUploadSuccess,
}) => {
  const [linkName, setLinkName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!linkName || !link) {
      setError("Please fill out both fields.");
      return;
    }

    const data = {
      linkName,
      link,
    };

    setUploading(true);
    setSuccessMessage(null);
    setError(null);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BE_HOST}/social-links`,
        data, // Sending JSON data
        {
          headers: {
            "Content-Type": "application/json", // Explicitly set JSON content type
          },
        },
      );
      setSuccessMessage("Social link uploaded successfully!");
      setLinkName(""); // Clear inputs after upload
      setLink(""); // Clear inputs after upload
      onUploadSuccess(); // Trigger any post-upload action
    } catch (err) {
      setError("Error uploading social link.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <input
        type="text"
        placeholder="Enter Link Name"
        value={linkName}
        onChange={(e) => setLinkName(e.target.value)}
        className="rounded border px-4 py-2"
      />

      <input
        type="text"
        placeholder="Enter Link URL"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="rounded border px-4 py-2"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`flex items-center rounded-md px-4 py-2 transition duration-200 
          ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
          text-white focus:outline-none`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default SocialLinkUploader;
