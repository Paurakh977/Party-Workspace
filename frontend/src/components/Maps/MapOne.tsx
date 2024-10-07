"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useRouter } from "next/navigation";
import axios from "axios";
import NepaliDate from "nepali-datetime";

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

// Center the map over Nepal's geographic coordinates with a suitable zoom level
const MapOne: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDistricts, setEventDistricts] = useState<string[]>([]); // State to store event districts
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
        const upcoming: Event[] = [];
        const districtsSet = new Set<string>(); // Using Set to avoid duplicates

        eventsResponse.data.forEach((event) => {
          const eventDate = new NepaliDate(event.eventDate);

          // Separate past and upcoming events
          if (eventDate.getDate() < now.getDate()) {
            pastEvents.push(event);
          } else {
            upcoming.push(event);
          }

          // Extract eventDistrict and add to Set
          if (event.district) {
            districtsSet.add(event.district); // Assuming eventDistrict is a string
          }
        });

        setEvents(pastEvents); // Set past events (modify as needed)
        setEventDistricts(Array.from(districtsSet)); // Convert Set to Array and set it
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        कार्यक्रमहरुको नक्सा
      </h4>
      <div className="h-90">
        <MapContainer
          center={[28.3949, 84.124]} // Coordinates to center over Nepal
          zoom={7} // Zoom level suitable for Nepal
          style={{ height: "100%", width: "100%" }} // Ensure the map container fills the available space
        >
          {/* TileLayer to use OpenStreetMap tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapOne;
