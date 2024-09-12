"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Committee {
  committeeId: number;
  committeeName: string;
}

interface SubCommittee {
  subCommitteeId: number;
  subCommitteeName: string;
  committeeId: number;
}

interface Level {
  levelId: number;
  levelName: string;
}

interface Event {
  eventId: number;
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  eventType: string;
  address: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  venue?: string;
  committeeId: number;
  subCommitteeId?: number;
  levelId?: number;
  remarks: string;
}

interface Position {
  positionId: number;
  positionName: string;
}

const EventsTable = ({ singleEvent }: { singleEvent?: Event }) => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<
    Record<number, SubCommittee[]>
  >({});
  const [levels, setLevels] = useState<Record<number, string>>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch committees
        const committeesResponse = await axios.get<Committee[]>(
          "http://localhost:3000/committees",
        );
        setCommittees(committeesResponse.data);

        // Fetch levels data
        const levelsResponse = await axios.get<Level[]>(
          "http://localhost:3000/levels",
        );
        const levelsData = levelsResponse.data.reduce(
          (acc, level) => ({ ...acc, [level.levelId]: level.levelName }),
          {} as Record<number, string>,
        );
        setLevels(levelsData);

        // Fetch sub-committees for each committee
        const subCommitteesData = await Promise.all(
          committeesResponse.data.map(async (committee) => {
            try {
              const subResponse = await axios.get<SubCommittee[]>(
                `http://localhost:3000/sub-committees/committee/${committee.committeeId}`,
              );
              return { [committee.committeeId]: subResponse.data };
            } catch {
              return { [committee.committeeId]: [] };
            }
          }),
        );
        const mergedSubCommittees = subCommitteesData.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {} as Record<number, SubCommittee[]>,
        );
        setSubCommittees(mergedSubCommittees);

        // Fetch events data
        const eventsResponse = await axios.get<Event[]>(
          "http://localhost:3000/events",
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
                कार्यक्रम नाम
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                सुरु मिति
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                अन्त्य मिति
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                कार्यक्रम प्रकार
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                ठेगाना
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                स्थान
              </th>
              <th className="border-gray-700 w-25 border-2 px-4 py-2 font-bold text-black">
                समिति
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                उपसमिति
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                तह
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                कैफियत
              </th>
            </tr>
          </thead>

          <tbody>
            {eventsToDisplay.map((event, index) => {
              const committee = committees.find(
                (c) => c.committeeId === event.committeeId,
              );
              const subCommittee = event.subCommitteeId
                ? subCommittees[event.committeeId]?.find(
                    (sub) => sub.subCommitteeId === event.subCommitteeId,
                  )
                : null;

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
                    {event.eventName}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventStartDate}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.eventEndDate}
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
                    {committee?.committeeName || "-"}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {subCommittee?.subCommitteeName || "-"}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {levels[event.levelId || 0] || "-"}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {event.remarks}
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
