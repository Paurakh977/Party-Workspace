"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PdfUploader from "./pdfUploader";

interface PdfUpload {
  id: number;
  fileName: string;
  filePath: string; // This should contain the correct URL to the PDF
}

const PdfDisplayer: React.FC = () => {
  const [pdfs, setPdfs] = useState<PdfUpload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPdf, setCurrentPdf] = useState<string | null>(null); // State to hold the current PDF file path

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_HOST}/pdf-upload`,
        );
        setPdfs(response.data); // Ensure this data includes the correct `filePath`
      } catch (err) {
        setError("Error fetching PDF files.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  const handleViewPdf = (filePath: string) => {
    window.open(filePath, "_blank"); // Open the PDF in a new tab
  };

  const closePdfViewer = () => {
    setCurrentPdf(null); // Close the PDF viewer if needed
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <PdfUploader />

      <div className="flex flex-col space-y-4">
        <div className="bg-gray-200 grid grid-cols-2 rounded-sm px-4 py-2.5 text-center dark:bg-meta-4 sm:grid-cols-4">
          <div className="col-span-2 p-2.5 sm:col-span-2 xl:col-span-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              फाइलको नाम
            </h5>
          </div>
          <div className="p-2.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              फाइलको लिंक
            </h5>
          </div>
        </div>

        {pdfs.map((pdf, index) => (
          <div
            className={`grid grid-cols-2 rounded-sm px-4 py-2.5 text-center sm:grid-cols-4 ${
              index === pdfs.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={pdf.id}
          >
            <div className="col-span-2 flex items-center justify-center p-2.5 sm:col-span-2 xl:col-span-3">
              <p className="text-black dark:text-white">{pdf.fileName}</p>
            </div>
            <div className="flex items-center justify-center p-2.5">
              <button type="button" onClick={() => handleViewPdf(pdf.filePath)}>
                हेर्नुहोस्
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfDisplayer;
