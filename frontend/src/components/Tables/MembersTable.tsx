"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

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
  committeeId: number;
  subCommitteeId?: number;
  positionId?: number;
  address: string;
}

const MembersTable = ({ singleMember }: { singleMember?: Member }) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch committees
        const committeesResponse = await axios.get<Committee[]>(
          "http://localhost:3000/committees",
        );
        setCommittees(committeesResponse.data);

        // Fetch levels data
        const levelsResponse = await axios.get<Level[]>(
          "http://localhost:3000/levels",
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
                `http://localhost:3000/sub-committees/committee/${committee.committeeId}`,
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
          "http://localhost:3000/sub-level",
        );
        setSubLevels(subLevelsResponse.data);

        // Fetch structures data
        const structuresResponses = await Promise.all(
          committeesResponse.data.flatMap(async (committee) => {
            try {
              const committeeStructuresResponse = await axios.get<Structure[]>(
                `http://localhost:3000/structures/committee/${committee.committeeId}`,
              );
              const committeeStructures = committeeStructuresResponse.data;

              const subCommitteesStructuresResponses = await Promise.all(
                (subCommittees[committee.committeeId] || []).map(async (sub) =>
                  axios.get<Structure[]>(
                    `http://localhost:3000/structures/subcommittee/${sub.subCommitteeId}`,
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
              `http://localhost:3000/positions/${positionId}`,
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
          "http://localhost:3000/members",
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

  // Helper function to get the level membernames based on committee and sub-committee
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

  // Helper function to get position membernames based on member's positionId
  const getPositionNames = (positionId?: number): string => {
    return positionId ? positions[positionId] || "-" : "-";
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // If singleMember is provided, display only that member
  const membersToDisplay = singleMember ? [singleMember] : members;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        सदस्य तालिका
      </h4>
      <div className="flex flex-col">
        <div className="grid grid-cols-8 rounded-sm bg-gray-2 dark:bg-meta-4">
          {[
            "क्रम संख्या",
            "सदस्य नाम",
            "मोबाइल नम्बर",
            "ईमेल",
            "समिति",
            "उपसमिति",
            "तह",
            "पदिय जिम्मेवारी",
            "ठेगाना",
          ].map((header, idx) => (
            <div key={idx} className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                {header}
              </h5>
            </div>
          ))}
        </div>
        {membersToDisplay.map((member, index) => {
          const committee = committees.find(
            (c) => c.committeeId === member.committeeId,
          );
          const subCommittee = member.subCommitteeId
            ? subCommittees[member.committeeId]?.find(
                (sub) => sub.subCommitteeId === member.subCommitteeId,
              )
            : null;

          return (
            <div
              className={`grid grid-cols-8 ${
                index === membersToDisplay.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={member.memberId}
            >
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{index + 1}</p>
              </div>
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {member.memberName}
                </p>
              </div>
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {member.mobileNumber}
                </p>
              </div>
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{member.email}</p>
              </div>
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {committee?.committeeName || "-"}
                </p>
              </div>
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {subCommittee?.subCommitteeName || "-"}
                </p>
              </div>
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {getLevelNames(
                    member.committeeId,
                    member.subCommitteeId || null,
                  )}
                </p>
              </div>
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {getPositionNames(member.positionId)}
                </p>
              </div>
              <div className="p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{member.address}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembersTable;
