"use client";

import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersTable from "@/components/Tables/UsersTable";

const UsersTablePage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <Breadcrumb pageName="प्रयोगकर्ता तालिका" />
        <div>
          <UsersTable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UsersTablePage;
