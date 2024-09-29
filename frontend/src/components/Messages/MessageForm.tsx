import axios from "axios";
import React, { FormEvent, useState, useEffect, ChangeEvent } from "react";
import AddressInput from "../Address/address";
import CreditsChecker from "../Credits/credits-checker";
import CreditsDeduct from "../Credits/credits-deduct";

interface MessageFormProps {
  eventDetails: string;
  eventOrganizer: string;
}

interface Committee {
  committeeId: number;
  committeeName: string;
}

interface SubCommittee {
  subCommitteeId: number;
  subCommitteeName: string;
}

const MessageForm: React.FC<MessageFormProps> = ({
  eventDetails,
  eventOrganizer,
}) => {
  const [token, setToken] = useState<string>("CCRfjs0IZfeyZsOAFWxl");
  const [from, setFrom] = useState<string>(eventOrganizer);
  const [to, setTo] = useState<string>("");
  const [text, setText] = useState<string>(eventDetails);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<SubCommittee[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<number | "">("");
  const [selectedSubCommittee, setSelectedSubCommittee] = useState<number | "">(
    "",
  );
  const [address, setAddress] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  const [isSubCommitteeDisabled, setIsSubCommitteeDisabled] =
    useState<boolean>(false);

  const [recipientType, setRecipientType] = useState<string>("समिति/उप‍-समिति");

  const [charCount, setCharCount] = useState<number>(eventDetails.length);

  const handleAddressChange = (newAddress: {
    address?: string;
    province?: string;
    district?: string;
    municipality?: string;
    ward?: string;
  }) => {
    setAddress(newAddress.address || "");
    setProvince(newAddress.province || "");
    setDistrict(newAddress.district || "");
    setMunicipality(newAddress.municipality || "");
    setWard(newAddress.ward || "");
  };

  // Fetch committees data from API on component mount
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await axios.get<Committee[]>(
          "http://localhost:3000/committees",
        );
        setCommittees(response.data);
        setIsFormDisabled(response.data.length === 0);
      } catch (error) {
        console.error("Error fetching committees:", error);
        setIsFormDisabled(true);
      }
    };

    fetchCommittees();
  }, [selectedCommittee, selectedSubCommittee]);

  // Fetch sub-committees data when a committee is selected
  useEffect(() => {
    const fetchSubCommittees = async () => {
      if (selectedCommittee) {
        try {
          const response = await axios.get<SubCommittee[]>(
            `http://localhost:3000/sub-committees/committee/${selectedCommittee}`,
          );
          setSubCommittees(response.data);
          setIsSubCommitteeDisabled(response.data.length === 0); // Disable if no sub-committees
        } catch (error) {
          console.error("Error fetching sub-committees:", error);
          setIsSubCommitteeDisabled(true); // Disable on error
        }
      } else {
        setSubCommittees([]);
        setIsSubCommitteeDisabled(true); // Disable if no committee selected
      }
    };

    fetchSubCommittees();
  }, [selectedCommittee]);

  const isEnglishText = (text: string): boolean => {
    return /^[\x00-\x7F]*$/.test(text); // Check if all characters are ASCII (English)
  };

  // Function to calculate message count
  const calculateMessageCount = (text: string): number => {
    let messageCount = 1;

    if (isEnglishText(text)) {
      // English characters
      if (text.length <= 120) {
        messageCount = 1;
      } else {
        messageCount = 1 + Math.ceil((text.length - 120) / 90);
      }
    } else {
      // Nepali/Unicode characters
      if (text.length <= 60) {
        messageCount = 1;
      } else {
        messageCount = 1 + Math.ceil((text.length - 60) / 40);
      }
    }

    return messageCount;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const messageCount = calculateMessageCount(text);

    if (text.length > 60) {
      alert("सन्देश ६० अक्षर भन्दा बढी छ । कृपया छोट्याउनुहोस् ।");
      return;
    }

    if (recipientType === "समिति/उप‍-समिति") {
      if (selectedSubCommittee) {
        const response = await axios.get(
          `http://localhost:3000/members-finder/subcommittee/${selectedSubCommittee}`,
        );
        setTo(String(response.data));
      } else if (selectedCommittee) {
        const response = await axios.get(
          `http://localhost:3000/members-finder/committee/${selectedCommittee}`,
        );
        setTo(String(response.data));
      }
    } else {
      if (address === "नेपाल" || address === "अन्य") {
        if (municipality) {
          const encodedMun = encodeURIComponent(municipality);
          const response = await axios.get(
            `http://localhost:3000/members-finder/municipality/${encodedMun}`,
          );
          setTo(String(response.data));
        } else if (district) {
          const encodedDis = encodeURIComponent(district);
          const response = await axios.get(
            `http://localhost:3000/members-finder/district/${encodedDis}`,
          );
          setTo(String(response.data));
        } else if (province) {
          const encodedProv = encodeURIComponent(province);
          const response = await axios.get(
            `http://localhost:3000/members-finder/province/${encodedProv}`,
          );
          setTo(String(response.data));
        } else {
          const encodedAdd = encodeURIComponent(address);
          const response = await axios.get(
            `http://localhost:3000/members-finder/${encodedAdd}`,
          );
          setTo(String(response.data));
        }
      } else {
        alert("नेपाल बाहेक अन्य देशमा सन्देश पठाउन अहिले मिल्दैन।");
      }
    }

    const recipients = to
      .split(",")
      .filter((number) => number.trim() !== "").length;
    const adminCredits = CreditsChecker();

    const payload = {
      token: token,
      from,
      to,
      text,
    };

    console.log("recipients:", recipients);
    console.log("messageCount:", messageCount);
    console.log("adminCredits:", adminCredits);

    if (adminCredits >= recipients * messageCount * 3) {
      try {
        console.log("The sending payload", payload);
        await axios.post("http://localhost:3000/messages", { from, to, text });
        CreditsDeduct(recipients * messageCount * 3);
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    } else {
      window.alert(
        "तपाईँको खातामा पर्याप्त क्रेडिट छैन । कृपया क्रेडिट थप्नुहोस् ।",
      );
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= 60) {
      setText(newText);
      setCharCount(newText.length);
    }
  };

  return (
    <div className="w-full rounded border bg-rose-100 shadow dark:bg-boxdark">
      <div className="rounded border-b bg-rose-200 px-7 py-4">
        <h3 className="font-medium text-black dark:text-white">
          सन्देश विवरण प्रविष्टि फारम
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {/* From Input */}
          <div className="mb-6">
            <label
              htmlFor="from"
              className="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              सन्देश प्रेषक
            </label>
            <input
              type="text"
              id="from"
              className="bg-gray-50 w-full rounded border px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:bg-meta-4 dark:text-white"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </div>

          {/* Radio Buttons for Recipient Type */}
          {/* Add recipient type logic here */}

          {/* Radio Buttons for Recipient Type */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              प्राप्तकर्ता चयन
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="समिति/उप‍-समिति"
                  checked={recipientType === "समिति/उप‍-समिति"}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="mr-2"
                />
                समिति/उप‍-समिति
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="ठेगाना"
                  checked={recipientType === "ठेगाना"}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="mr-2"
                />
                ठेगाना
              </label>
            </div>
          </div>

          {/* Conditional Inputs Based on Recipient Type */}
          {recipientType === "समिति/उप‍-समिति" ? (
            <div className="mb-6">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="committee"
              >
                समिति:
              </label>
              <select
                id="committee"
                value={selectedCommittee}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedCommittee(Number(e.target.value))
                }
                disabled={isFormDisabled}
                className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                <option value="">-- चयन गर्नुहोस् --</option>
                {committees.map((committee) => (
                  <option
                    key={committee.committeeId}
                    value={committee.committeeId}
                  >
                    {committee.committeeName}
                  </option>
                ))}
              </select>
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="subCommittee"
              >
                उपसमिति:
              </label>
              <select
                id="subCommittee"
                value={selectedSubCommittee}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedSubCommittee(Number(e.target.value))
                }
                disabled={isSubCommitteeDisabled}
                className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                <option value="">-- चयन गर्नुहोस् --</option>
                {subCommittees.map((subCommittee) => (
                  <option
                    key={subCommittee.subCommitteeId}
                    value={subCommittee.subCommitteeId}
                  >
                    {subCommittee.subCommitteeName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-6">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                ठेगाना
              </label>
              <AddressInput onAddressChange={handleAddressChange} />
            </div>
          )}

          {/* Text Input */}
          <div className="mb-6">
            <label
              htmlFor="text"
              className="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              सन्देश विवरण
            </label>
            <textarea
              id="text"
              className="bg-gray-50 w-full rounded border px-4.5 py-3 text-black shadow focus:border-primary focus:outline-none dark:bg-meta-4 dark:text-white"
              value={text}
              onChange={handleTextChange}
              required
              rows={4}
              placeholder="Enter your message here..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded bg-primary px-5 py-3 text-white shadow transition hover:bg-opacity-90"
          >
            सन्देश पठाउनुहोस्
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
