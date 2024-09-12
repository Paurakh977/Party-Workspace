"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EventsForm from "@/components/Forms/EventsForm";
const LevelsFormPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Adjusted max-w to fit the form size */}
        <Breadcrumb pageName="कार्यक्रम व्यवस्थापन" />
        <div>
          {/* Adjusted padding */}
          <EventsForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LevelsFormPage;
