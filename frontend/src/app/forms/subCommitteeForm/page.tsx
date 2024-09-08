"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SubCommitteeForm from "@/components/Forms/SubCommitteeForm";
import LevelsForm from "@/components/Forms/LevelsForm";

interface Committee {
  id: string;
  name: string;
}

const SubCommitteeFormPage = () => {
  const [subCommitteeForm, setSubCommitteeForm] = useState({
    subCommitteeName: "",
    selectedCommitteeId: "",
  });
  const [isSubCommitteeEnabled, setIsSubCommitteeEnabled] = useState(false);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [hasSubCommittees, setHasSubCommittees] = useState(false);

  useEffect(() => {
    // Fetch data from committees API
    const fetchCommittees = async () => {
      try {
        const response = await fetch("http://localhost:3000/committees");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Map the API response to match the expected structure
        const mappedCommittees = data.map((committee: any) => ({
          id: committee.committeeId,
          name: committee.committeeName,
        }));

        setCommittees(mappedCommittees);

        if (mappedCommittees.length > 0) {
          setIsSubCommitteeEnabled(true);
        }
      } catch (error) {
        console.error("Error fetching committees:", error);
      }
    };

    // Check if there are any sub-committees available
    const fetchSubCommittees = async () => {
      try {
        const response = await fetch("http://localhost:3000/sub-committee");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.length > 0) {
          setHasSubCommittees(true);
        }
      } catch (error) {
        console.error("Error fetching sub-committees:", error);
      }
    };

    fetchCommittees();
    fetchSubCommittees();
  }, []);

  const handleSubCommitteeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSubCommitteeForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubCommitteeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subCommitteePayload = {
      subCommitteeName: subCommitteeForm.subCommitteeName,
      committeeId: Number(subCommitteeForm.selectedCommitteeId),
    };

    try {
      const response = await fetch("http://localhost:3000/sub-committees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subCommitteePayload),
      });

      if (!response.ok) {
        console.log(subCommitteePayload);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Sub-Committee form submitted successfully:", data);

      setSubCommitteeForm({
        subCommitteeName: "",
        selectedCommitteeId: "",
      });
    } catch (error) {
      console.error("Error submitting sub-committee form:", error);
    }
  };

  const handleCancel = () => {
    setSubCommitteeForm({
      subCommitteeName: "",
      selectedCommitteeId: "",
    });
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="उपसमिति" />

        <div className="mt-8">
          <SubCommitteeForm
            subCommitteeName={subCommitteeForm.subCommitteeName}
            selectedCommitteeId={subCommitteeForm.selectedCommitteeId}
            committees={committees}
            isSubCommitteeEnabled={isSubCommitteeEnabled}
            onSubCommitteeChange={handleSubCommitteeChange}
            onCancel={handleCancel}
            onSubmit={handleSubCommitteeSubmit}
          />
        </div>

        {hasSubCommittees && (
          <div className="mt-8">
            <LevelsForm />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default SubCommitteeFormPage;
