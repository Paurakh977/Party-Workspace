"use client";

import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MembersTable from "@/components/Tables/MembersTable"; // Adjust the import path as needed

const MembersTablePage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <Breadcrumb pageName="समिति तालिका" />
        <div>
          {/* Table component */}
          <MembersTable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MembersTablePage;
