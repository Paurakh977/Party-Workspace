import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import AddressInput from "../Address/address";

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

  // New state for address
  const [address, setAddress] = useState("");

  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  const [remarks, setRemarks] = useState<string>("");

  // Handle address changes from AddressInput component
  const handleAddressChange = (newAddress: {
    address: string;
    province?: string;
    district?: string;
    municipality?: string;
    ward?: string;
  }) => {
    setAddress(newAddress.address);
    setProvince(newAddress.province || "");
    setDistrict(newAddress.district || "");
    setMunicipality(newAddress.municipality || "");
    setWard(newAddress.ward || "");
  };

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
      if (selectedCommittee || selectedSubCommittee) {
        try {
          let endpoint = "";

          if (selectedSubCommittee) {
            endpoint = process.env.NEXT_PUBLIC_BE_HOST + `/sub-level/sub-committee/${selectedSubCommittee}`;
          } else if (selectedCommittee) {
            endpoint = process.env.NEXT_PUBLIC_BE_HOST + `/sub-level/committee/${selectedCommittee}`;
          }

          if (endpoint) {
            const response = await axios.get<{ levelId: number }[]>(endpoint);
            const levelIds = response.data.map((level) => level.levelId);

            if (levelIds.length > 0) {
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
            endpoint = process.env.NEXT_PUBLIC_BE_HOST + `/structures/subcommittee/${selectedSubCommittee}`;
          } else if (selectedCommittee) {
            endpoint = process.env.NEXT_PUBLIC_BE_HOST + `/structures/committee/${selectedCommittee}`;
          }

          if (endpoint) {
            const response =
              await axios.get<{ positionId: number }[]>(endpoint);
            const positionIds = response.data.map(
              (position) => position.positionId,
            );

            if (positionIds.length > 0) {
              const positionsPromises = positionIds.map((id) =>
                axios.get<Position>(process.env.NEXT_PUBLIC_BE_HOST + `/positions/${id}`),
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
      province: province || null,
      district: district || null,
      municipality: municipality || null,
      ward: ward || null,
      remarks: remarks || null,
    };

    try {
      await axios.post(process.env.NEXT_PUBLIC_BE_HOST + "/members", payload);
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
      setRemarks("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full rounded-sm border border-stroke  bg-rose-100 shadow dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
      <div className="border-b border-stroke bg-rose-200 px-7 py-4 shadow dark:border-strokedark sm:rounded-lg">
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
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Phone Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="mobileNumber"
            >
              मोबाइल नम्बर:
            </label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMobileNumber(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
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
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
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
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Address Field (Updated AddressInput Component) */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="address"
            >
              ठेगाना:
            </label>
            <AddressInput onAddressChange={handleAddressChange} />
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
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
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
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
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
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
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
          {/* Remarks Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="representative"
            >
              कैफियत:
            </label>
            <input
              type="text"
              id="remarks"
              value={remarks}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRemarks(e.target.value)
              }
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              placeholder="कैफियत उल्लेख गर्नुहोस्"
            />
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
