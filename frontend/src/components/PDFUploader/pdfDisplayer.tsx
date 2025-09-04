"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PdfUploader from "./pdfUploader";
import { FaTrash, FaEye } from "react-icons/fa";

interface PdfUpload {
  id: number;
  fileName: string;
  filePath: string; // This should contain the correct URL to the PDF
}

interface PdfDisplayerProps {
  eventId: number; // Add eventId as a prop
}

const PdfDisplayer: React.FC<PdfDisplayerProps> = ({ eventId }) => {
  const [pdfs, setPdfs] = useState<PdfUpload[]>([]); // State for an array of PDFs
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPdfs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_HOST}/pdf-upload/event/${eventId}`,
      );
      console.log("Response data:", response.data);

      // Set the PDFs array from the response
      if (Array.isArray(response.data)) {
        setPdfs(response.data);
      } else {
        setError("Unexpected response format. Expected an array.");
        console.error("Unexpected response:", response.data);
      }
    } catch (err) {
      setError("Error fetching PDF files.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, [eventId]); // Fetch PDFs again when eventId changes

  const handleViewPdf = (filePath: string) => {
    window.open(filePath, "_blank"); // Open the PDF in a new tab
  };

  const handleDeletePdf = async (pdfId: number) => {
    if (confirm("Are you sure you want to delete this PDF?")) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BE_HOST}/pdf-upload/${pdfId}`);
        // Refresh the PDF list after deletion
        fetchPdfs();
      } catch (err) {
        console.error("Error deleting PDF:", err);
        alert("Error deleting PDF. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
          यस कार्यक्रमका पि.डि.एफहरु
        </h4>
        <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-meta-4 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Loading PDFs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
          यस कार्यक्रमका पि.डि.एफहरु
        </h4>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
        यस कार्यक्रमका पि.डि.एफहरु
      </h4>
      
      {pdfs.length === 0 ? (
        <div className="p-4 bg-gray-50 dark:bg-meta-4 rounded-lg border border-stroke">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            No PDFs uploaded for this event yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-meta-4 rounded-lg border border-stroke hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {pdf.fileName}
              </p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleViewPdf(pdf.filePath)}
                className="flex items-center px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="View PDF"
              >
                <FaEye className="mr-1" />
                View
              </button>
              <button
                type="button"
                onClick={() => handleDeletePdf(pdf.id)}
                className="flex items-center px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="Delete PDF"
              >
                <FaTrash className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default PdfDisplayer;
