"use client";

import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MembersFilteredTable from "@/components/Tables/MembersFilteredTable";

const SelectedMembersPage = ({
  params,
}: {
  params: { committeeId: string; subCommitteeId: string };
}) => {
  const committeeIdNumber = parseInt(params.committeeId, 10);
  const subCommitteeIdNumber = params.subCommitteeId
    ? parseInt(params.subCommitteeId, 10)
    : null;

  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <Breadcrumb pageName="सदस्य व्यवस्थापन" />
        <div>
          <MembersFilteredTable
            committeeId={committeeIdNumber}
            subCommitteeId={subCommitteeIdNumber}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SelectedMembersPage;
