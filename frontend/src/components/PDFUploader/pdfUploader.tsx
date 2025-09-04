"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";

interface PdfUploaderProps {
  onUploadSuccess: () => void; // Function to call when upload is successful
}

interface Event {
  eventId: number;
  eventHeading: string;
  eventDetails: string;
  eventDate: string;
  eventTime: string;
  address: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  venue?: string;
  eventOrganizer: string;
  eventType: string;
  remarks: string;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [eventId, setEventId] = useState<number | null>(null); // Selected event
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>(""); // PDF description

  // Fetch events
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch events data
        const eventsResponse = await axios.get<Event[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/events",
        );
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setError(null); // Clear previous error
      setSuccessMessage(null); // Clear previous success message
    } else {
      setError("Please select a valid PDF file.");
      setFile(null); // Reset file if invalid
      setPreviewUrl(null);
    }
  };

  const handleDiscardFile = () => {
    // Clean up the preview URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setSuccessMessage(null);
    setDescription(""); // Reset description
    
    // Reset file input
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }
    if (!eventId) {
      setError("Please select an event.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventId", eventId.toString()); // Ensure this is sent in the body
    formData.append("description", description); // Add description to form data

    setUploading(true);
    setSuccessMessage(null);
    setError(null);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BE_HOST}/pdf-upload/upload`, // Correct endpoint
        formData, // Send formData which includes file and eventId
      );
      setSuccessMessage("File uploaded successfully!");
      
      // Clear file after successful upload
      handleDiscardFile();
      
      onUploadSuccess(); // Trigger table reload after successful upload
    } catch (err) {
      setError("Error uploading file.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          PDF अपलोड गर्नुहोस्:
        </h3>
      </div>
      <div className="p-7">
        {/* Event Dropdown */}
        <div className="mb-5.5">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="eventSelect"
          >
            इभेन्ट चयन गर्नुहोस्
          </label>
          <select
            id="eventSelect"
            value={eventId || ""}
            onChange={(e) => setEventId(Number(e.target.value))}
            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          >
            <option value="" disabled>
              {loading ? "Loading events..." : "इभेन्ट चयन गर्नुहोस्"}
            </option>
            {events.map((event) => (
              <option key={event.eventId} value={event.eventId}>
                {event.eventHeading}
              </option>
            ))}
          </select>
        </div>

        {/* Description Input */}
        <div className="mb-5.5">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="description"
          >
            PDF विवरण (वैकल्पिक)
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="यो PDF के बारेमा छ भन्नुहोस्..."
            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary resize-none"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            PDF को सामग्री र उद्देश्यको बारेमा छोटो विवरण दिनुहोस्
          </p>
        </div>

        {/* PDF File Input */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />

        {!file ? (
          <label
            htmlFor="pdf-upload"
            className="flex cursor-pointer items-center justify-center rounded bg-primary px-6 py-3 text-white transition hover:bg-opacity-90 w-full sm:w-auto"
          >
            <FaPlus className="mr-2" />
            Select PDF
          </label>
        ) : (
          <div className="space-y-4">
            {/* File Info with Discard Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-meta-4 rounded-lg border border-stroke">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  📄 {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleDiscardFile}
                className="flex items-center px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Remove selected file"
              >
                <FaTimes className="mr-2" />
                Discard
              </button>
            </div>

            {/* PDF Preview */}
            {previewUrl && (
              <div className="border border-stroke rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-meta-4 px-4 py-3 border-b border-stroke flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    PDF Preview
                  </h4>
                  <button
                    onClick={handleDiscardFile}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Close preview and remove file"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
                <div className="p-4">
                  <iframe
                    src={previewUrl}
                    className="w-full h-96 sm:h-[500px] border-0 rounded"
                    title="PDF Preview"
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full sm:w-auto flex justify-center rounded bg-primary px-6 py-3 font-medium text-white transition hover:bg-opacity-90 ${
                uploading ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfUploader;