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
  description: string;
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
    <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm border border-stroke dark:border-strokedark">
      <div className="p-4 border-b border-stroke dark:border-strokedark">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            नयाँ सामाजिक लिंकहरू
          </h3>
          <button
        onClick={() => router.push("/tables/socialLinks")}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            सबै हेर्नुहोस् →
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {latestLinks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              कुनै सामाजिक लिंक भेटिएन
            </p>
          </div>
        ) : (
          <div className="space-y-4">
          {latestLinks.map((socialLink) => (
              <div
                key={socialLink.id}
                className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
              <a
                href={socialLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1"
              >
                {socialLink.linkName}
              </a>
                        
                        {socialLink.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {socialLink.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          {socialLink.linkPublisher && (
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {socialLink.linkPublisher}
                            </span>
                          )}
                          {socialLink.linkDate && (
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {socialLink.linkDate}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-2">
                        <a
                          href={socialLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                        >
                          खोल्नुहोस्
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
  );
};

export default SocialLinkDisplayer;
