"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PdfUploader from "@/components/PDFUploader/pdfUploader"; // Adjust the import path as necessary

const PdfUploaderPage = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSuccess = () => {
    setUploadSuccess(true); // Logic to run after a successful upload
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="PDF अपलोड व्यवस्थापन" />

        <div className="mt-8">
          <PdfUploader onUploadSuccess={handleUploadSuccess} />
          {uploadSuccess && (
            <p className="mt-4 text-green-500">PDF uploaded successfully!</p>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PdfUploaderPage;
