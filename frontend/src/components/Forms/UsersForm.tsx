import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

const UsersForm: React.FC = () => {
  // New state variables for the additional fields
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [credits, setCredits] = useState<number>(0);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      username,
      password,
      role,
      credits,
    };

    try {
      await axios.post("http://localhost:3000/users", payload);
      console.log("Form submitted successfully");

      setUsername("");
      setPassword("");
      setRole("");
      setCredits(0);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full rounded-sm border border-stroke  bg-rose-100 shadow dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
      <div className="border-b border-stroke bg-rose-200 px-7 py-4 shadow dark:border-strokedark sm:rounded-lg">
        <h3 className="font-medium text-black dark:text-white">
          प्रयोगकर्ता विवरण प्रविष्टी फारम
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="username"
            >
              प्रयोगकर्ता:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Password Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="password"
            >
              पास्वर्ड:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="role"
            >
              रोल:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setRole(e.target.value)
              }
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">-- रोल चयन गर्नुहोस् --</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          {/* Credit Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="credits"
            >
              क्रेडिट:
            </label>
            <input
              type="text"
              id="credits"
              value={credits}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCredits(Number(e.target.value))
              }
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              placeholder="क्रेडिट भर्नुहोस्"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-white"
            >
              सबमिट
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersForm;
