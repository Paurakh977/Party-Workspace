"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PdfUploader from "./pdfUploader";
import { FaTrash, FaEye, FaFilePdf, FaDownload, FaClock } from "react-icons/fa";

interface PdfUpload {
  id: number;
  fileName: string;
  filePath: string; // This should contain the correct URL to the PDF
  description?: string; // PDF description
  fileSize?: number; // File size in bytes
  createdAt?: string; // Upload date
}

interface PdfDisplayerProps {
  eventId: number; // Add eventId as a prop
}

const PdfDisplayer: React.FC<PdfDisplayerProps> = ({ eventId }) => {
  const [pdfs, setPdfs] = useState<PdfUpload[]>([]); // State for an array of PDFs
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const handleDownloadPdf = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm">
      <div className="border-b border-stroke dark:border-strokedark px-6 py-4">
        <h4 className="text-xl font-semibold text-black dark:text-white flex items-center">
          <FaFilePdf className="mr-3 text-red-500" />
          यस कार्यक्रमका पि.डि.एफ दस्तावेजहरु
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {pdfs.length} वटा दस्तावेज उपलब्ध छ
        </p>
      </div>
      
      <div className="p-6">
        {pdfs.length === 0 ? (
          <div className="text-center py-12">
            <FaFilePdf className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              कुनै PDF दस्तावेज उपलब्ध छैन
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              यस कार्यक्रमका लागि अहिलेसम्म कुनै PDF अपलोड गरिएको छैन।
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="group relative bg-gray-50 dark:bg-meta-4 rounded-xl border border-stroke dark:border-strokedark hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header with icon and file name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                          <FaFilePdf className="text-red-500 text-xl" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-black dark:text-white truncate group-hover:text-primary transition-colors">
                          {pdf.fileName}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {pdf.fileSize && (
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                              {formatFileSize(pdf.fileSize)}
                            </span>
                          )}
                          {pdf.createdAt && (
                            <span className="flex items-center">
                              <FaClock className="mr-1" />
                              {formatDate(pdf.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {pdf.description && (
                    <div className="mb-4 p-3 bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark">
                      <p className="text-sm text-black dark:text-white leading-relaxed">
                        {pdf.description}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleViewPdf(pdf.filePath)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      title="PDF हेर्नुहोस्"
                    >
                      <FaEye className="mr-2" />
                      हेर्नुहोस्
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(pdf.filePath, pdf.fileName)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-meta-4 hover:bg-gray-50 dark:hover:bg-meta-3 border border-stroke dark:border-strokedark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      title="PDF डाउनलोड गर्नुहोस्"
                    >
                      <FaDownload className="mr-2" />
                      डाउनलोड
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePdf(pdf.id)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
                      title="PDF मेटाउनुहोस्"
                      style={{backgroundColor: '#dc2626', color: 'white', border: '1px solid #b91c1c'}}
                    >
                      <FaTrash className="mr-2" />
                      मेटाउनुहोस्
                    </button>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfDisplayer;
