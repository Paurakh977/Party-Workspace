"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MembersFilteredTable from "@/components/Tables/MembersFilteredTable";
import { useSearchParams } from "next/navigation";

const SelectedMembersPage = ({
  params,
}: {
  params: { committeeId: string; subCommitteeId?: string };
}) => {
  const committeeId = parseInt(params.committeeId, 10);
  const subCommitteeId = params.subCommitteeId
    ? parseInt(params.subCommitteeId, 10)
    : null;
  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <Breadcrumb pageName="सदस्य व्यवस्थापन" />
        <div>
          <MembersFilteredTable
            committeeId={committeeId}
            subCommitteeId={subCommitteeId}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SelectedMembersPage;
