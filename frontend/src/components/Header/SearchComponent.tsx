"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const SearchComponent = () => {
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    if (!mobileNumber.trim()) return;
    setLoading(true);
    setError(null);
    try {
      router.push(`/search-result?mobileNumber=${mobileNumber}`);
    } catch (error) {
      setError("Failed to navigate to the search result page.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center rounded-full border border-gray-300 bg-white/90 px-3 py-2 shadow-sm ring-0 focus-within:border-gray-400 dark:border-gray-700 dark:bg-gray-800">
        <Search className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter mobile number"
          className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-400"
        />
        <button
          onClick={handleSearch}
          className="ml-2 inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
        >
          Search
        </button>
      </div>
      {loading && <p className="mt-1 text-xs text-gray-500">Loading...</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SearchComponent;
