"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import ResponsiveTable, { TableColumn, PaginationData } from "./ResponsiveTable";

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
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

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

  // Define table columns
  const columns: TableColumn<Event>[] = [
    {
      key: 'eventHeading',
      label: 'कार्यक्रमको शिर्षक',
      searchable: true,
      className: 'font-medium',
    },
    {
      key: 'eventDetails',
      label: 'कार्यक्रमको विवरण',
      searchable: true,
      mobileHidden: true,
    },
    {
      key: 'eventDate',
      label: 'कार्यक्रमको मिति',
      sortable: true,
    },
    {
      key: 'eventTime',
      label: 'कार्यक्रमको समय',
      mobileHidden: true,
    },
    {
      key: 'eventType',
      label: 'कार्यक्रमको प्रकार',
      mobileHidden: true,
    },
    {
      key: 'address',
      label: 'ठेगाना',
      render: (_, event) => formatAddress(event),
      mobileHidden: true,
    },
    {
      key: 'venue',
      label: 'स्थान',
      render: (value) => value || '-',
      mobileHidden: true,
    },
    {
      key: 'eventSpeaker',
      label: 'कार्यक्रम वक्ता तथा प्रशिक्षक',
      mobileHidden: true,
    },
    {
      key: 'eventOrganizer',
      label: 'कार्यक्रमको आयोजक',
      mobileHidden: true,
    },
    {
      key: 'remarks',
      label: 'कैफियत',
      mobileHidden: true,
    },
    {
      key: 'actions',
      label: 'सुधार',
      render: (_, event) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateEvent(event.eventId)}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 text-sm"
            title="सम्पादन गर्नुहोस्"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteEvent(event.eventId)}
            className="rounded bg-rose-500 px-3 py-1 text-white hover:bg-rose-600 text-sm"
            title="मेटाउनुहोस्"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  // Mobile card rendering
  const renderMobileCard = (event: Event, index: number) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            {event.eventHeading}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {event.eventDate} • {event.eventTime}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateEvent(event.eventId)}
            className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 text-xs"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteEvent(event.eventId)}
            className="rounded bg-rose-500 px-2 py-1 text-white hover:bg-rose-600 text-xs"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 text-sm">
        {event.eventDetails && (
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">विवरण: </span>
            <span className="text-black dark:text-white">{event.eventDetails}</span>
          </div>
        )}
        
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-400">स्थान: </span>
          <span className="text-black dark:text-white">{formatAddress(event)}</span>
        </div>
        
        {event.eventOrganizer && (
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">आयोजक: </span>
            <span className="text-black dark:text-white">{event.eventOrganizer}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // If singleEvent is provided, display only that event
  const eventsToDisplay = singleEvent ? [singleEvent] : events;

  return (
    <div className="w-full">
      <ResponsiveTable
        data={eventsToDisplay}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={searchTerm}
        title="कार्यक्रम तालिका"
        keyExtractor={(event) => event.eventId.toString()}
        mobileCardRender={renderMobileCard}
        emptyMessage="कुनै कार्यक्रम भेटिएन"
        showSerialNumber={true}
      />
    </div>
  );
};

export default EventsTable;
