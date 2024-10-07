import React, { useEffect, useState } from "react";
import axios from "axios";
import AddressInput from "@/components/Address/address"; // Assuming this component can display addresses without editing
import { useRouter } from "next/navigation";

interface ViewEventPageProps {
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

const ViewEventPage: React.FC<ViewEventPageProps> = ({ eventId }) => {
  const [event, setEvent] = useState<Event | null>(null);

  // Fetch the event data when the component mounts or when the eventId changes
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get<Event>(
            `${process.env.NEXT_PUBLIC_BE_HOST}/events/${eventId}`,
          );
          setEvent(response.data);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>; // Display loading message while fetching data
  }

  return (
    <div className="w-full rounded border bg-rose-100 shadow dark:bg-boxdark">
      <div className="rounded border-b bg-rose-200 px-7 py-4 shadow">
        <h3 className="font-medium text-black dark:text-white">
          कार्यक्रम विवरण
        </h3>
      </div>
      <div className="p-7">
        <div className="mb-5.5">
          <label className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white">
            कार्यक्रमको शिर्षक:
          </label>
          <p className="bg-gray-50 rounded border p-3 text-black dark:bg-meta-4 dark:text-white">
            {event.eventHeading}
          </p>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white">
            कार्यक्रमको विवरण:
          </label>
          <p className="bg-gray-50 rounded border p-3 text-black dark:bg-meta-4 dark:text-white">
            {event.eventDetails}
          </p>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white">
            कार्यक्रमको मिति:
          </label>
          <p className="bg-gray-50 rounded border p-3 text-black dark:bg-meta-4 dark:text-white">
            {event.eventDate}
          </p>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white">
            कार्यक्रमको समय:
          </label>
          <p className="bg-gray-50 rounded border p-3 text-black dark:bg-meta-4 dark:text-white">
            {event.eventTime}
          </p>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white">
            ठेगाना:
          </label>
          {event.address && (
            <p>
              <strong>देश:</strong> {event.address}
            </p>
          )}
          {event.province && (
            <p>
              <strong>प्रदेश:</strong> {event.province}
            </p>
          )}
          {event.district && (
            <p>
              <strong>जिल्ला:</strong> {event.district}
            </p>
          )}
          {event.municipality && (
            <p>
              <strong>पालिका:</strong> {event.municipality}
            </p>
          )}
          {event.ward && (
            <p>
              <strong>वडा:</strong> {event.ward}
            </p>
          )}
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white">
            कार्यक्रम स्थल:
          </label>
          <p className="bg-gray-50 rounded border p-3 text-black dark:bg-meta-4 dark:text-white">
            {event.venue}
          </p>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white">
            कार्यक्रमको आयोजक संस्था:
          </label>
          <p className="bg-gray-50 rounded border p-3 text-black dark:bg-meta-4 dark:text-white">
            {event.eventOrganizer}
          </p>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white">
            कैफियत:
          </label>
          <p className="bg-gray-50 rounded border p-3 text-black dark:bg-meta-4 dark:text-white">
            {event.remarks}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewEventPage;
