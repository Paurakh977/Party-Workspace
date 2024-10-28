// app/forms/updateVideolinkForm/[linkId]/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SocialLinkEditor from "@/components/videoLinks/videolinkEditor"; // Adjust import path as needed
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface PageProps {
  params: {
    linkId: string;
  };
}

const SocialLinkEditPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const linkId = Number(params.linkId); // Convert linkId from string to number

  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const handleUpdateSuccess = () => {
    setIsUpdated(true);
  };

  if (!linkId) {
    return <p>Loading...</p>;
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto p-5">
        <h1 className="mb-4 text-2xl font-bold">Edit Social Link</h1>
        <SocialLinkEditor
          linkId={linkId}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {isUpdated && (
          <p className="mt-4 text-green-500">Link updated successfully!</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default SocialLinkEditPage;
