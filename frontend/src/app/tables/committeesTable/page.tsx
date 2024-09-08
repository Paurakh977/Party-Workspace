"use client";

import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CommitteesTable from "@/components/Tables/CommitteesTable"; // Adjust the import path as needed

const CommitteesTablePage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="max-w-800 mx-auto px-4 py-8">
        {/* Adjusted max-w to fit the table size */}
        <Breadcrumb pageName="समिति तालिका" />
        <div className="bg-white p-6 shadow sm:rounded-lg">
          {/* Table component */}
          <CommitteesTable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CommitteesTablePage;
