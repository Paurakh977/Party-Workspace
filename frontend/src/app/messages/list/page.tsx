"use client";

import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MessagesTable from "@/components/Messages/MessageTable";

const MessagesTablePage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <Breadcrumb pageName="कार्यक्रम तालिका" />
        <div>
          {/* Table component */}
          <MessagesTable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MessagesTablePage;
