"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import ResponsiveTable, { TableColumn, PaginationData } from "./ResponsiveTable";

interface User {
  userId: number;
  username: string;
  role: string;
  credits: number;
}

const UsersTable = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users data
        const usersResponse = await axios.get<User[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/users",
        );
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(process.env.NEXT_PUBLIC_BE_HOST + `/users/${userId}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId),
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUser = (userId: number) => {
    console.log("Updating user with ID:", userId);
    router.push(`/forms/updateUsersForm/${userId}`);
  };

  // Define table columns
  const columns: TableColumn<User>[] = [
    {
      key: 'username',
      label: 'प्रयोगकर्ता',
      searchable: true,
      className: 'font-medium',
    },
    {
      key: 'role',
      label: 'रोल',
      searchable: true,
    },
    {
      key: 'credits',
      label: 'क्रेडिट',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'सुधार',
      render: (_, user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateUser(user.userId)}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 text-sm"
            title="सम्पादन गर्नुहोस्"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteUser(user.userId)}
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
  const renderMobileCard = (user: User, index: number) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            {user.username}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.role}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateUser(user.userId)}
            className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 text-xs"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteUser(user.userId)}
            className="rounded bg-rose-500 px-2 py-1 text-white hover:bg-rose-600 text-xs"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-400">क्रेडिट: </span>
          <span className="text-black dark:text-white">{user.credits}</span>
        </div>
      </div>
    </div>
  );

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <ResponsiveTable
        data={users}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={searchTerm}
        title="प्रयोगकर्ता तालिका"
        keyExtractor={(user) => user.userId.toString()}
        mobileCardRender={renderMobileCard}
        emptyMessage="कुनै प्रयोगकर्ता भेटिएन"
      />
    </div>
  );
};

export default UsersTable;
