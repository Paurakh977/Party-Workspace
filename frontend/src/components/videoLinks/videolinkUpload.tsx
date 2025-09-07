"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddressInput from "../Address/address";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { validateUrl, generateLinkPreview, formatLinkName, LinkPreview } from "../../utils/linkUtils";

interface SocialLinkUploaderProps {
  onUploadSuccess: () => void; // Function to call when upload is successful
}

const SocialLinkUploader: React.FC<SocialLinkUploaderProps> = ({
  onUploadSuccess,
}) => {
  const [linkName, setLinkName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [linkDate, setLinkDate] = useState<string>("");
  const [linkPublisher, setLinkPublisher] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Auto-generate link preview when URL changes
  useEffect(() => {
    const generatePreview = async () => {
      if (link && validateUrl(link)) {
        setIsValidating(true);
        try {
          const preview = await generateLinkPreview(link);
          setLinkPreview(preview);
          
          // Auto-fill link name if empty
          if (!linkName && preview.isValid) {
            setLinkName(formatLinkName(link));
          }
        } catch (error) {
          console.error('Error generating preview:', error);
          setLinkPreview(null);
        } finally {
          setIsValidating(false);
        }
      } else {
        setLinkPreview(null);
      }
    };

    const timeoutId = setTimeout(generatePreview, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [link, linkName]);

  const handleUpload = async () => {
    if (!linkName || !link) {
      setError("कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।");
      return;
    }

    if (!validateUrl(link)) {
      setError("कृपया मान्य URL प्रविष्टि गर्नुहोस्।");
      return;
    }

    const data = {
      linkName,
      link,
      linkDate: linkDate || null,
      linkPublisher: linkPublisher || null,
      description: description || null,
      country: country || null,
      province: province || null,
      district: district || null,
      municipality: municipality || null,
      ward: ward || null,
    };

    setUploading(true);
    setSuccessMessage(null);
    setError(null);

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BE_HOST + "/social-links",
        data, // Sending JSON data
      );
      setSuccessMessage("सामाजिक लिंक सफलतापूर्वक अपलोड गरिएको छ!");
      setLinkName("");
      setLink("");
      setLinkDate("");
      setLinkPublisher("");
      setDescription("");
      setCountry("");
      setProvince("");
      setDistrict("");
      setMunicipality("");
      setWard("");
      setLinkPreview(null);
      onUploadSuccess(); // Trigger any post-upload action
    } catch (err) {
      setError("Error uploading social link.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDateChange = (value: string) => {
    setLinkDate(value);
  };

  const handleAddressChange = (newAddress: {
    country: string;
    province?: string;
    district?: string;
    municipality?: string;
    ward?: string;
  }) => {
    setCountry(newAddress.country);
    setProvince(newAddress.province || "");
    setDistrict(newAddress.district || "");
    setMunicipality(newAddress.municipality || "");
    setWard(newAddress.ward || "");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-boxdark rounded-lg shadow-lg border border-stroke dark:border-strokedark">
      <div className="px-6 py-4 border-b border-stroke dark:border-strokedark">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          सामाजिक लिंक अपलोड गर्नुहोस्
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {/* Link URL Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="link"
          >
            लिंक URL *
          </label>
          <div className="relative">
            <input
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                link && !validateUrl(link) 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white`}
              type="url"
              id="link"
              placeholder="https://example.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
            {isValidating && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          {link && !validateUrl(link) && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              कृपया मान्य URL प्रविष्टि गर्नुहोस्
            </p>
          )}
        </div>

        {/* Link Preview */}
        {linkPreview && linkPreview.isValid && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              लिंक पूर्वावलोकन
            </h4>
            <div className="flex space-x-3">
              {linkPreview.thumbnail && (
                <img
                  src={linkPreview.thumbnail}
                  alt="Preview"
                  className="w-20 h-14 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {linkPreview.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {linkPreview.domain}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Link Name Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="linkName"
          >
            लिंकको नाम *
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            type="text"
            id="linkName"
            placeholder="लिंकको नाम यहाँ लेख्नुहोस्"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="description"
          >
            विवरण
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
            id="description"
            rows={3}
            placeholder="लिंकको छोटो विवरण लेख्नुहोस्"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Link Date Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="linkDate"
          >
            लिंकको मिति
          </label>
          <NepaliDatePicker
            inputClassName="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            value={linkDate}
            onChange={handleDateChange}
            options={{ calenderLocale: "ne", valueLocale: "en" }}
          />
        </div>

        {/* Publisher Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="linkPublisher"
          >
            प्रकाशकको नाम
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            type="text"
            id="linkPublisher"
            placeholder="प्रकाशकको नाम लेख्नुहोस्"
            value={linkPublisher}
            onChange={(e) => setLinkPublisher(e.target.value)}
          />
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ठेगाना
          </label>
          <AddressInput onAddressChange={handleAddressChange} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleUpload}
            disabled={uploading || !linkName || !link || !validateUrl(link)}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
              uploading || !linkName || !link || !validateUrl(link)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
            }`}
          >
            {uploading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                अपलोड हुँदैछ...
              </span>
            ) : (
              'अपलोड गर्नुहोस्'
            )}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLinkUploader;
