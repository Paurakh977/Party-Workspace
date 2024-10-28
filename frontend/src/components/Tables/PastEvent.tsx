"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaEye, FaFilePdf } from "react-icons/fa"; // Import the document icon
import NepaliDate from "nepali-datetime";
import Image from "next/image";
import PdfDisplayer from "../PDFUploader/pdfDisplayer"; // Import the PdfDisplayer component

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

const PastEvents = ({ singleEvent }: { singleEvent?: Event }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfVisible, setPdfVisible] = useState<{ [key: number]: boolean }>({}); // State to track visibility of PdfDisplayer
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch events data
        const eventsResponse = await axios.get<Event[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/events",
        );

        const now = new NepaliDate();
        const pastEvents: Event[] = [];

        // Filter for past events (event date and time is less than or equal to 'now')
        eventsResponse.data.forEach((event) => {
          const fullDateTimeString = `${event.eventDate} ${event.eventTime}`; // Combine date and time
          const eventDateTime = new NepaliDate(fullDateTimeString); // Create NepaliDate object

          if (eventDateTime.getTime() <= now.getTime()) {
            // Use getTime() to compare full date-time values
            pastEvents.push(event);
          }
        });

        // Sort past events by date and time in descending order, so the most recent is at the top
        const sortedEvents = pastEvents.sort((a, b) => {
          const dateTimeA = new NepaliDate(
            `${a.eventDate} ${a.eventTime}`,
          ).getTime();
          const dateTimeB = new NepaliDate(
            `${b.eventDate} ${b.eventTime}`,
          ).getTime();
          return dateTimeB - dateTimeA; // Sort in descending order
        });

        // Limit to the 5 most recent past events
        setEvents(sortedEvents.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await axios.delete(
        process.env.NEXT_PUBLIC_BE_HOST + `/events/${eventId}`,
      );
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.eventId !== eventId),
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateEvent = (eventId: number) => {
    console.log("Updating event with ID:", eventId);
    router.push(`/forms/updateEventsForm/${eventId}`);
  };

  const handleViewEvent = (eventId: number) => {
    console.log("Viewing event with ID:", eventId);
    router.push(`/events/detail/${eventId}`);
  };

  const togglePdfVisibility = (eventId: number) => {
    setPdfVisible((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // If singleEvent is provided, display only that event
  const eventsToDisplay = singleEvent ? [singleEvent] : events;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        भएका कार्यक्रम
      </h4>
      <span
        onClick={() => router.push("/events/list")}
        style={{ cursor: "pointer" }} // Change the mouse pointer to a clicker
      >
        सबै कार्यक्रमहरू हेर्नुहोस्
      </span>

      <div className="flex flex-col px-4">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 px-4 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base"></h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              कार्यक्रमको शिर्षक
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              कार्यक्रमको मिति
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              सुधार
            </h5>
          </div>
        </div>

        {eventsToDisplay.map((event, index) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${
              index === eventsToDisplay.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={event.eventId}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                <Image
                  src="/images/ncIcon.png"
                  alt="event image"
                  width={100}
                  height={100}
                />
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{event.eventHeading}</p>
            </div>
            <div className="hidden justify-center p-2.5 text-center sm:flex xl:p-5">
              <p className="text-black dark:text-white">{event.eventDate}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 xl:p-5">
              <button
                onClick={() => handleViewEvent(event.eventId)}
                className="mb-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                <FaEye />
              </button>
              <button
                onClick={() => handleUpdateEvent(event.eventId)}
                className="mb-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteEvent(event.eventId)}
                className="mb-2 rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
              >
                <FaTrash />
              </button>

              {/* New button to toggle PdfDisplayer */}
              <button
                onClick={() => togglePdfVisibility(event.eventId)}
                className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
              >
                <FaFilePdf />
              </button>
            </div>

            {/* Include PdfDisplayer for each event */}
            {pdfVisible[event.eventId] && ( // Conditional rendering of PdfDisplayer
              <div className="col-span-3 mt-4 sm:col-span-4">
                <PdfDisplayer eventId={event.eventId} />{" "}
                {/* Pass the eventId here */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastEvents;
