"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ResponsiveTable, { TableColumn, PaginationData } from "./ResponsiveTable";

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

interface SubLevel {
  committeeId: number;
  subCommitteeId: number;
  levelId: number;
}

interface Structure {
  committeeId: number;
  subCommitteeId: number;
  levelId: number;
  positionId: number;
}

interface Position {
  positionId: number;
  positionName: string;
}

const CommitteesTable = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<
    Record<number, SubCommittee[]>
  >({});
  const [levels, setLevels] = useState<Record<number, string>>({});
  const [subLevels, setSubLevels] = useState<SubLevel[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [positions, setPositions] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchCommittees = useCallback(async () => {
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

      const committeesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_HOST}/committees?${params.toString()}`
      );

      if (committeesResponse.data.data) {
        // Paginated response
        setCommittees(committeesResponse.data.data);
        setPagination({
          page: committeesResponse.data.page,
          limit: committeesResponse.data.limit,
          total: committeesResponse.data.total,
          totalPages: committeesResponse.data.totalPages,
        });
      } else {
        // Legacy response (all data)
        setCommittees(committeesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching committees:", error);
      setError("Failed to load committees data.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        // Fetch all committees first to get the base data
        const committeesResponse = await axios.get<Committee[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/committees",
        );

        // Fetch levels data
        const levelsResponse = await axios.get<Level[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/levels",
        );
        const levelsData = levelsResponse.data.reduce(
          (acc: Record<number, string>, level) => ({ ...acc, [level.levelId]: level.levelName }),
          {} as Record<number, string>,
        );
        setLevels(levelsData);

        // Fetch sub-committees for each committee
        const subCommitteesData = await Promise.all(
          committeesResponse.data.map(async (committee: Committee) => {
            try {
              const subResponse = await axios.get<SubCommittee[]>(
                process.env.NEXT_PUBLIC_BE_HOST + `/sub-committees/committee/${committee.committeeId}`,
              );
              return { [committee.committeeId]: subResponse.data };
            } catch {
              return { [committee.committeeId]: [] };
            }
          }),
        );
        const mergedSubCommittees = subCommitteesData.reduce(
          (acc: Record<number, SubCommittee[]>, curr: Record<number, SubCommittee[]>) => ({ ...acc, ...curr }),
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
          committeesResponse.data.flatMap(async (committee: Committee) => {
            try {
              const committeeStructuresResponse = await axios.get<Structure[]>(
                process.env.NEXT_PUBLIC_BE_HOST + `/structures/committee/${committee.committeeId}`,
              );
              const committeeStructures = committeeStructuresResponse.data;

              const subCommitteesStructuresResponses = await Promise.all(
                (mergedSubCommittees[committee.committeeId] || []).map(async (sub) =>
                  axios.get<Structure[]>(
                    process.env.NEXT_PUBLIC_BE_HOST + `/structures/subcommittee/${sub.subCommitteeId}`,
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
            structuresResponses.flat().map((structure: Structure) => structure.positionId),
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
          (acc: Record<number, string>, response) => ({
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
    fetchCommittees();
  }, [fetchCommittees]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Helper function to get the level names based on committee and sub-committee
  const getLevelNames = (
    committeeId: number,
    subCommitteeId: number | null,
  ) => {
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

  // Helper function to get position names based on structures
  const getPositionNames = (
    committeeId: number,
    subCommitteeId: number | null,
  ) => {
    const relevantStructures = structures.filter(
      (structure) =>
        structure.committeeId === committeeId &&
        (subCommitteeId === null ||
          structure.subCommitteeId === subCommitteeId),
    );

    const positionNames = relevantStructures
      .map((structure) => positions[structure.positionId] || "-")
      .join(", ");

    return positionNames || "-";
  };

  // Define table columns
  const columns: TableColumn<Committee>[] = [
    {
      key: 'committeeId',
      label: 'समिति आईडी',
      sortable: true,
      mobileHidden: true,
    },
    {
      key: 'committeeName',
      label: 'समिति को नाम',
      searchable: true,
      className: 'font-medium',
    },
    {
      key: 'subCommittees',
      label: 'उपसमिति',
      render: (_, committee) => 
        subCommittees[committee.committeeId]
          ?.map((sub) => sub.subCommitteeName)
          .join(", ") || "-",
      mobileHidden: true,
    },
    {
      key: 'levels',
      label: 'तह',
      render: (_, committee) => getLevelNames(committee.committeeId, null),
      mobileHidden: true,
    },
    {
      key: 'positions',
      label: 'स्थिति',
      render: (_, committee) => getPositionNames(committee.committeeId, null),
      mobileHidden: true,
    },
  ];

  // Mobile card rendering
  const renderMobileCard = (committee: Committee, index: number) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            {committee.committeeName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            आईडी: {committee.committeeId}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 text-sm">
        {subCommittees[committee.committeeId]?.length > 0 && (
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">उपसमिति: </span>
            <span className="text-black dark:text-white">
              {subCommittees[committee.committeeId]
                ?.map((sub) => sub.subCommitteeName)
                .join(", ")}
            </span>
          </div>
        )}
        
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-400">तह: </span>
          <span className="text-black dark:text-white">
            {getLevelNames(committee.committeeId, null)}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <ResponsiveTable
        data={committees}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={searchTerm}
        title="समिति तालिका"
        keyExtractor={(committee) => committee.committeeId.toString()}
        mobileCardRender={renderMobileCard}
        emptyMessage="कुनै समिति भेटिएन"
        showSerialNumber={false}
      />
    </div>
  );
};

export default CommitteesTable;
