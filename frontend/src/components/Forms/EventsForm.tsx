import React, { useState, useEffect, ChangeEvent, FormEvent, use } from "react";
import axios from "axios";
import AddressInput from "../Address/address";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { useRouter } from "next/navigation";

const EventsForm: React.FC = () => {
  const router = useRouter();
  // New state variables for the additional fields
  const [eventHeading, setEventHeading] = useState<string>("");
  const [eventDetails, setEventDetails] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [ward, setWard] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [eventOrganizer, setEventOrganizer] = useState<string>("");

  const [remarks, setRemarks] = useState<string>("");

  const [showMessageForm, setShowMessageForm] = useState<boolean>(false);
  const handleDateChange = (value: string) => {
    setEventDate(value);
  };

  // Handle address changes from AddressInput component
  const handleAddressChange = (newAddress: {
    country: string;
    province?: string;
    district?: string;
    municipality?: string;
    ward?: string;
  }) => {
    setAddress(newAddress.country);
    setProvince(newAddress.province || "");
    setDistrict(newAddress.district || "");
    setMunicipality(newAddress.municipality || "");
    setWard(newAddress.ward || "");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      eventHeading,
      eventDetails,
      eventDate,
      eventTime,
      address: address || "अन्य", // Default to 'अन्य' if not provided
      province: province || null,
      district: district || null,
      municipality: municipality || null,
      ward: ward || null,
      venue: venue || null,
      eventOrganizer: eventOrganizer || null,
      remarks: remarks || null,
    };

    try {
      await axios.post(process.env.NEXT_PUBLIC_BE_HOST + "/events", payload);
      console.log("Form submitted successfully");

      const shouldSendSMS = window.confirm(
        "तपाईंँको कार्यक्रम विवरण सुरक्षित गरिएको छ। के तपाईंँ एस एम एस पठाउन चहानुहुन्छ?",
      );
      console.log(shouldSendSMS);
      if (shouldSendSMS) {
        console.log("Event Details:", payload.eventDetails);
        console.log("Event Organizer:", payload.eventOrganizer);
        router.push(
          `/messages/input?eventHeading=${eventHeading}&eventDetails=${eventDetails}&eventOrganizer=${eventOrganizer}`,
        );
      } else {
        router.push("/events/list");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full rounded border  bg-rose-100 shadow dark:bg-boxdark">
      <div className="rounded border-b bg-rose-200 px-7 py-4">
        <h3 className="font-medium text-black dark:text-white">
          कार्यक्रम विवरण प्रविष्टि फारम
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {/* Event Name Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventHeading"
            >
              कार्यक्रमको शिर्षक:
            </label>
            <input
              type="text"
              id="eventHeading"
              value={eventHeading}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEventHeading(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border px-4.5 py-3 text-black shadow focus:border-primary  focus:outline-none dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Event Details Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventDetails"
            >
              कार्यक्रमको विवरण:
            </label>
            <input
              type="text"
              id="eventDetails"
              value={eventDetails}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEventDetails(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border px-4.5 py-3 text-black shadow focus:border-primary  focus:outline-none dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Event Date Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventDate"
            >
              कार्यक्रमको मिति:
            </label>
            <NepaliDatePicker
              inputClassName="bg-gray-50 w-full rounded border  px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:bg-meta-4 dark:text-white shadow"
              value={eventDate}
              onChange={handleDateChange}
              options={{ calenderLocale: "ne", valueLocale: "en" }}
            />
          </div>

          {/* Event Time Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventTime"
            >
              कार्यक्रमको समय:
            </label>
            <input
              type="time"
              id="eventTime"
              name="eventTime"
              className="bg-gray-50 w-full rounded border  px-4.5 py-3 text-black shadow focus:border-primary  focus:outline-none dark:bg-meta-4 dark:text-white"
              value={eventTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEventTime(e.target.value)
              }
            />
          </div>

          {/* Address Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="address"
            >
              ठेगाना:
            </label>
            <AddressInput onAddressChange={handleAddressChange} />
          </div>

          {/* Venue Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="venue"
            >
              कार्यक्रम स्थल:
            </label>
            <input
              type="text"
              id="venue"
              value={venue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setVenue(e.target.value)
              }
              className="bg-gray-50 w-full rounded border  px-4.5 py-3 text-black shadow focus:border-primary  focus:outline-none dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Remarks Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventOrganizer"
            >
              कार्यक्रम आयोजक:
            </label>
            <textarea
              id="eventOrganizer"
              value={eventOrganizer}
              onChange={(e) => setEventOrganizer(e.target.value)}
              className="bg-gray-50 w-full rounded border  px-4.5 py-3 text-black shadow focus:border-primary  focus:outline-none dark:bg-meta-4 dark:text-white"
              placeholder="कार्यक्रमको आयोजकउल्लेख गर्नुहोस्"
            />
          </div>

          {/* Remarks Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="representative"
            >
              कैफियत:
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="bg-gray-50 w-full rounded border  px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:bg-meta-4 dark:text-white"
              placeholder="कैफियत उल्लेख गर्नुहोस्"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="inline-flex items-center rounded border bg-primary px-5 py-2 text-base font-medium text-white transition hover:bg-opacity-90"
          >
            सुरक्षित गर्नुहोस्
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventsForm;
