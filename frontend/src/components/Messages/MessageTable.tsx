"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Message {
  messageId: number;
  from: string;
  to: string;
  text: string;
}

const MessagesTable = ({ singleMessage }: { singleMessage?: Message }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch messages data
        const messagesResponse = await axios.get<Message[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/messages",
        );
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await axios.delete(process.env.NEXT_PUBLIC_BE_HOST + `/messages/${messageId}`);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.messageId !== messageId),
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleUpdateMessage = (messageId: number) => {
    console.log("Updating member with ID:", messageId);
    router.push(`/forms/updateMessagesForm/${messageId}`);
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // If singleMessage is provided, display only that message
  const messagesToDisplay = singleMessage ? [singleMessage] : messages;

  return (
    <div className="overflow-x-auto">
      <div className="border-gray-700 dark:border-gray-700 min-w-[1500px] rounded-sm border bg-rose-100 p-6 px-5 pb-2.5 pt-6 shadow dark:bg-boxdark sm:rounded-lg sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          <span className="bg-lime-600">कार्यक्रम तालिका</span>
        </h4>
        <table className="min-w-full table-auto">
          <thead className="dark:bg-gray-700">
            <tr className="bg-slate-400">
              <th className="border-gray-700 w-2 border-2 px-4 py-2 font-bold text-black">
                क्रम संख्या
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                सन्देश पठाउने
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                सन्देश पाउने
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                सन्देश
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                सुधार
              </th>
            </tr>
          </thead>

          <tbody>
            {messagesToDisplay.map((message, index) => {
              return (
                <tr
                  key={message.messageId}
                  className={`${
                    index === messagesToDisplay.length - 1
                      ? ""
                      : "border-gray-700 border-b"
                  }`}
                >
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {index + 1}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {message.from}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {message.to}
                  </td>
                  <td className="border-2 px-4 py-2 text-center text-black">
                    {message.text}
                  </td>
                  <td className="border-gray-700 border-2 px-4 py-2 text-center">
                    <button
                      onClick={() => handleUpdateMessage(message.messageId)}
                      className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.messageId)}
                      className="mr-2 rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesTable;
