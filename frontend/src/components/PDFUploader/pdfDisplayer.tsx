"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PdfUploader from "./pdfUploader";

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
        यस कार्यक्रमका पि.डि.एफहरु
      </h4>

      <ul className="list-disc space-y-2 pl-6">
        {pdfs.map((pdf) => (
          <li key={pdf.id} className="text-black dark:text-white">
            <button
              type="button"
              onClick={() => handleViewPdf(pdf.filePath)}
              className="underline hover:text-blue-600"
            >
              {pdf.fileName}
            </button>
          </li>
        ))}
      </ul>

      {/* Place the PDF uploader component below the list */}
      <PdfUploader onUploadSuccess={fetchPdfs} eventId={eventId} />
    </div>
  );
};

export default PdfDisplayer;
