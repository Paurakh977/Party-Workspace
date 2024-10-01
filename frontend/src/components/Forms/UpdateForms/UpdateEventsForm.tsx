import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import AddressInput from "@/components/Address/address";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { useRouter } from "next/navigation";

interface UpdateEventsFormProps {
  eventId: number;
}

interface Event {
  eventId: number;
  eventHeading: string;
  eventDetails: string;
  eventDate: string;
  eventTime: string;
  address: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  venue?: string;
  eventOrganizer: string;
  remarks: string;
}

const UpdateEventsForm: React.FC<UpdateEventsFormProps> = ({ eventId }) => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);

  // State for form fields
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

  // Handle date change from the Nepali Date Picker
  const handleDateChange = (value: string) => {
    setEventDate(value);
  };

  // Handle address changes from AddressInput component
  const handleAddressChange = (newAddress: {
    address: string;
    province?: string;
    district?: string;
    municipality?: string;
    ward?: string;
  }) => {
    setAddress(newAddress.address);
    setProvince(newAddress.province || "");
    setDistrict(newAddress.district || "");
    setMunicipality(newAddress.municipality || "");
    setWard(newAddress.ward || "");
  };

  // Fetch the event data when the component mounts or when the eventId changes
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get<Event>(
            process.env.NEXT_PUBLIC_BE_HOST + `/events/${eventId}`,
          );
          const eventData = response.data;
          setEvent(eventData);

          // Set all the state variables with fetched data
          setEventHeading(eventData.eventHeading || "");
          setEventDetails(eventData.eventDetails || "");
          setEventDate(eventData.eventDate || "");
          setEventTime(eventData.eventTime || "");
          setAddress(eventData.address || "");
          setProvince(eventData.province || "");
          setDistrict(eventData.district || "");
          setMunicipality(eventData.municipality || "");
          setWard(eventData.ward || "");
          setVenue(eventData.venue || "");
          setEventOrganizer(eventData.eventOrganizer || "");
          setRemarks(eventData.remarks || "");
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      eventHeading,
      eventDetails,
      eventDate,
      eventTime,
      address: address || "अन्य",
      province: province || null,
      district: district || null,
      municipality: municipality || null,
      ward: ward || null,
      venue: venue || null,
      eventOrganizer: eventOrganizer || null,
      remarks: remarks || null,
    };

    try {
      await axios.put(process.env.NEXT_PUBLIC_BE_HOST + `/events/${eventId}`, payload);
      console.log("Form submitted successfully");
      router.push("/events/list");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full rounded border  bg-rose-100 shadow  dark:bg-boxdark ">
      <div className="rounded border-b bg-rose-200 px-7 py-4  shadow">
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
              onChange={(e) => setEventHeading(e.target.value)}
              required
              className="bg-gray-50 w-full rounded border px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none  dark:bg-meta-4 dark:text-white"
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
              onChange={(e) => setEventDetails(e.target.value)}
              required
              className="bg-gray-50 w-full rounded border  px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:bg-meta-4 dark:text-white"
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
              inputClassName="bg-gray-50 w-full rounded border shadow px-4.5 py-3 text-black focus:border-primary focus:outline-none  dark:bg-meta-4 dark:text-white"
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
              className="bg-gray-50 w-full rounded border px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
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
            {event && (
              <AddressInput
                initialAddress={event.address}
                initialProvince={event.province}
                initialDistrict={event.district}
                initialMunicipality={event.municipality}
                initialWard={event.ward}
                onAddressChange={handleAddressChange}
              />
            )}
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
              className="bg-gray-50 w-full rounded border  px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Event Organizer Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventOrganizer"
            >
              कार्यक्रमको आयोजक संस्था:
            </label>
            <input
              type="text"
              id="eventOrganizer"
              value={eventOrganizer}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEventOrganizer(e.target.value)
              }
              className="bg-gray-50 w-full rounded border px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none  dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Remarks Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="remarks"
            >
              कैफियत:
            </label>
            <input
              type="text"
              id="remarks"
              value={remarks}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRemarks(e.target.value)
              }
              className="bg-gray-50 w-full rounded border px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none  dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4.5">
            <button
              type="submit"
              className="inline-flex items-center rounded border bg-primary px-5 py-2 text-base font-medium text-white transition hover:bg-opacity-90"
            >
              अपडेट गर्नुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventsForm;
