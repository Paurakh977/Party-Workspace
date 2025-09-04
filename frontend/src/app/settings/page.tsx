"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CommitteeForm from "@/components/Forms/CommitteeForm";
import SubCommitteeForm from "@/components/Forms/SubCommitteeForm";
import LevelsForm from "@/components/Forms/LevelsForm";

interface Committee {
  id: string;
  name: string;
}

const Settings = () => {
  const [committeeName, setCommitteeName] = useState("");
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
        const response = await fetch(process.env.NEXT_PUBLIC_BE_HOST + "/committees");
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
        const response = await fetch(process.env.NEXT_PUBLIC_BE_HOST + "/sub-committees");
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

  const handleCommitteeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommitteeName(e.target.value);
  };

  const handleSubCommitteeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSubCommitteeForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCommitteeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      committeeName: committeeName,
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BE_HOST + "/committees", {
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

  const handleSubCommitteeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subCommitteePayload = {
      subCommitteeName: subCommitteeForm.subCommitteeName,
      committeeId: Number(subCommitteeForm.selectedCommitteeId),
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BE_HOST + "/sub-committees", {
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

  const handleCancel = (form: "committee" | "subCommittee") => {
    if (form === "committee") {
      setCommitteeName("");
    } else {
      setSubCommitteeForm({
        subCommitteeName: "",
        selectedCommitteeId: "",
      });
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="सेटिङहरु" />

        <div className="mt-8">
          <CommitteeForm
            committeeName={committeeName}
            onCommitteeNameChange={handleCommitteeChange}
            onCancel={() => handleCancel("committee")}
            onSubmit={handleCommitteeSubmit}
          />
        </div>

        <div className="mt-8">
          <SubCommitteeForm
            subCommitteeName={subCommitteeForm.subCommitteeName}
            selectedCommitteeId={subCommitteeForm.selectedCommitteeId}
            committees={committees}
            isSubCommitteeEnabled={isSubCommitteeEnabled}
            onSubCommitteeChange={handleSubCommitteeChange}
            onCancel={() => handleCancel("subCommittee")}
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

export default Settings;
