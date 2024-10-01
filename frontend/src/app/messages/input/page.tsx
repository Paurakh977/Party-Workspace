"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MessageForm from "@/components/Messages/MessageForm";
import { useSearchParams } from "next/navigation";

const MessageFormPage: React.FC = () => {
  const searchParams = useSearchParams();
  const eventDetails = String(searchParams.get("eventDetails") || "");
  const eventOrganizer = String(searchParams.get("eventOrganizer") || "");
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Adjusted max-w to fit the form size */}
        <Breadcrumb pageName="एस एम एस व्यवस्थापन" />
        <div>
          {/* Adjusted padding */}
          <MessageForm
            eventDetails={eventDetails}
            eventOrganizer={eventOrganizer}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MessageFormPage;
