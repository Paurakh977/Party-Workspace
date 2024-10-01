"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersForm from "@/components/Forms/UsersForm";

const UsersFormPage = () => {
  return (
    <DefaultLayout>
      <div>
        <Breadcrumb pageName="प्रयोगकर्ता व्यवस्थापन" />
        <div>
          <UsersForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UsersFormPage;
