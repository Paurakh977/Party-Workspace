import React from "react";
import PdfUploader from "@/components/PDFUploader/pdfUploader";
import PdfDisplayer from "@/components/PDFUploader/pdfDisplayer";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const HomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <Breadcrumb pageName="पि डि एफ" />
        <div>
          {/* Table component */}
          <PdfUploader />
          <PdfDisplayer />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomePage;
