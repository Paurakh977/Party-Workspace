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

        console.log("FutureEvent - Current time:", now.toString(), "Timestamp:", now.getTime());

        // Filter for upcoming events (event date and time is greater than 'now')
        eventsResponse.data.forEach((event) => {
          try {
            const fullDateTimeString = `${event.eventDate} ${event.eventTime}`; // Combine date and time
            const eventDateTime = new NepaliDate(fullDateTimeString); // Create NepaliDate object

            // Compare timestamps - if event is in the future
            console.log(`FutureEvent - Event: ${event.eventHeading}`, {
              eventDate: event.eventDate,
              eventTime: event.eventTime,
              fullDateTimeString,
              eventTimestamp: eventDateTime.getTime(),
              nowTimestamp: now.getTime(),
              isFuture: eventDateTime.getTime() > now.getTime()
            });
            
            if (eventDateTime.getTime() > now.getTime()) {
              upcoming.push(event);
            }
          } catch (error) {
            console.error("Error parsing date for event:", event, error);
            // If date parsing fails, compare just dates as fallback
            try {
              const eventDate = new NepaliDate(event.eventDate);
              if (eventDate.getTime() >= now.getTime()) {
                upcoming.push(event);
              }
            } catch (fallbackError) {
              console.error("Fallback date parsing also failed:", fallbackError);
            }
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
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white">आगामी कार्यक्रमहरू</h4>
              <p className="text-white/80 text-sm">{eventsToDisplay.length} वटा कार्यक्रम</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/events/list")}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
          >
            सबै हेर्नुहोस्
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="p-6">
        {eventsToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-meta-4 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">कुनै आगामी कार्यक्रम छैन</h3>
            <p className="text-gray-500 dark:text-gray-400">अहिले कुनै आगामी कार्यक्रम निर्धारण गरिएको छैन।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventsToDisplay.map((event, index) => (
              <div key={event.eventId} className="group">
                {/* Event Card */}
                <div className="bg-gray-50 dark:bg-meta-4 rounded-xl border border-stroke dark:border-strokedark hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Image
                              src="/images/ncIcon.png"
                              alt="event image"
                              width={40}
                              height={40}
                              className="rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-black dark:text-white mb-1 truncate">
                            {event.eventHeading}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {event.eventDate}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              {event.eventTime}
                            </span>
                            {event.address && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {event.address}
                              </span>
                            )}
                          </div>
                          {event.eventOrganizer && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                आयोजक: {event.eventOrganizer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    {event.eventDetails && (
                      <div className="mb-4 p-3 bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark">
                        <p className="text-sm text-black dark:text-white leading-relaxed">
                          {event.eventDetails}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewEvent(event.eventId)}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                        title="विवरण हेर्नुहोस्"
                      >
                        <FaEye className="mr-1.5" />
                        विवरण
                      </button>
                      <button
                        onClick={() => handleUpdateEvent(event.eventId)}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                        title="सम्पादन गर्नुहोस्"
                      >
                        <FaEdit className="mr-1.5" />
                        सम्पादन
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.eventId)}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg"
                        title="मेटाउनुहोस्"
                        style={{backgroundColor: '#dc2626', color: 'white'}}
                      >
                        <FaTrash className="mr-1.5" />
                        मेटाउनुहोस्
                      </button>
                      <button
                        onClick={() => togglePdfVisibility(event.eventId)}
                        className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          pdfVisible[event.eventId]
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30'
                        }`}
                        title="PDF दस्तावेजहरू"
                      >
                        <FaFilePdf className="mr-1.5" />
                        दस्तावेजहरू
                      </button>
                    </div>
                  </div>
                </div>

                {/* PDF Section */}
                {pdfVisible[event.eventId] && (
                  <div className="mt-4 bg-gray-50 dark:bg-meta-4/50 rounded-xl p-4">
                    <PdfDisplayer eventId={event.eventId} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureEvents;
