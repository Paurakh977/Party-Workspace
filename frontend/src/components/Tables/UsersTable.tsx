"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";

interface User {
  userId: number;
  username: string;
  role: string;
  credits: number;
}

const UsersTable = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users data
        const usersResponse = await axios.get<User[]>(
          "http://localhost:3000/users",
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
      await axios.delete(`http://localhost:3000/users/${userId}`);
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

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <div className="border-gray-700 dark:border-gray-700 min-w-fit rounded-sm border bg-rose-100 p-6 px-5 pb-2.5 pt-6 shadow dark:bg-boxdark sm:rounded-lg sm:px-7.5 xl:pb-1">
        <h4 className="mb-6  text-xl font-semibold text-black dark:text-white">
          <span className="bg-lime-600">प्रयोगकर्ता तालिका</span>
        </h4>
        <table className="min-w-fit table-auto">
          <thead className="dark:bg-gray-700">
            <tr className="bg-slate-400">
              <th className="border-gray-700 w-2 border-2 px-4 py-2 font-bold text-black">
                क्रम संख्या
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                प्रयोगकर्ता
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                रोल
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                क्रेडिट
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                सुधार
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.userId}>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {index + 1}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {user.username}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {user.role}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center text-black">
                  {user.credits}
                </td>
                <td className="border-gray-700 border-2 px-4 py-2 text-center">
                  <button
                    onClick={() => handleUpdateUser(user.userId)}
                    className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.userId)}
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

export default UsersTable;
