"use client";

import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import RoleChecker from "../Role/role-checker";

interface Committee {
  committeeId: number;
  committeeName: string;
}

interface SubCommittee {
  subCommitteeId: number;
  subCommitteeName: string;
  committeeId: number;
}

interface Level {
  levelId: number;
  levelName: string;
}

interface SubLevel {
  committeeId: number;
  subCommitteeId: number;
  levelId: number;
}

interface Structure {
  structureId: number;
  committeeId: number;
  subCommitteeId: number;
  levelId: number;
  positionId: number;
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
  representative: string;
  committeeId: number;
  subCommitteeId?: number;
  positionId?: number;
  address: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  remarks: string;
}

const MembersFilteredTable = ({
  committeeId,
  subCommitteeId,
}: {
  committeeId: number;
  subCommitteeId: number | null;
}) => {
  const role = RoleChecker();
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<
    Record<number, SubCommittee[]>
  >({});
  const [levels, setLevels] = useState<Record<number, string>>({});
  const [subLevels, setSubLevels] = useState<SubLevel[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [positions, setPositions] = useState<Record<number, string>>({});
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCommitteeId, setSelectedCommitteeId] =
    useState<number>(committeeId);
  const [selectedSubCommitteeId, setSelectedSubCommitteeId] = useState<
    number | null
  >(subCommitteeId);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const router = useRouter();

  const exportToExcel = () => {
    // Prepare data for the export
    const exportData = filteredMembers.map((member) => ({
      "Member Name": member.memberName,
      Address: formatAddress(member),
      "Mobile Number": member.mobileNumber,
      Email: member.email,
      Representative: member.representative,
      Committee:
        committees.find(
          (committee) => committee.committeeId === member.committeeId,
        )?.committeeName || "-",
      "Sub-Committee": member.subCommitteeId
        ? subCommittees[member.committeeId]?.find(
            (sub) => sub.subCommitteeId === member.subCommitteeId,
          )?.subCommitteeName || "-"
        : "-",
      Level: getLevelNames(member.committeeId, member.subCommitteeId || null),
      Position: getPositionNames(member.positionId),
      Remarks: member.remarks,
    }));

    // Generate the file name based on the selected filters
    let fileName = "MembersData";

    if (selectedCommitteeId) {
      const committeeName =
        committees.find((c) => c.committeeId === selectedCommitteeId)
          ?.committeeName || "Committee";
      fileName += `_${committeeName}`;
    }

    if (selectedSubCommitteeId) {
      const subCommitteeName =
        subCommittees[selectedCommitteeId]?.find(
          (sub) => sub.subCommitteeId === selectedSubCommitteeId,
        )?.subCommitteeName || "SubCommittee";
      fileName += `_${subCommitteeName}`;
    }

    if (selectedProvince) {
      fileName += `_${selectedProvince}`;
    }
    if (selectedDistrict) {
      fileName += `_${selectedDistrict}`;
    }
    if (selectedMunicipality) {
      fileName += `_${selectedMunicipality}`;
    }
    if (selectedWard) {
      fileName += `_Ward${selectedWard}`;
    }

    // Final file name with .xlsx extension
    fileName += ".xlsx";

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    // Export the workbook with the dynamic file name
    XLSX.writeFile(workbook, fileName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch committees
        const committeesResponse = await axios.get<Committee[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/committees",
        );
        setCommittees(committeesResponse.data);

        // Fetch levels data
        const levelsResponse = await axios.get<Level[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/levels",
        );
        const levelsData = levelsResponse.data.reduce(
          (acc, level) => ({ ...acc, [level.levelId]: level.levelName }),
          {} as Record<number, string>,
        );
        setLevels(levelsData);

        // Fetch sub-committees for each committee
        const subCommitteesData = await Promise.all(
          committeesResponse.data.map(async (committee) => {
            try {
              const subResponse = await axios.get<SubCommittee[]>(
                process.env.NEXT_PUBLIC_BE_HOST +
                  `/sub-committees/committee/${committee.committeeId}`,
              );
              return { [committee.committeeId]: subResponse.data };
            } catch {
              return { [committee.committeeId]: [] };
            }
          }),
        );
        const mergedSubCommittees = subCommitteesData.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {} as Record<number, SubCommittee[]>,
        );
        setSubCommittees(mergedSubCommittees);

        // Fetch sub-levels data
        const subLevelsResponse = await axios.get<SubLevel[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/sub-level",
        );
        setSubLevels(subLevelsResponse.data);

        // Fetch structures data
        const structuresResponses = await Promise.all(
          committeesResponse.data.flatMap(async (committee) => {
            try {
              const committeeStructuresResponse = await axios.get<Structure[]>(
                process.env.NEXT_PUBLIC_BE_HOST +
                  `/structures/committee/${committee.committeeId}`,
              );
              const committeeStructures = committeeStructuresResponse.data;

              const subCommitteesStructuresResponses = await Promise.all(
                (subCommittees[committee.committeeId] || []).map(async (sub) =>
                  axios.get<Structure[]>(
                    process.env.NEXT_PUBLIC_BE_HOST +
                      `/structures/subcommittee/${sub.subCommitteeId}`,
                  ),
                ),
              );
              const subCommitteesStructures =
                subCommitteesStructuresResponses.flatMap(
                  (response) => response.data,
                );

              return [...committeeStructures, ...subCommitteesStructures];
            } catch {
              return [];
            }
          }),
        );
        setStructures(structuresResponses.flat());

        // Fetch positions data
        const positionIds = Array.from(
          new Set(
            structuresResponses.flat().map((structure) => structure.positionId),
          ),
        );
        const positionsResponses = await Promise.all(
          positionIds.map((positionId) =>
            axios.get<Position>(
              process.env.NEXT_PUBLIC_BE_HOST + `/positions/${positionId}`,
            ),
          ),
        );
        const positionsData = positionsResponses.reduce(
          (acc, response) => ({
            ...acc,
            [response.data.positionId]: response.data.positionName,
          }),
          {} as Record<number, string>,
        );
        setPositions(positionsData);

        // Fetch members data
        const membersResponse = await axios.get<Member[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/members",
        );
        setMembers(membersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMembers = members.filter((member) => {
    const committeeMatch = selectedCommitteeId
      ? member.committeeId === selectedCommitteeId
      : true;
    const subCommitteeMatch = selectedSubCommitteeId
      ? member.subCommitteeId === selectedSubCommitteeId
      : true;
    const provinceMatch = selectedProvince
      ? member.province === selectedProvince
      : true;
    const districtMatch = selectedDistrict
      ? member.district === selectedDistrict
      : true;
    const municipalityMatch = selectedMunicipality
      ? member.municipality === selectedMunicipality
      : true;
    const addressMatch = selectedAddress
      ? member.address === selectedAddress
      : true;
    const wardMatch = selectedWard ? member.ward === selectedWard : true;

    return (
      committeeMatch &&
      subCommitteeMatch &&
      provinceMatch &&
      districtMatch &&
      municipalityMatch &&
      addressMatch &&
      wardMatch
    );
  });
  // Helper function to get the level names based on committee and sub-committee
  const getLevelNames = (
    committeeId: number,
    subCommitteeId: number | null,
  ): string => {
    const relevantSubLevels = subLevels.filter(
      (subLevel) =>
        subLevel.committeeId === committeeId &&
        (subCommitteeId === null || subLevel.subCommitteeId === subCommitteeId),
    );

    return (
      relevantSubLevels
        .map((subLevel) => levels[subLevel.levelId] || "-")
        .join(", ") || "-"
    );
  };

  // Helper function to get position names based on member's positionId
  const getPositionNames = (positionId?: number): string => {
    return positionId ? positions[positionId] || "-" : "-";
  };

  // Helper function to format address
  const formatAddress = (member: Member): string => {
    const { municipality, ward, district, province, address } = member;
    if (!address) return `${municipality} - ${ward}, ${district}`;
    return `${municipality} - ${ward}, ${district} जिल्ला, ${province} प्रदेश, ${address}`;
  };

  const handleDeleteMember = async (memberId: number) => {
    try {
      await axios.delete(
        process.env.NEXT_PUBLIC_BE_HOST + `/members/${memberId}`,
      );
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.memberId !== memberId),
      );
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleUpdateMember = (memberId: number) => {
    console.log("Updating member with ID:", memberId);
    router.push(`/forms/updateMembersForm/${memberId}`);
    // router.push()
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleCommitteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const committeeId = parseInt(e.target.value);
    const committeeId = e.target.value ? parseInt(e.target.value) : 0;
    setSelectedCommitteeId(committeeId);
    setSelectedSubCommitteeId(null); // Reset sub-committee when committee changes
  };

  const handleSubCommitteeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const subCommitteeId = parseInt(e.target.value);
    setSelectedSubCommitteeId(subCommitteeId);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(e.target.value);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value || null);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value || null);
  };

  const handleMunicipalityChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedMunicipality(e.target.value || null);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWard(e.target.value || null);
  };

  // If singleMember is provided, display only that member
  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        {selectedCommitteeId &&
          subCommittees[selectedCommitteeId]?.length > 0 && (
            <>
              <label className="ml-4 mr-4">
                उप-समिति द्वारा फिल्टर गर्नुहोस्:
              </label>
              <select
                value={selectedSubCommitteeId ?? ""}
                onChange={handleSubCommitteeChange}
                className="rounded border p-2"
              >
                <option value="">सबै उप-समिति</option>
                {subCommittees[selectedCommitteeId].map((subCommittee) => (
                  <option
                    key={subCommittee.subCommitteeId}
                    value={subCommittee.subCommitteeId}
                  >
                    {subCommittee.subCommitteeName}
                  </option>
                ))}
              </select>
            </>
          )}

        {/* Filters for Address (Country), Province, District, Municipality */}
        <label className="ml-4 mr-4">देश द्वारा फिल्टर गर्नुहोस्:</label>
        <select
          value={selectedAddress ?? ""}
          onChange={handleAddressChange}
          className="rounded border p-2"
        >
          <option value="">सबै देश</option>
          {members.length > 0 &&
            Array.from(new Set(members.map((member) => member.address))).map(
              (address) => (
                <option key={address} value={address}>
                  {address}
                </option>
              ),
            )}
        </select>

        <label className="ml-4 mr-4">प्रदेश द्वारा फिल्टर गर्नुहोस्:</label>
        <select
          value={selectedProvince ?? ""}
          onChange={handleProvinceChange}
          className="rounded border p-2"
        >
          <option value="">सबै प्रदेश</option>
          {members.length > 0 &&
            Array.from(new Set(members.map((member) => member.province))).map(
              (province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ),
            )}
        </select>

        <label className="ml-4 mr-4">जिल्ला द्वारा फिल्टर गर्नुहोस्:</label>
        <select
          value={selectedDistrict ?? ""}
          onChange={handleDistrictChange}
          className="rounded border p-2"
        >
          <option value="">सबै जिल्ला</option>
          {members.length > 0 &&
            Array.from(new Set(members.map((member) => member.district))).map(
              (district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ),
            )}
        </select>

        <label className="ml-4 mr-4">नगरपालिका द्वारा फिल्टर गर्नुहोस्:</label>
        <select
          value={selectedMunicipality ?? ""}
          onChange={handleMunicipalityChange}
          className="rounded border p-2"
        >
          <option value="">सबै नगरपालिका</option>
          {members.length > 0 &&
            Array.from(
              new Set(members.map((member) => member.municipality)),
            ).map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
        </select>

        <label className="ml-4 mr-4">वडा द्वारा फिल्टर गर्नुहोस्:</label>
        <select
          value={selectedWard ?? ""}
          onChange={handleWardChange}
          className="rounded border p-2"
        >
          <option value="">सबै वडा</option>
          {members.length > 0 &&
            Array.from(new Set(members.map((member) => member.ward))).map(
              (ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ),
            )}
        </select>
      </div>

      {role === "superadmin" && (
        <div className="mb-4">
          <button
            onClick={exportToExcel}
            className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            <FaFileExcel className="mr-2" />
            <span>Export to Excel</span>
          </button>
        </div>
      )}

      <div className="border-gray-700 dark:border-gray-700 min-w-[1500px] rounded-sm border bg-rose-100 p-6 px-5 pb-2.5 pt-6 shadow dark:bg-boxdark sm:rounded-lg sm:px-7.5 xl:pb-1">
        <h4 className="mb-6  text-xl font-semibold text-black dark:text-white">
          <span className="bg-lime-600">सदस्य तालिका</span>
        </h4>
        <table className="min-w-full table-auto">
          <thead className="dark:bg-gray-700">
            <tr className="bg-slate-400">
              {/* Table headers */}
              <th className="border-gray-700 w-2 border-2 px-4 py-2 font-bold text-black">
                क्रम संख्या
              </th>
              <th className="border-gray-700 w-45 border-2 px-4 py-2 font-bold text-black">
                नामथर
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                ठेगाना
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                मोबाइल नम्बर
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                ईमेल
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                प्रतिनिधि
              </th>
              <th className="border-gray-700 w-25 border-2 px-4 py-2 font-bold text-black">
                समिति
              </th>
              <th className="border-gray-700 w-35 border-2 px-4 py-2 font-bold text-black">
                उप-समिति
              </th>
              <th className="border-gray-700 w-45 border-2 px-4 py-2 font-bold text-black">
                तह
              </th>
              <th className="border-gray-700 w-35 border-2 px-4 py-2 font-bold text-black">
                पद
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                कैफियत
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                सुधार
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, index) => (
              <tr key={member.memberId}>
                {/* Table rows */}
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {index + 1}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {member.memberName}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {formatAddress(member)}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {member.mobileNumber}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {member.email}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {member.representative}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {committees.find(
                    (committee) => committee.committeeId === member.committeeId,
                  )?.committeeName || "-"}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {member.subCommitteeId
                    ? subCommittees[member.committeeId]?.find(
                        (sub) => sub.subCommitteeId === member.subCommitteeId,
                      )?.subCommitteeName || "-"
                    : "-"}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {getLevelNames(
                    member.committeeId,
                    member.subCommitteeId || null,
                  )}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {getPositionNames(member.positionId)}
                </td>
                <td className="border-2 px-4 py-2 text-center text-black">
                  {member.remarks}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center">
                  <button
                    onClick={() => handleUpdateMember(member.memberId)}
                    className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.memberId)}
                    className="mr-2 rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersFilteredTable;
