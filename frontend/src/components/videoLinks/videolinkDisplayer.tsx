"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import NepaliDate from "nepali-datetime"; // Import NepaliDate for date comparison
import { 
  FaFacebook, 
  FaYoutube, 
  FaInstagram, 
  FaWhatsapp, 
  FaTiktok, 
  FaLink,
  FaTwitter,
  FaLinkedin,
  FaTelegram 
} from "react-icons/fa";

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

// Function to detect social media platform from URL
const getSocialMediaIcon = (url: string) => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com') || lowerUrl.includes('fb.me')) {
    return { icon: FaFacebook, color: 'text-blue-600', bgColor: 'bg-blue-600/10' };
  }
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return { icon: FaYoutube, color: 'text-red-600', bgColor: 'bg-red-600/10' };
  }
  if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) {
    return { icon: FaInstagram, color: 'text-pink-600', bgColor: 'bg-pink-600/10' };
  }
  if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me')) {
    return { icon: FaWhatsapp, color: 'text-green-600', bgColor: 'bg-green-600/10' };
  }
  if (lowerUrl.includes('tiktok.com')) {
    return { icon: FaTiktok, color: 'text-gray-900 dark:text-white', bgColor: 'bg-gray-900/10 dark:bg-white/10' };
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return { icon: FaTwitter, color: 'text-sky-500', bgColor: 'bg-sky-500/10' };
  }
  if (lowerUrl.includes('linkedin.com')) {
    return { icon: FaLinkedin, color: 'text-blue-700', bgColor: 'bg-blue-700/10' };
  }
  if (lowerUrl.includes('telegram.org') || lowerUrl.includes('t.me')) {
    return { icon: FaTelegram, color: 'text-blue-500', bgColor: 'bg-blue-500/10' };
  }
  
  // Default icon for other links
  return { icon: FaLink, color: 'text-primary', bgColor: 'bg-primary/10' };
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
    .slice(0, 10); // Get the first 10 entries (most recent)
  
  const hasMoreLinks = socialLinks.length > 10;

  return (
    <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm border border-stroke dark:border-strokedark">
      <div className="p-4 border-b border-stroke dark:border-strokedark">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            नयाँ सामाजिक लिंकहरू
            {hasMoreLinks && (
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({socialLinks.length} कुल)
              </span>
            )}
          </h3>
          {hasMoreLinks && (
            <button
              onClick={() => router.push("/tables/socialLinks")}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center space-x-1"
            >
              <span>सबै हेर्नुहोस्</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
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
          <div className="space-y-3">
            {latestLinks.map((socialLink) => {
              const socialIcon = getSocialMediaIcon(socialLink.link);
              const IconComponent = socialIcon.icon;
              
              return (
                <div
                  key={socialLink.id}
                  className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 ${socialIcon.bgColor} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${socialIcon.color}`} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="space-y-2">
                        <a
                          href={socialLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-medium text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1 block"
                        >
                          {socialLink.linkName}
                        </a>
                        
                        {socialLink.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {socialLink.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-500 dark:text-gray-400">
                            {socialLink.linkPublisher && (
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="truncate">{socialLink.linkPublisher}</span>
                              </span>
                            )}
                            {socialLink.linkDate && (
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {socialLink.linkDate}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-shrink-0">
                            <a
                              href={socialLink.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors whitespace-nowrap"
                            >
                              <span className="hidden xs:inline">खोल्नुहोस्</span>
                              <span className="xs:hidden">खोल्नुहोस्</span>
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLinkDisplayer;