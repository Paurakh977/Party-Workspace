"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaEye, FaFilePdf } from "react-icons/fa"; // Include FaFilePdf for PDF button
import NepaliDate from "nepali-datetime";
import Image from "next/image";
import PdfDisplayer from "../PDFUploader/pdfDisplayer"; // Import PdfDisplayer

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

const FutureEvents = ({ singleEvent }: { singleEvent?: Event }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfVisible, setPdfVisible] = useState<{ [key: number]: boolean }>({});
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
        const upcoming: Event[] = [];

        // Filter for upcoming events (event date and time is greater than 'now')
        eventsResponse.data.forEach((event) => {
          const fullDateTimeString = `${event.eventDate} ${event.eventTime}`; // Combine date and time
          const eventDateTime = new NepaliDate(fullDateTimeString); // Create NepaliDate object

          if (eventDateTime.getTime() > now.getTime()) {
            // Use getTime() to compare full date-time values
            upcoming.push(event);
          }
        });

        // Sort upcoming events in ascending order by date and time
        const sortedUpcoming = upcoming.sort((a, b) => {
          const dateTimeA = new NepaliDate(
            `${a.eventDate} ${a.eventTime}`,
          ).getTime();
          const dateTimeB = new NepaliDate(
            `${b.eventDate} ${b.eventTime}`,
          ).getTime();
          return dateTimeA - dateTimeB;
        });

        // Limit to 5 nearest upcoming events
        setEvents(sortedUpcoming.slice(0, 5));
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
    router.push(`/forms/updateEventsForm/${eventId}`);
  };

  const handleViewEvent = (eventId: number) => {
    router.push(`/events/detail/${eventId}`);
  };

  const togglePdfVisibility = (eventId: number) => {
    setPdfVisible((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const eventsToDisplay = singleEvent ? [singleEvent] : events;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        हुने कार्यक्रम
      </h4>
      <span
        onClick={() => router.push("/events/list")}
        style={{ cursor: "pointer" }} // Change the mouse pointer to a clicker
      >
        सबै कार्यक्रमहरू हेर्नुहोस्
      </span>

      <div className="flex flex-col px-4">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 px-4 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5"></div>
          <div className="p-2.5 text-center xl:p-5">कार्यक्रमको शिर्षक</div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            कार्यक्रमको मिति
          </div>
          <div className="p-2.5 text-center xl:p-5">सुधार</div>
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
              <Image
                src="/images/ncIcon.png"
                alt="event image"
                width={100}
                height={100}
              />
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              {event.eventHeading}
            </div>
            <div className="hidden justify-center p-2.5 text-center sm:flex xl:p-5">
              {event.eventDate}
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
                className="rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
              >
                <FaTrash />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 xl:p-5">
              <button
                onClick={() => togglePdfVisibility(event.eventId)}
                className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
              >
                <FaFilePdf />
              </button>
            </div>
            {pdfVisible[event.eventId] && (
              <div className="col-span-3 sm:col-span-4">
                <PdfDisplayer eventId={event.eventId} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutureEvents;
