"use client";
import React, { useCallback, useState } from "react";
import axios from "axios";

interface Props {
  eventId: number | string;
  onUploaded?: () => void;
}

const EventImageUploader: React.FC<Props> = ({ eventId, onUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      setError(null);
      setIsUploading(true);
      try {
        const form = new FormData();
        Array.from(e.target.files).forEach((file) => form.append("files", file));
        form.append("eventId", String(eventId));

        await axios.post(
          `${process.env.NEXT_PUBLIC_BE_HOST}/event-images/uploads`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        if (onUploaded) onUploaded();
        e.target.value = "";
      } catch (err: any) {
        setError(err?.response?.data?.message || "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [eventId, onUploaded],
  );

  return (
    <div className="border border-dashed rounded-lg p-4 bg-white dark:bg-boxdark">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
          className="text-sm"
        />
        {isUploading && (
          <span className="text-xs text-gray-500">Uploading...</span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      <p className="text-xs text-gray-500 mt-2">Upload an image linked to this event.</p>
    </div>
  );
};

export default EventImageUploader;


