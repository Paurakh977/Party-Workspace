"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  eventSpeaker: string;
  eventOrganizer: string;
  eventType: string;
  remarks: string;
}

const EventsTable = ({ singleEvent }: { singleEvent?: Event }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format address
  const formatAddress = (event: Event): string => {
    const { municipality, ward, district, province, address } = event;
    if (!address) return `${municipality} - ${ward}, ${district}`;
    return `${municipality} - ${ward}, ${district} जिल्ला, ${province} प्रदेश, ${address}`;
  };

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
    console.log("Updating member with ID:", eventId);
    router.push(`/forms/updateEventsForm/${eventId}`);
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // If singleEvent is provided, display only that event
  const eventsToDisplay = singleEvent ? [singleEvent] : events;

  return (
    <div className="overflow-x-auto">
      <div className="border-gray-700 dark:border-gray-700 min-w-[1500px] rounded-sm border bg-rose-100 p-6 px-5 pb-2.5 pt-6 shadow dark:bg-boxdark sm:rounded-lg sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          <span className="bg-lime-600">कार्यक्रम तालिका</span>
        </h4>
        <table className="min-w-full table-auto">
          <thead className="dark:bg-gray-700">
            <tr className="bg-slate-400">
              <th className="border-gray-700 w-2 border-2 px-4 py-2 font-bold text-black">
                क्रम संख्या
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                कार्यक्रमको शिर्षक
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                कार्यक्रमको विवरण
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                कार्यक्रमको मिति
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                कार्यक्रमको समय
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                कार्यक्रमको प्रकार
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                ठेगाना
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                स्थान
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                कार्यक्रम वक्ता तथा प्रशिक्षक
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                कार्यक्रमको आयोजक
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                कैफियत
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                सुधार
              </th>
            </tr>
          </thead>

          <tbody>
            {eventsToDisplay.map((event, index) => {
              return (
                <tr
                  key={event.eventId}
                  className={`${
                    index === eventsToDisplay.length - 1
                      ? ""
                      : "border-gray-700 border-b"
                  }`}
                >
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {index + 1}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventHeading}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventDetails}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventDate}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventTime}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventType}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {formatAddress(event)}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.venue || "-"}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventSpeaker}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventOrganizer}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.remarks}
                  </td>
                  <td className="border-gray-700 border-2 px-4 py-2 text-center">
                    <button
                      onClick={() => handleUpdateEvent(event.eventId)}
                      className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.eventId)}
                      className="mr-2 rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
