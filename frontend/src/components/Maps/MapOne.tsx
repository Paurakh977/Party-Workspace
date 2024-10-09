"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation";
import axios from "axios";
import NepaliDate from "nepali-datetime";
import L from "leaflet";

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

interface fetchCoordinateResponse {
  districtCoordinate: {
    [key: string]: { latitude: number; longitude: number };
  };
}

// Center the map over Nepal's geographic coordinates with a suitable zoom level
const MapOne: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDistricts, setEventDistricts] = useState<string[]>([]); // State to store event districts
  const [districtCoordinates, setDistrictCoordinates] = useState<{
    [key: string]: { latitude: number; longitude: number };
  }>({});
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
            districtsSet.add(event.district);
            console.log("the event district", event.district); // Assuming eventDistrict is a string
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

    const fetchCoordinates = async (): Promise<void> => {
      try {
        const response = await fetch("/district-coordinates.json");
        console.log(response.status, response.statusText); // Log status code
        const text = await response.text();
        console.log(text); // Log the raw response to inspect it
        const coordinatesResult = JSON.parse(text); // Parse only if the response is valid
        setDistrictCoordinates(coordinatesResult.districtCoordinate);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchData();
    fetchCoordinates();
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

          {/* Plotting markers for each event */}
          {events.map((event) => {
            const districtName = event.district;
            const districtData = districtCoordinates[districtName || ""];

            if (districtData) {
              const { latitude, longitude } = districtData; // Destructure latitude and longitude

              return (
                <Marker
                  key={event.eventId}
                  position={[latitude, longitude]}
                  icon={L.icon({
                    iconUrl: "/path-to-marker-icon.png", // Adjust icon URL as needed
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })}
                >
                  <Popup>
                    <strong>{event.eventHeading}</strong>
                    <br />
                    Date: {event.eventDate}
                    <br />
                    Time: {event.eventTime}
                    <br />
                    Location: {event.address}, {event.district}
                  </Popup>
                </Marker>
              );
            }
            return null; // Return nothing if no coordinates found for the district
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapOne;
