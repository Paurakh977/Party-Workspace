"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CommitteeForm from "@/components/Forms/CommitteeForm";

const CommitteeFormPage = () => {
  const [committeeName, setCommitteeName] = useState("");

  const handleCommitteeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommitteeName(e.target.value);
  };

  const handleCommitteeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      committeeName: committeeName,
    };

    try {
      const response = await fetch("http://localhost:3000/committees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Committee form submitted successfully:", data);

      setCommitteeName("");
    } catch (error) {
      console.error("Error submitting committee form:", error);
    }
  };

  const handleCancel = () => {
    setCommitteeName("");
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="समिति व्यवस्थापन" />

        <div className="mt-8">
          <CommitteeForm
            committeeName={committeeName}
            onCommitteeNameChange={handleCommitteeChange}
            onCancel={handleCancel}
            onSubmit={handleCommitteeSubmit}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CommitteeFormPage;
