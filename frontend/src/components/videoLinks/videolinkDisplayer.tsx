"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import NepaliDate from "nepali-datetime"; // Import NepaliDate for date comparison

interface SocialLink {
  id: number;
  linkName: string;
  link: string;
  linkDate: string;
  linkPublisher: string;
  country: string;
  province: string;
  district: string;
  ward: string;
}

// Utility function to compare social link dates
const compareDates = (linkA: SocialLink, linkB: SocialLink) => {
  const dateA = new NepaliDate(linkA.linkDate).getTime();
  const dateB = new NepaliDate(linkB.linkDate).getTime();
  return dateB - dateA; // Descending order
};

const SocialLinkDisplayer: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  if (loading) {
    return <p>Loading social links...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // Sort links by linkDate in descending order
  const latestLinks = socialLinks
    .filter((link) => !isNaN(new NepaliDate(link.linkDate).getTime())) // Ensure valid date
    .sort(compareDates)
    .slice(-10); // Get the last 10 entries

  return (
    <>
      <span
        onClick={() => router.push("/tables/socialLinks")}
        style={{ cursor: "pointer" }} // Change the mouse pointer to a clicker
      >
        सबै कार्यक्रमहरू हेर्नुहोस्
      </span>
      <div>
        <ul className="list-disc pl-5">
          {latestLinks.map((socialLink) => (
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
    </>
  );
};

export default SocialLinkDisplayer;
