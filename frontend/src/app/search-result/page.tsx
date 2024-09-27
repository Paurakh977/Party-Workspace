"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import MembersTable from "@/components/Tables/MembersTable"; // Adjust the import if needed
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Member {
  memberId: number;
  memberName: string;
  mobileNumber: string;
  email: string;
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

const SearchResultPage = () => {
  const searchParams = useSearchParams();
  const mobileNumber = searchParams.get("mobileNumber"); // Get mobile number from URL query
  const [searchResult, setSearchResult] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!mobileNumber) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<Member>(
          `http://localhost:3000/members/mobileNumber/${mobileNumber}`,
        );
        setSearchResult(response.data);
      } catch (error) {
        setError("Failed to fetch member details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [mobileNumber]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!searchResult) return <p>No member found with that mobile number.</p>;

  return (
    <DefaultLayout>
      <div className="search-result-container">
        {/* Pass the search result to the MembersTable component */}
        <MembersTable singleMember={searchResult} />
      </div>
    </DefaultLayout>
  );
};

export default SearchResultPage;
