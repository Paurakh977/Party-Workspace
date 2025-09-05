"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useRouter } from "next/navigation";
import axios from "axios";
import NepaliDate from "nepali-datetime";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

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
  latitude?: number;
  longitude?: number;
}

interface fetchCoordinateResponse {
  districtCoordinate: {
    [key: string]: { latitude: number; longitude: number };
  };
}

// Create custom marker icon using Lucide MapPin
const createCustomIcon = () => {
  const iconSvg = renderToString(
    <MapPin 
      size={32} 
      color="#dc2626" 
      fill="#dc2626" 
      strokeWidth={1.5}
    />
  );
  
  const iconUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`;
  
  return L.icon({
    iconUrl: iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Center the map over Nepal's geographic coordinates with a suitable zoom level
const MapOne: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDistricts, setEventDistricts] = useState<string[]>([]); // State to store event districts
  const [districtCoordinates, setDistrictCoordinates] = useState<{
    [key: string]: { latitude: number; longitude: number };
  }>({});
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Create the custom icon on component mount
    setCustomIcon(createCustomIcon());

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

          // Include all events that have latitude and longitude
          if (event.latitude && event.longitude) {
            if (eventDate.getDate() < now.getDate()) {
              pastEvents.push(event);
            } else {
              upcoming.push(event);
            }
          }

          // Extract eventDistrict and add to Set
          if (event.district) {
            districtsSet.add(event.district);
          }
        });

        // Combine past and upcoming events to show all events on the map
        setEvents([...pastEvents, ...upcoming]);
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

  if (loading) {
    return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
        <div className="flex h-90 items-center justify-center">
          <div className="text-lg text-gray-500">Loading map...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
        <div className="flex h-90 items-center justify-center">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }

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
          {customIcon && events.map((event) => {
            // Use event's latitude and longitude if available
            if (event.latitude && event.longitude) {
              return (
                <Marker
                  key={event.eventId}
                  position={[Number(event.latitude), Number(event.longitude)]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => {
                      router.push(`/events/detail/${event.eventId}`);
                    },
                  }}
                >
                  <Tooltip permanent={false} direction="top" offset={[0, -20]}>
                    <div className="min-w-[200px] p-2">
                      <strong className="text-base font-semibold text-gray-800 block mb-2">
                        {event.eventHeading}
                      </strong>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>मिति: {event.eventDate}</div>
                        <div>समय: {event.eventTime}</div>
                        <div>स्थान: {event.venue || event.address}</div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 italic">
                        विवरण हेर्नको लागि क्लिक गर्नुहोस्
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              );
            }
            // Fallback to district coordinates if event doesn't have specific coordinates
            else if (event.district && districtCoordinates[event.district]) {
              const { latitude, longitude } = districtCoordinates[event.district];
              
              return (
                <Marker
                  key={event.eventId}
                  position={[latitude, longitude]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => {
                      router.push(`/events/detail/${event.eventId}`);
                    },
                  }}
                >
                  <Tooltip permanent={false} direction="top" offset={[0, -20]}>
                    <div className="min-w-[200px] p-2">
                      <strong className="text-base font-semibold text-gray-800 block mb-2">
                        {event.eventHeading}
                      </strong>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>मिति: {event.eventDate}</div>
                        <div>समय: {event.eventTime}</div>
                        <div>स्थान: {event.venue || event.address}, {event.district}</div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 italic">
                        विवरण हेर्नको लागि क्लिक गर्नुहोस्
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              );
            }
            return null; // Return nothing if no coordinates found
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapOne;