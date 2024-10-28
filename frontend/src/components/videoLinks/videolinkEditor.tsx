"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddressInput from "../Address/address"; // Ensure this import is correct
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

interface SocialLinkEditorProps {
  linkId: number; // ID of the social link to be edited
  onUpdateSuccess: () => void; // Function to call when update is successful
}

const SocialLinkEditor: React.FC<SocialLinkEditorProps> = ({
  linkId,
  onUpdateSuccess,
}) => {
  const [linkName, setLinkName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [linkDate, setLinkDate] = useState<string>("");
  const [linkPublisher, setLinkPublisher] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch current data for the social link on component load
  useEffect(() => {
    const fetchSocialLink = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_HOST}/social-links/${linkId}`,
        );
        const data = response.data;

        // Prefill the form fields with fetched data
        setLinkName(data.linkName);
        setLink(data.link);
        setLinkDate(data.linkDate || "");
        setLinkPublisher(data.linkPublisher || "");
        setCountry(data.country || "");
        setProvince(data.province || "");
        setDistrict(data.district || "");
        setMunicipality(data.municipality || "");
        setWard(data.ward || "");
      } catch (err) {
        console.error("Error fetching social link data:", err);
        setError("Could not load data for editing.");
      }
    };
    fetchSocialLink();
  }, [linkId]);

  const handleUpdate = async () => {
    if (!linkName || !link) {
      setError("Please fill out both fields.");
      return;
    }

    const data = {
      linkName,
      link,
      linkDate,
      linkPublisher,
      country,
      province,
      district,
      municipality,
      ward,
    };

    setUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BE_HOST}/social-links/${linkId}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      setSuccessMessage("Social link updated successfully!");
      onUpdateSuccess(); // Trigger any post-update action
    } catch (err) {
      console.error("Error updating social link:", err);
      setError("Error updating social link.");
    } finally {
      setUpdating(false);
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
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          सामाजिक लिंक सम्पादन गर्नुहोस्:
        </h3>
      </div>
      <div className="p-7">
        <div className="mb-5.5">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="linkName"
          >
            लिंकको नाम
          </label>
          <input
            className="w-full rounded border px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white"
            type="text"
            id="linkName"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            required
          />
        </div>

        <div className="mb-5.5">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="link"
          >
            लिंक URL
          </label>
          <input
            className="w-full rounded border px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white"
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>

        <div className="mb-5.5">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="linkDate"
          >
            लिंकको मिति:
          </label>
          <NepaliDatePicker
            inputClassName="w-full rounded border px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white"
            value={linkDate}
            onChange={handleDateChange}
            options={{ calenderLocale: "ne", valueLocale: "en" }}
          />
        </div>

        <div className="mb-5.5">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="linkPublisher"
          >
            लिंक प्रकाशकको नाम
          </label>
          <input
            className="w-full rounded border px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white"
            type="text"
            id="linkPublisher"
            value={linkPublisher}
            onChange={(e) => setLinkPublisher(e.target.value)}
          />
        </div>

        <div className="mb-5.5">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="address"
          >
            ठेगाना:
          </label>
          <AddressInput
            onAddressChange={handleAddressChange}
            initialCountry={country}
            initialProvince={province}
            initialDistrict={district}
            initialMunicipality={municipality}
            initialWard={ward}
          />
        </div>

        <div className="flex justify-end gap-4.5">
          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`flex justify-center rounded bg-primary px-6 py-2 font-medium text-white ${updating ? "bg-gray-400" : ""}`}
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        {successMessage && (
          <p className="mt-4 text-sm text-green-500">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SocialLinkEditor;
