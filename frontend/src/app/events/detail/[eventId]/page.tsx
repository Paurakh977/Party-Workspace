"use client";
import React, { useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ViewEventPage from "@/components/Details/EventDetails";

// Define the type for route parameters
interface PageProps {
  params: {
    eventId: number;
  };
}

const ViewEvents: React.FC<PageProps> = ({ params }) => {
  // Handle memberId being a string or array of strings
  const eventId = Array.isArray(params.eventId)
    ? params.eventId[0]
    : params.eventId;

  useEffect(() => {
    console.log(`params from wrapper:`, params.eventId);
    console.log("params:", params);
    // console.log("memberId from page:", memberId);
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb pageName="कार्यक्रम विवरण" />
        <div>
          <ViewEventPage eventId={eventId} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewEvents;
