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

        console.log("PastEvent - Current time:", now.toString(), "Timestamp:", now.getTime());

        // Filter for past events (event date and time is less than or equal to 'now')
        eventsResponse.data.forEach((event) => {
          try {
            const fullDateTimeString = `${event.eventDate} ${event.eventTime}`; // Combine date and time
            const eventDateTime = new NepaliDate(fullDateTimeString); // Create NepaliDate object

            // Compare timestamps - if event is in the past
            console.log(`PastEvent - Event: ${event.eventHeading}`, {
              eventDate: event.eventDate,
              eventTime: event.eventTime,
              fullDateTimeString,
              eventTimestamp: eventDateTime.getTime(),
              nowTimestamp: now.getTime(),
              isPast: eventDateTime.getTime() <= now.getTime()
            });
            
            if (eventDateTime.getTime() <= now.getTime()) {
              pastEvents.push(event);
            }
          } catch (error) {
            console.error("Error parsing date for event:", event, error);
            // If date parsing fails, compare just dates as fallback
            try {
              const eventDate = new NepaliDate(event.eventDate);
              if (eventDate.getTime() < now.getTime()) {
                pastEvents.push(event);
              }
            } catch (fallbackError) {
              console.error("Fallback date parsing also failed:", fallbackError);
            }
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
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4" style={{backgroundColor: '#3b82f6'}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white" style={{color: 'white'}}>सम्पन्न कार्यक्रमहरू</h4>
              <p className="text-white/80 text-sm" style={{color: 'white'}}>{eventsToDisplay.length} वटा कार्यक्रम</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/events/list")}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
            style={{color: 'white', backgroundColor: 'rgba(255,255,255,0.2)'}}
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
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">कुनै सम्पन्न कार्यक्रम छैन</h3>
            <p className="text-gray-500 dark:text-gray-400">अहिलेसम्म कुनै कार्यक्रम सम्पन्न भएको छैन।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventsToDisplay.map((event, index) => (
              <div key={event.eventId} className="group">
                {/* Event Card */}
                <div className="bg-gray-50 dark:bg-meta-4 rounded-xl border border-stroke dark:border-strokedark hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center relative">
                            <Image
                              src="/images/ncIcon.png"
                              alt="event image"
                              width={40}
                              height={40}
                              className="rounded-lg grayscale opacity-70"
                            />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-black dark:text-white truncate">
                              {event.eventHeading}
                            </h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              सम्पन्न
                            </span>
                          </div>
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

                    {/* Event Summary (if available) */}
                    {event.remarks && (
                      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">टिप्पणी</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{event.remarks}</p>
                          </div>
                        </div>
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

export default PastEvents;
