import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Define interfaces for the data types
interface Committee {
  committeeId: number;
  committeeName: string;
}

interface SubCommittee {
  subCommitteeId: number;
  subCommitteeName: string;
}

interface Level {
  levelId: number;
  levelName: string;
}

const LevelsForm: React.FC = () => {
  // State to store fetched data
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<SubCommittee[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);

  // State to store selected options
  const [selectedCommittee, setSelectedCommittee] = useState<string>("");
  const [selectedSubCommittee, setSelectedSubCommittee] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  // State to manage form and field disabled status
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
  const [isSubCommitteeDisabled, setIsSubCommitteeDisabled] =
    useState<boolean>(true);

  // Fetch committees data from API on component mount
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await axios.get<Committee[]>(
          "http://localhost:3000/committees",
        );
        if (response.data.length > 0) {
          setCommittees(response.data);
          setIsFormDisabled(false); // Enable the form if committees data is available
        } else {
          setIsFormDisabled(true); // Disable the entire form if no committees data is available
        }
      } catch (error) {
        console.error("Error fetching committees:", error);
        setIsFormDisabled(true); // Disable the form on error
      }
    };

    fetchCommittees();
  }, []);

  // Fetch sub-committees data when a committee is selected
  useEffect(() => {
    const fetchSubCommittees = async () => {
      if (selectedCommittee) {
        console.log(
          "Fetching sub-committees for committee:",
          selectedCommittee,
        ); // Debugging log
        try {
          const response = await axios.get<SubCommittee[]>(
            `http://localhost:3000/sub-committees/committee/${selectedCommittee}`,
          );
          if (response.data.length > 0) {
            setSubCommittees(response.data);
            setIsSubCommitteeDisabled(false); // Enable sub-committee dropdown if data is available
          } else {
            setIsSubCommitteeDisabled(true); // Disable if no data
          }
        } catch (error) {
          console.error("Error fetching sub-committees:", error);
          setIsSubCommitteeDisabled(true); // Disable on error
        }
      } else {
        setSubCommittees([]);
        setIsSubCommitteeDisabled(true); // Disable if no committee selected
      }
    };

    fetchSubCommittees();
  }, [selectedCommittee]);

  // Fetch levels data (assuming levels are not dependent on selected committee or sub-committee)
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axios.get<Level[]>(
          "http://localhost:3000/levels",
        );
        setLevels(response.data);
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };

    fetchLevels();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Prepare the payload with selected committee, sub-committee, and level
    const payload = {
      committeeId: parseInt(selectedCommittee, 10),
      subCommitteeId: selectedSubCommittee
        ? parseInt(selectedSubCommittee, 10)
        : null,
      levelId: parseInt(selectedLevel, 10),
    };

    try {
      await axios.post("http://localhost:3000/sub-level", payload);
      console.log("Form submitted successfully");

      // Reset form state
      setSelectedCommittee("");
      setSelectedSubCommittee("");
      setSelectedLevel("");

      // Clear sub-committees and levels as well
      setSubCommittees([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          तस प्रविष्टी फारम
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {/* Committee Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="committee"
            >
              समिति चयन गर्नुहोस्:
            </label>
            <select
              id="committee"
              value={selectedCommittee}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedCommittee(e.target.value);
                console.log("Selected committee:", e.target.value); // Debugging log
              }}
              required
              disabled={isFormDisabled}
              className={`w-full rounded border border-stroke py-3 pl-4.5 pr-4.5 text-black focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white ${
                isFormDisabled
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-50 hover:bg-gray-100 focus:border-primary"
              }`}
            >
              <option value="" disabled>
                समिति चयन गर्नुहोस्
              </option>
              {committees.map((committee) => (
                <option
                  key={committee.committeeId}
                  value={committee.committeeId.toString()}
                >
                  {committee.committeeName}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Committee Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="subCommittee"
            >
              उपसमिति चयन गर्नुहोस्:
            </label>
            <select
              id="subCommittee"
              value={selectedSubCommittee}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedSubCommittee(e.target.value)
              }
              disabled={isSubCommitteeDisabled}
              className={`w-full rounded border border-stroke py-3 pl-4.5 pr-4.5 text-black focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white ${
                isSubCommitteeDisabled
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-50 hover:bg-gray-100 focus:border-primary"
              }`}
            >
              <option value="" disabled>
                उपसमिति चयन गर्नुहोस्
              </option>
              {subCommittees.map((subCommittee) => (
                <option
                  key={subCommittee.subCommitteeId}
                  value={subCommittee.subCommitteeId.toString()}
                >
                  {subCommittee.subCommitteeName}
                </option>
              ))}
            </select>
          </div>

          {/* Levels Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="level"
            >
              तह चयन गर्नुहोस्:
            </label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedLevel(e.target.value)
              }
              required
              disabled={isFormDisabled}
              className={`w-full rounded border border-stroke py-3 pl-4.5 pr-4.5 text-black focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white ${
                isFormDisabled
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-50 hover:bg-gray-100 focus:border-primary"
              }`}
            >
              <option value="" disabled>
                तह चयन गर्नुहोस्
              </option>
              {levels.map((level) => (
                <option key={level.levelId} value={level.levelId.toString()}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              type="submit"
              className={`flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-70 ${
                isFormDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isFormDisabled}
            >
              पठाउनुहोस्
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LevelsForm;
