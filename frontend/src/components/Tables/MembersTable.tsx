"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import RoleChecker from "../Role/role-checker";
import ResponsiveTable, { TableColumn, PaginationData } from "./ResponsiveTable";

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

const MembersTable = ({ singleMember }: { singleMember?: Member }) => {
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

  const [selectedCommitteeId, setSelectedCommitteeId] = useState<number | null>(
    null,
  );
  const [selectedSubCommitteeId, setSelectedSubCommitteeId] = useState<
    number | null
  >(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  const exportToExcel = async (exportAll = false) => {
    try {
      let membersToExport = filteredMembers;
      
      if (exportAll) {
        // Fetch all members for export
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        if (selectedCommitteeId) {
          params.append('committeeId', selectedCommitteeId.toString());
        }
        if (selectedSubCommitteeId) {
          params.append('subCommitteeId', selectedSubCommitteeId.toString());
        }
        if (selectedProvince) {
          params.append('province', selectedProvince);
        }
        if (selectedDistrict) {
          params.append('district', selectedDistrict);
        }
        if (selectedMunicipality) {
          params.append('municipality', selectedMunicipality);
        }
        if (selectedAddress) {
          params.append('country', selectedAddress);
        }
        
        // Set a large limit to get all data
        params.append('limit', '10000');
        params.append('page', '1');

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_HOST}/members?${params.toString()}`
        );
        
        membersToExport = response.data.data || response.data;
      }

      // Prepare data for the export
      const exportData = membersToExport.map((member, index) => ({
        "S.N": index + 1,
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

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

      // Generate filename based on export type
      const fileName = exportAll ? "AllMembersData.xlsx" : "MembersData.xlsx";

      // Export the workbook
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedCommitteeId) {
        params.append('committeeId', selectedCommitteeId.toString());
      }

      if (selectedSubCommitteeId) {
        params.append('subCommitteeId', selectedSubCommitteeId.toString());
      }

      if (selectedProvince) {
        params.append('province', selectedProvince);
      }

      if (selectedDistrict) {
        params.append('district', selectedDistrict);
      }

      if (selectedMunicipality) {
        params.append('municipality', selectedMunicipality);
      }

      if (selectedAddress) {
        params.append('country', selectedAddress);
      }

      const membersResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_HOST}/members?${params.toString()}`
      );

      if (membersResponse.data.data) {
        // Paginated response
        setMembers(membersResponse.data.data);
        setPagination({
          page: membersResponse.data.page,
          limit: membersResponse.data.limit,
          total: membersResponse.data.total,
          totalPages: membersResponse.data.totalPages,
        });
      } else {
        // Legacy response (all data)
        setMembers(membersResponse.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setError("Failed to load members data.");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    searchTerm,
    selectedCommitteeId,
    selectedSubCommitteeId,
    selectedProvince,
    selectedDistrict,
    selectedMunicipality,
    selectedAddress,
  ]);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        // Fetch only the data needed for display (committees, levels, positions)
        const [
          committeesResponse,
          levelsResponse,
          subLevelsResponse,
        ] = await Promise.all([
          axios.get<Committee[]>(process.env.NEXT_PUBLIC_BE_HOST + "/committees"),
          axios.get<Level[]>(process.env.NEXT_PUBLIC_BE_HOST + "/levels"),
          axios.get<SubLevel[]>(process.env.NEXT_PUBLIC_BE_HOST + "/sub-level"),
        ]);

        setCommittees(committeesResponse.data);

        const levelsData = levelsResponse.data.reduce(
          (acc, level) => ({ ...acc, [level.levelId]: level.levelName }),
          {} as Record<number, string>,
        );
        setLevels(levelsData);
        setSubLevels(subLevelsResponse.data);

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
                (mergedSubCommittees[committee.committeeId] || []).map(async (sub) =>
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
      } catch (error) {
        console.error("Error fetching static data:", error);
        setError("Failed to load static data.");
      }
    };

    fetchStaticData();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Client-side filtering logic (same as MembersFilteredTable)
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

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

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

  const handleCommitteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const committeeId = parseInt(e.target.value);
    const committeeId = e.target.value ? parseInt(e.target.value) : null;
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
    setSelectedDistrict(null); // Reset district when province changes
    setSelectedMunicipality(null); // Reset municipality when province changes
    setSelectedWard(null); // Reset ward when province changes
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value || null);
    setSelectedMunicipality(null); // Reset municipality when district changes
    setSelectedWard(null); // Reset ward when district changes
  };

  const handleMunicipalityChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedMunicipality(e.target.value || null);
    setSelectedWard(null); // Reset ward when municipality changes
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWard(e.target.value || null);
  };


  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Define table columns
  const columns: TableColumn<Member>[] = [
    {
      key: 'memberName',
      label: 'नामथर',
      searchable: true,
      className: 'font-medium',
    },
    {
      key: 'address',
      label: 'ठेगाना',
      render: (_, member) => formatAddress(member),
      mobileHidden: false,
    },
    {
      key: 'mobileNumber',
      label: 'मोबाइल नम्बर',
      searchable: true,
    },
    {
      key: 'email',
      label: 'ईमेल',
      searchable: true,
      mobileHidden: true,
    },
    {
      key: 'representative',
      label: 'प्रतिनिधि',
      mobileHidden: true,
    },
    {
      key: 'committee',
      label: 'समिति',
      render: (_, member) => 
        committees.find(c => c.committeeId === member.committeeId)?.committeeName || '-',
    },
    {
      key: 'subCommittee',
      label: 'उप-समिति',
      render: (_, member) => 
        member.subCommitteeId
          ? subCommittees[member.committeeId]?.find(sub => sub.subCommitteeId === member.subCommitteeId)?.subCommitteeName || '-'
          : '-',
      mobileHidden: true,
    },
    {
      key: 'level',
      label: 'तह',
      render: (_, member) => getLevelNames(member.committeeId, member.subCommitteeId || null),
      mobileHidden: true,
    },
    {
      key: 'position',
      label: 'पद',
      render: (_, member) => getPositionNames(member.positionId),
      mobileHidden: true,
    },
    {
      key: 'remarks',
      label: 'कैफियत',
      mobileHidden: true,
    },
    {
      key: 'actions',
      label: 'सुधार',
      render: (_, member) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateMember(member.memberId)}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 text-sm"
            title="सम्पादन गर्नुहोस्"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteMember(member.memberId)}
            className="rounded bg-rose-500 px-3 py-1 text-white hover:bg-rose-600 text-sm"
            title="मेटाउनुहोस्"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  // Mobile card rendering
  const renderMobileCard = (member: Member, index: number) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            {member.memberName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {member.mobileNumber}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateMember(member.memberId)}
            className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 text-xs"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteMember(member.memberId)}
            className="rounded bg-rose-500 px-2 py-1 text-white hover:bg-rose-600 text-xs"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-400">ठेगाना: </span>
          <span className="text-black dark:text-white">{formatAddress(member)}</span>
        </div>
        
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-400">समिति: </span>
          <span className="text-black dark:text-white">
            {committees.find(c => c.committeeId === member.committeeId)?.committeeName || '-'}
          </span>
        </div>
        
        {member.subCommitteeId && (
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">उप-समिति: </span>
            <span className="text-black dark:text-white">
              {subCommittees[member.committeeId]?.find(sub => sub.subCommitteeId === member.subCommitteeId)?.subCommitteeName || '-'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const membersToDisplay = singleMember ? [singleMember] : filteredMembers;

  return (
    <div className="w-full">
      {/* Advanced Filters */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-meta-4 rounded-lg">
        <h5 className="text-lg font-medium mb-4 text-black dark:text-white">फिल्टर विकल्पहरू</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Committee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              समिति
            </label>
            <select
              value={selectedCommitteeId ?? ""}
              onChange={handleCommitteeChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              <option value="">सबै समिति</option>
              {committees.map((committee) => (
                <option key={committee.committeeId} value={committee.committeeId}>
                  {committee.committeeName}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-committee Filter */}
          {selectedCommitteeId && subCommittees[selectedCommitteeId]?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                उप-समिति
              </label>
              <select
                value={selectedSubCommitteeId ?? ""}
                onChange={handleSubCommitteeChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
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
            </div>
          )}

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              देश
            </label>
            <select
              value={selectedAddress ?? ""}
              onChange={handleAddressChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              <option value="">सबै देश</option>
              {Array.from(new Set(members.map((member) => member.address)))
                .filter(Boolean)
                .map((address) => (
                  <option key={address} value={address}>
                    {address}
                  </option>
                ))}
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              प्रदेश
            </label>
            <select
              value={selectedProvince ?? ""}
              onChange={handleProvinceChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              <option value="">सबै प्रदेश</option>
              {Array.from(new Set(members.map((member) => member.province)))
                .filter(Boolean)
                .map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              जिल्ला
            </label>
            <select
              value={selectedDistrict ?? ""}
              onChange={handleDistrictChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              <option value="">सबै जिल्ला</option>
              {Array.from(new Set(
                members
                  .filter((member) => !selectedProvince || member.province === selectedProvince)
                  .map((member) => member.district)
              ))
                .filter(Boolean)
                .map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>

          {/* Municipality Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              नगरपालिका
            </label>
            <select
              value={selectedMunicipality ?? ""}
              onChange={handleMunicipalityChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              <option value="">सबै नगरपालिका</option>
              {Array.from(new Set(
                members
                  .filter((member) => 
                    (!selectedProvince || member.province === selectedProvince) &&
                    (!selectedDistrict || member.district === selectedDistrict)
                  )
                  .map((member) => member.municipality)
              ))
                .filter(Boolean)
                .map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
            </select>
          </div>

          {/* Ward Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              वडा
            </label>
            <select
              value={selectedWard ?? ""}
              onChange={handleWardChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              <option value="">सबै वडा</option>
              {Array.from(new Set(
                members
                  .filter((member) => 
                    (!selectedProvince || member.province === selectedProvince) &&
                    (!selectedDistrict || member.district === selectedDistrict) &&
                    (!selectedMunicipality || member.municipality === selectedMunicipality)
                  )
                  .map((member) => member.ward)
              ))
                .filter(Boolean)
                .map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
            </select>
          </div>

        </div>
      </div>

      {/* Responsive Table */}
      <ResponsiveTable
        data={membersToDisplay}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={searchTerm}
        title="सदस्य तालिका"
        keyExtractor={(member) => member.memberId.toString()}
        mobileCardRender={renderMobileCard}
        emptyMessage="कुनै सदस्य भेटिएन"
        showSerialNumber={true}
        actions={
          role === "superadmin" ? (
            <div className="flex space-x-2">
              <button
                onClick={() => exportToExcel(false)}
                className="flex items-center space-x-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 text-sm font-medium"
                title="Current page data export"
              >
                <FaFileExcel />
                <span>Current Page</span>
              </button>
              <button
                onClick={() => exportToExcel(true)}
                className="flex items-center space-x-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 text-sm font-medium"
                title="All data export"
              >
                <FaFileExcel />
                <span>All Data</span>
              </button>
            </div>
          ) : undefined
        }
      />
    </div>
  );
};

export default MembersTable;
