"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

const SearchComponent = () => {
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const router = useRouter(); // Initialize the router
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    if (!mobileNumber.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Mobile number", mobileNumber);
      // Navigate to the search-result page, passing the mobile number in the query
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
    <div className="search-container">
      <span className="border-gray-300 flex items-center rounded-lg border bg-white">
        {/* Search Icon */}
        <FaSearch className="text-gray-500 mx-2" />

        {/* Search Input */}
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          onKeyDown={handleKeyPress} // Trigger search on Enter key press
          placeholder="Enter mobile number"
          className="search-input w-full px-3 py-2 focus:outline-none"
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="search-button rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </span>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchComponent;
