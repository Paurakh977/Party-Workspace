"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

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
    if (!eventId) {
      setError("Please select an event.");
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
            className="flex cursor-pointer items-center rounded bg-primary px-6 py-2 text-white transition hover:bg-opacity-90"
          >
            <FaPlus className="mr-2" />
            Select PDF
          </label>
        ) : (
          <>
            <p className="text-gray-600 dark:text-white">{file.name}</p>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`flex justify-center rounded bg-primary px-6 py-2 font-medium text-white transition hover:bg-opacity-90 ${
                uploading ? "bg-gray-400" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </>
        )}

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        {successMessage && (
          <p className="mt-4 text-sm text-green-500">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default PdfUploader;
