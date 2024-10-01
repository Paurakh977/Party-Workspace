import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import AddressInput from "@/components/Address/address";
import { useRouter } from "next/navigation";

interface UpdateMembersFormProps {
  memberId: number;
}

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

interface Member {
  memberId: number;
  memberName: string;
  mobileNumber: string;
  email: string;
  committeeId: number | null;
  subCommitteeId: number | null;
  levelId: number | null;
  positionId: number | null;
  address: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  remarks: string;
}

const UpdateMemberPage: React.FC<UpdateMembersFormProps> = ({ memberId }) => {
  const router = useRouter();
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<SubCommittee[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [member, setMember] = useState<Member | null>(null);

  const [selectedCommittee, setSelectedCommittee] = useState<number | "">("");
  const [selectedSubCommittee, setSelectedSubCommittee] = useState<number | "">(
    "",
  );
  const [selectedLevel, setSelectedLevel] = useState<number | "">("");
  const [selectedPosition, setSelectedPosition] = useState<number | "">("");

  const [address, setAddress] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  const [remarks, setRemarks] = useState<string>("");

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

  // Fetch committees
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await axios.get<Committee[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/committees",
        );
        console.log("Fetched committees:", response.data);
        setCommittees(response.data);
        console.log("memberId:", memberId);
      } catch (error) {
        console.error("Error fetching committees:", error);
      }
    };
    fetchCommittees();
  }, []);

  // Fetch member data by memberId
  useEffect(() => {
    console.log(memberId);
    if (memberId) {
      const fetchMember = async () => {
        try {
          const response = await axios.get<Member>(
            process.env.NEXT_PUBLIC_BE_HOST + `/members/${memberId}`,
          );
          const memberData = response.data;
          console.log("Fetched member:", memberData);
          setMember(memberData);

          setSelectedCommittee(memberData.committeeId || "");
          setSelectedSubCommittee(memberData.subCommitteeId || "");
          setSelectedLevel(memberData.levelId || "");
          setSelectedPosition(memberData.positionId || "");

          setProvince(memberData.province || "");
          setDistrict(memberData.district || "");
          setMunicipality(memberData.municipality || "");
          setWard(memberData.ward || "");
          setRemarks(memberData.remarks || "");
        } catch (error) {
          console.error("Error fetching member data:", error);
        }
      };
      fetchMember();
    }
  }, [memberId]);

  // Fetch sub-committees when committee changes
  useEffect(() => {
    const fetchSubCommittees = async () => {
      if (selectedCommittee) {
        try {
          const response = await axios.get<SubCommittee[]>(
            process.env.NEXT_PUBLIC_BE_HOST + `/sub-committees/committee/${selectedCommittee}`,
          );
          console.log("Fetched sub-committees:", response.data);
          setSubCommittees(response.data);
        } catch (error) {
          console.error("Error fetching sub-committees:", error);
        }
      }
    };
    fetchSubCommittees();
  }, [selectedCommittee]);

  // Fetch levels when sub-committee or committee changes
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
            console.log("Fetched level IDs:", levelIds);

            if (levelIds.length > 0) {
              const levelsResponse = await axios.get<Level[]>(
                process.env.NEXT_PUBLIC_BE_HOST + "/levels",
              );
              const filteredLevels = levelsResponse.data.filter((level) =>
                levelIds.includes(level.levelId),
              );
              console.log("Filtered levels:", filteredLevels);
              setLevels(filteredLevels);
            } else {
              setLevels([]);
            }
          } else {
            setLevels([]);
          }
        } catch (error) {
          console.error("Error fetching levels:", error);
        }
      } else {
        setLevels([]);
      }
    };
    fetchLevels();
  }, [selectedSubCommittee, selectedCommittee]);

  // Fetch positions when level changes
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
            console.log("Fetched position IDs:", positionIds);

            if (positionIds.length > 0) {
              const positionsPromises = positionIds.map((id) =>
                axios.get<Position>(process.env.NEXT_PUBLIC_BE_HOST + `/positions/${id}`),
              );
              const positionsResponses = await Promise.all(positionsPromises);
              const filteredPositions = positionsResponses.map(
                (res) => res.data,
              );
              console.log("Filtered positions:", filteredPositions);
              setPositions(filteredPositions);
            } else {
              setPositions([]);
            }
          } else {
            setPositions([]);
          }
        } catch (error) {
          console.error("Error fetching positions:", error);
        }
      } else {
        setPositions([]);
      }
    };
    fetchPositions();
  }, [selectedLevel]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!member) return;

    const payload = {
      memberName: member.memberName,
      mobileNumber: member.mobileNumber,
      email: member.email,
      committeeId: selectedCommittee !== "" ? selectedCommittee : null,
      subCommitteeId: selectedSubCommittee !== "" ? selectedSubCommittee : null,
      levelId: selectedLevel !== "" ? selectedLevel : null,
      positionId: selectedPosition !== "" ? selectedPosition : null,
      province,
      district,
      municipality,
      ward,
      remarks,
    };

    console.log("Submitting payload:", payload);

    try {
      await axios.put(process.env.NEXT_PUBLIC_BE_HOST + `/members/${memberId}`, payload);
      console.log("Member updated successfully");
      router.push("/tables/membersTable");
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  if (!memberId || !member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full rounded border  bg-rose-100 shadow  dark:bg-boxdark">
      <div className="rounded border-b bg-rose-200 px-7 py-4 shadow ">
        <h3 className="font-medium text-black dark:text-white">
          सदस्य विवरण अद्यावधिक गर्नुहोस्
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {/* Member Fields */}
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
              value={member.memberName}
              onChange={(e) =>
                setMember((prev) =>
                  prev ? { ...prev, memberName: e.target.value } : null,
                )
              }
              className="border-gray-300 w-full rounded border px-4 py-2 text-black"
            />
          </div>

          {/* Mobile Number Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="mobileNumber"
            >
              मोबाइल नम्बर:
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={member.mobileNumber}
              onChange={(e) =>
                setMember((prev) =>
                  prev ? { ...prev, mobileNumber: e.target.value } : null,
                )
              }
              required={true}
              className="border-gray-300 w-full rounded border px-4 py-2 text-black"
            />
          </div>

          {/* Email Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="email"
            >
              ईमेल:
            </label>
            <input
              type="text"
              id="email"
              value={member.email}
              onChange={(e) =>
                setMember((prev) =>
                  prev ? { ...prev, email: e.target.value } : null,
                )
              }
              className="border-gray-300 w-full rounded border px-4 py-2 text-black"
            />
          </div>

          {/* Representative Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="email"
            >
              प्रतिनिधि:
            </label>
            <input
              type="text"
              id="email"
              value={member.email}
              onChange={(e) =>
                setMember((prev) =>
                  prev ? { ...prev, email: e.target.value } : null,
                )
              }
              className="border-gray-300 w-full rounded border px-4 py-2 text-black"
            />
          </div>

          {/* Address Input */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="subCommittee"
            >
              ठेगाना:
            </label>

            <AddressInput
              initialAddress={member.address}
              initialProvince={member.province}
              initialDistrict={member.district}
              initialMunicipality={member.municipality}
              initialWard={member.ward}
              onAddressChange={handleAddressChange}
            />
          </div>

          {/* Committee dropdown */}
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
              onChange={(e) => setSelectedCommittee(Number(e.target.value))}
              className={`w-full rounded border bg-white px-4 py-2 ${
                selectedCommittee === "" ? "text-gray-500" : "text-black"
              }`}
            >
              <option value="">समिति चयन गर्नुहोस्</option>
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

          {/* Sub-committee dropdown */}
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
              disabled={!selectedCommittee}
              onChange={(e) => setSelectedSubCommittee(Number(e.target.value))}
              className={`w-full rounded border bg-white px-4 py-2 ${
                selectedSubCommittee === "" ? "text-gray-500" : "text-black"
              }${!selectedCommittee ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
            >
              <option value="">उपसमिति चयन गर्नुहोस्</option>
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

          {/* Level Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="level"
            >
              स्तर चयन गर्नुहोस्:
            </label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="border-gray-300 w-full rounded border px-4 py-2 text-black"
            >
              <option value="">स्तर चयन गर्नुहोस्</option>
              {levels.map((level) => (
                <option key={level.levelId} value={level.levelId}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>

          {/* Positions Checkboxes */}
          {/* Positions Checkboxes */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="positions"
            >
              स्थिति चयन गर्नुहोस्:
            </label>
            <div className="flex flex-wrap">
              {positions.length > 0 ? (
                positions.map((position) => (
                  <div key={position.positionId} className="mr-4">
                    <input
                      type="checkbox"
                      id={`position-${position.positionId}`}
                      value={position.positionId}
                      checked={selectedPosition === position.positionId}
                      onChange={(e) => {
                        const positionId = Number(e.target.value);
                        setSelectedPosition(positionId);
                      }}
                    />
                    <label
                      htmlFor={`position-${position.positionId}`}
                      className="ml-2 text-sm text-black dark:text-white"
                    >
                      {position.positionName}
                    </label>
                  </div>
                ))
              ) : (
                <div>Positions not available</div>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="remarks"
            >
              टिप्पणी:
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="border-gray-300 w-full rounded border px-4 py-2 text-black"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full rounded bg-blue-500 py-2 text-white"
          >
            अद्यावधिक गर्नुहोस्
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMemberPage;
