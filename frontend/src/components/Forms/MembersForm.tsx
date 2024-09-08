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

interface Position {
  positionId: number;
  positionName: string;
}

const MembersForm: React.FC = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<SubCommittee[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<number | "">("");
  const [selectedSubCommittee, setSelectedSubCommittee] = useState<number | "">(
    "",
  );
  const [selectedLevel, setSelectedLevel] = useState<number | "">("");
  const [selectedPosition, setSelectedPosition] = useState<number | "">("");
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
  const [isSubCommitteeDisabled, setIsSubCommitteeDisabled] =
    useState<boolean>(true);
  const [isLevelDisabled, setIsLevelDisabled] = useState<boolean>(true);
  const [isPositionDisabled, setIsPositionDisabled] = useState<boolean>(true);

  // New state variables for the additional fields
  const [memberName, setMemberName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [representative, setRepresentative] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  // Fetch committees data from API on component mount
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await axios.get<Committee[]>(
          "http://localhost:3000/committees",
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
            `http://localhost:3000/sub-committees/committee/${selectedCommittee}`,
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
      if (selectedCommittee || selectedSubCommittee) {
        try {
          let endpoint = "";

          if (selectedSubCommittee) {
            endpoint = `http://localhost:3000/sub-levels/sub-committee/${selectedSubCommittee}`;
          } else if (selectedCommittee) {
            endpoint = `http://localhost:3000/sub-levels/committee/${selectedCommittee}`;
          }

          if (endpoint) {
            const response = await axios.get<{ levelId: number }[]>(endpoint);
            const levelIds = response.data.map((level) => level.levelId);

            if (levelIds.length > 0) {
              // Fetch all levels and filter based on IDs
              const levelsResponse = await axios.get<Level[]>(
                "http://localhost:3000/levels",
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
          } else {
            setLevels([]);
            setIsLevelDisabled(true); // Disable if no endpoint
          }
        } catch (error) {
          console.error("Error fetching levels:", error);
          setLevels([]);
          setIsLevelDisabled(true); // Disable on error
        }
      } else {
        setLevels([]);
        setIsLevelDisabled(true); // Disable if no committee or sub-committee selected
      }
    };

    fetchLevels();
  }, [selectedCommittee, selectedSubCommittee]);

  // Fetch positions based on selected committee or sub-committee
  useEffect(() => {
    const fetchPositions = async () => {
      if (selectedCommittee || selectedSubCommittee) {
        try {
          let endpoint = "";

          if (selectedSubCommittee) {
            endpoint = `http://localhost:3000/structures/subcommittee/${selectedSubCommittee}`;
          } else if (selectedCommittee) {
            endpoint = `http://localhost:3000/structures/committee/${selectedCommittee}`;
          }

          if (endpoint) {
            const response =
              await axios.get<{ positionId: number }[]>(endpoint);
            const positionIds = response.data.map(
              (position) => position.positionId,
            );

            if (positionIds.length > 0) {
              // Fetch all positions and filter based on IDs
              const positionsPromises = positionIds.map((id) =>
                axios.get<Position>(`http://localhost:3000/positions/${id}`),
              );
              const positionsResponses = await Promise.all(positionsPromises);
              const filteredPositions = positionsResponses.map(
                (res) => res.data,
              );

              setPositions(filteredPositions);
              setIsPositionDisabled(filteredPositions.length === 0); // Disable dropdown if no positions
            } else {
              setPositions([]);
              setIsPositionDisabled(true); // Disable if no positions
            }
          } else {
            setPositions([]);
            setIsPositionDisabled(true); // Disable if no endpoint
          }
        } catch (error) {
          console.error("Error fetching positions:", error);
          setPositions([]);
          setIsPositionDisabled(true); // Disable on error
        }
      } else {
        setPositions([]);
        setIsPositionDisabled(true); // Disable if no committee or sub-committee selected
      }
    };

    fetchPositions();
  }, [selectedCommittee, selectedSubCommittee]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      memberName,
      mobileNumber,
      email: email || null,
      committeeId: selectedCommittee !== "" ? selectedCommittee : null,
      subCommitteeId: selectedSubCommittee !== "" ? selectedSubCommittee : null,
      levelId: selectedLevel !== "" ? selectedLevel : null,
      positionId: selectedPosition !== "" ? selectedPosition : null,
      representative: representative || null,
      address: address || null,
    };

    try {
      await axios.post("http://localhost:3000/members", payload);
      console.log("Form submitted successfully");

      // Reset form state
      setMemberName("");
      setMobileNumber("");
      setEmail("");
      setRepresentative("");
      setAddress("");
      setSelectedCommittee("");
      setSelectedSubCommittee("");
      setSelectedLevel("");
      setSelectedPosition("");
      setSubCommittees([]);
      setLevels([]);
      setPositions([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          सदस्यहरु चयन फारम
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="memberName"
            >
              नाम:
            </label>
            <input
              type="text"
              id="memberName"
              value={memberName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMemberName(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Phone Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="mobileNumber"
            >
              फोन नम्बर:
            </label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMobileNumber(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Email Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="email"
            >
              इमेल:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Representative Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="representative"
            >
              प्रतिनिधि:
            </label>
            <input
              type="text"
              id="representative"
              value={representative}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRepresentative(e.target.value)
              }
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Address Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="address"
            >
              ठेगाना:
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAddress(e.target.value)
              }
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Committee Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="committee"
            >
              समिति:
            </label>
            <select
              id="committee"
              value={selectedCommittee}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedCommittee(Number(e.target.value))
              }
              disabled={isFormDisabled}
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">-- चयन गर्नुहोस् --</option>
              {committees.map((committee) => (
                <option
                  key={committee.committeeId}
                  value={committee.committeeId}
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
              उपसमिति:
            </label>
            <select
              id="subCommittee"
              value={selectedSubCommittee}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedSubCommittee(Number(e.target.value))
              }
              disabled={isSubCommitteeDisabled}
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">-- चयन गर्नुहोस् --</option>
              {subCommittees.map((subCommittee) => (
                <option
                  key={subCommittee.subCommitteeId}
                  value={subCommittee.subCommitteeId}
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
              स्तर:
            </label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedLevel(Number(e.target.value))
              }
              disabled={isLevelDisabled}
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">-- चयन गर्नुहोस् --</option>
              {levels.map((level) => (
                <option key={level.levelId} value={level.levelId}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>

          {/* Positions Checkboxes */}
          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              स्थिति:
            </label>
            <div className="space-y-2">
              {positions.map((position) => (
                <div key={position.positionId} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`position-${position.positionId}`}
                    value={position.positionId}
                    checked={selectedPosition === position.positionId}
                    onChange={() =>
                      setSelectedPosition((prev) =>
                        prev === position.positionId ? "" : position.positionId,
                      )
                    }
                    disabled={isPositionDisabled}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`position-${position.positionId}`}
                    className="text-sm text-black dark:text-white"
                  >
                    {position.positionName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isFormDisabled}
              className="rounded bg-primary px-4 py-2 text-white"
            >
              सबमिट
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembersForm;
