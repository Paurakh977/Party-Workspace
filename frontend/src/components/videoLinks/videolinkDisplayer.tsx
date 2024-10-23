"use client";
import SocialLinkUploader from "./videolinkUpload";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMinus, FaPlus } from "react-icons/fa";

interface SocialLink {
  id: number;
  linkName: string;
  link: string;
}

const SocialLinkDisplayer: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploaderVisible, setUploaderVisible] = useState<boolean>(false); // State for toggling uploader visibility

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_HOST}/social-links`,
      );
      setSocialLinks(response.data); // Assuming response contains an array of social links
    } catch (err) {
      setError("Error fetching social links.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleUploadSuccess = () => {
    fetchSocialLinks(); // Re-fetch the links after a successful upload
  };

  const toggleUploaderVisibility = () => {
    setUploaderVisible((prev) => !prev); // Toggle the visibility state
  };

  if (loading) {
    return <p>Loading social links...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <>
      <div>
        <ul className="list-disc pl-5">
          {socialLinks.map((socialLink) => (
            <li key={socialLink.id} className="text-lg">
              <a
                href={socialLink.link}
                className="text-blue-600 hover:underline"
                target="_blank" // Opens the link in a new tab
                rel="noopener noreferrer" // Improves security for new tab links
              >
                {socialLink.linkName}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={toggleUploaderVisibility} // Button to toggle the uploader
        className="mb-4 flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" // Added flex and items-center
      >
        {isUploaderVisible ? (
          <FaMinus className="mr-2" />
        ) : (
          <FaPlus className="mr-2" />
        )}
        {isUploaderVisible ? "Hide New Link" : "Add New Link"}{" "}
        {/* Button text changes based on visibility */}
      </button>

      {isUploaderVisible && ( // Conditionally render the SocialLinkUploader based on visibility
        <div className="mt-4">
          <SocialLinkUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      )}
    </>
  );
};

export default SocialLinkDisplayer;
