"use client";
import React, { useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UpdateMembersForm from "@/components/Forms/UpdateForms/UpdateMembersForm";

// Define the type for route parameters
interface PageProps {
  params: {
    memberId: number;
  };
}

// const UpdateMemberPageWrapper: React.FC<PageProps> = ({ params }) => {

const Page = ({ params }: { params: { memberId: string } }) => {
  // Handle memberId being a string or array of strings
  const memberId = Array.isArray(params.memberId)
    ? params.memberId[0]
    : params.memberId;

  // useEffect(() => {
  //   console.log(`params from wrapper:`, params.memberId);
  //   console.log("params:", params);
  //   // console.log("memberId from page:", memberId);
  // }, []);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb pageName="सदस्य विवरण अद्यावधिक गर्नुहोस्" />
        <div>
          <UpdateMembersForm memberId={memberId} />
        </div>
      </div>
    </DefaultLayout>
  );
};

// export default UpdateMemberPageWrapper;
export default Page;
