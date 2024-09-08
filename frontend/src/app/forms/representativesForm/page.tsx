"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RepresentativesForm from "@/components/Forms/RepresentativesForm";
const LevelsFormPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Adjusted max-w to fit the form size */}
        <Breadcrumb pageName="संरचना व्यवस्थापन" />
        <div className="bg-white p-6 shadow sm:rounded-lg">
          {/* Adjusted padding */}
          <RepresentativesForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LevelsFormPage;
