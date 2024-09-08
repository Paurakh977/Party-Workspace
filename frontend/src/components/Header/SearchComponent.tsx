"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import the app router hook

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
      // Navigate to the search-result page, passing the mobile number in the query
      router.push(`/search-result?mobileNumber=${mobileNumber}`);
    } catch (error) {
      setError("Failed to navigate to the search result page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-form">
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Enter mobile number"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchComponent;
