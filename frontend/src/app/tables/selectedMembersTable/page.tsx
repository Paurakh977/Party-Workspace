"use client";

import React, { Suspense, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MembersFilteredTable from "@/components/Tables/MembersFilteredTable";
import { useSearchParams } from "next/navigation"; // Importing useSearchParams from next/navigation

const SelectedMembersPage: React.FC = () => {
  const searchParams = useSearchParams(); // Accessing search params
  const committeeId = searchParams.get("committeeId");
  const subCommitteeId = searchParams.get("subCommitteeId");

  // Convert to numbers if needed
  const committeeIdNumber = committeeId ? parseInt(committeeId, 10) : 1;
  const subCommitteeIdNumber = subCommitteeId
    ? parseInt(subCommitteeId, 10)
    : null;

  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <Breadcrumb pageName="सदस्य व्यवस्थापन" />
        <div>
          <Suspense>
            <MembersFilteredTable
              committeeId={committeeIdNumber}
              subCommitteeId={subCommitteeIdNumber}
            />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SelectedMembersPage;
