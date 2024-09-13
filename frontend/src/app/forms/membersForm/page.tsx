"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MembersForm from "@/components/Forms/MembersForm";
const LevelsFormPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Adjusted max-w to fit the form size */}
        <Breadcrumb pageName="संरचना व्यवस्थापन" />
        <div>
          {/* Adjusted padding */}
          <MembersForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LevelsFormPage;
