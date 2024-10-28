"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SocialLinkUploader from "@/components/videoLinks/videolinkUpload";

const SocialLinkUploaderPage = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSuccess = () => {
    setUploadSuccess(true); // Logic to run after a successful upload
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="सामाजिक लिंक व्यवस्थापन" />

        <div className="mt-8">
          <SocialLinkUploader onUploadSuccess={handleUploadSuccess} />
          {uploadSuccess && (
            <p className="mt-4 text-green-500">
              Social link uploaded successfully!
            </p>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SocialLinkUploaderPage;
