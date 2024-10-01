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

const RepresentativesForm: React.FC = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<SubCommittee[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<string>("");
  const [selectedSubCommittee, setSelectedSubCommittee] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
  const [isSubCommitteeDisabled, setIsSubCommitteeDisabled] =
    useState<boolean>(true);
  const [isLevelDisabled, setIsLevelDisabled] = useState<boolean>(true); // Manage level dropdown disabled state

  // Fetch committees data from API on component mount
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await axios.get<Committee[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/committees",
        );
        setCommittees(response.data);
        setIsFormDisabled(response.data.length === 0); // Disable form if no committees
      } catch (error) {
        console.error("Error fetching committees:", error);
        setIsFormDisabled(true); // Disable form on error
      }
    };

    fetchCommittees();
  }, []);

  // Fetch sub-committees data when a committee is selected
  useEffect(() => {
    const fetchSubCommittees = async () => {
      if (selectedCommittee) {
        try {
          const response = await axios.get<SubCommittee[]>(
            process.env.NEXT_PUBLIC_BE_HOST + `/sub-committees/committee/${selectedCommittee}`,
          );
          setSubCommittees(response.data);
          setIsSubCommitteeDisabled(response.data.length === 0); // Disable if no sub-committees
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

  // Fetch levels based on selected committee and sub-committee
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        let endpoint = "";

        if (selectedSubCommittee) {
          endpoint = process.env.NEXT_PUBLIC_BE_HOST + `/sub-level/sub-committee/${selectedSubCommittee}`;
        } else if (selectedCommittee) {
          endpoint = process.env.NEXT_PUBLIC_BE_HOST + `/sub-level/committee/${selectedCommittee}`;
        }

        if (!endpoint) {
          setLevels([]);
          setIsLevelDisabled(true);
          return;
        }

        // Fetch level IDs related to the selected committee/sub-committee
        const response = await axios.get<{ levelId: number }[]>(endpoint);
        const levelIds = response.data.map((level) => level.levelId);

        if (levelIds.length > 0) {
          // Fetch all levels and filter based on IDs
          const levelsResponse = await axios.get<Level[]>(
            process.env.NEXT_PUBLIC_BE_HOST + "/levels",
          );
          const filteredLevels = levelsResponse.data.filter((level) =>
            levelIds.includes(level.levelId),
          );

          setLevels(filteredLevels);
          setIsLevelDisabled(filteredLevels.length === 0); // Disable dropdown if no levels
        } else {
          setLevels([]);
          setIsLevelDisabled(true); // Disable the levels dropdown
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
        setLevels([]);
        setIsLevelDisabled(true); // Disable on error
      }
    };

    fetchLevels();
  }, [selectedCommittee, selectedSubCommittee]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      committeeId: parseInt(selectedCommittee, 10),
      subCommitteeId: selectedSubCommittee
        ? parseInt(selectedSubCommittee, 10)
        : null,
      levelId: parseInt(selectedLevel, 10),
      representativeId: null, // Placeholder for representative, no representative ID will be submitted yet
    };

    try {
      await axios.post(process.env.NEXT_PUBLIC_BE_HOST + "/structures", payload);
      console.log("Form submitted successfully");

      // Reset form state
      setSelectedCommittee("");
      setSelectedSubCommittee("");
      setSelectedLevel("");
      setSubCommittees([]);
      setLevels([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          प्रतिनिधिहरु चयन फारम
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
                setSelectedSubCommittee("");
                setLevels([]);
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

          {/* Level Dropdown */}
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
              disabled={isLevelDisabled}
              className={`w-full rounded border border-stroke py-3 pl-4.5 pr-4.5 text-black focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white ${
                isLevelDisabled
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

          {/* Representative Dropdown (Disabled) */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="representative"
            >
              प्रतिनिधिहरु चयन गर्नुहोस्:
            </label>
            <select
              id="representative"
              disabled
              className="bg-gray-200 w-full cursor-not-allowed rounded border border-stroke py-3 pl-4.5 pr-4.5 text-black focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="" disabled>
                प्रतिनिधिहरु चयन गर्नुहोस्
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="hover:bg-primary-dark focus:bg-primary-dark inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white focus:outline-none"
            disabled={isLevelDisabled}
          >
            सेभ गर्नुहोस्
          </button>
        </form>
      </div>
    </div>
  );
};

export default RepresentativesForm;
