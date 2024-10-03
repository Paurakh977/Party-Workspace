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
  representative: string;
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

const MessageForm: React.FC<MessageFormProps> = ({
  eventDetails,
  eventOrganizer,
}) => {
  const [token, setToken] = useState<string>("CCRfjs0IZfeyZsOAFWxl");
  const [from, setFrom] = useState<string>(eventOrganizer);
  const [to, setTo] = useState<string>("");
  const [text, setText] = useState<string>(eventDetails);
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

  const [selectedCommitteeId, setSelectedCommitteeId] = useState<number | null>(
    null,
  );
  const [selectedSubCommitteeId, setSelectedSubCommitteeId] = useState<
    number | null
  >(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [recipientType, setRecipientType] = useState<string>("समिति/उप‍-समिति");

  const [charCount, setCharCount] = useState<number>(eventDetails.length);

  // Fetch committees data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch committees
        const committeesResponse = await axios.get<Committee[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/committees",
        );
        setCommittees(committeesResponse.data);

        // Fetch levels data
        const levelsResponse = await axios.get<Level[]>(
          process.env.NEXT_PUBLIC_BE_HOST + "/levels",
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
                process.env.NEXT_PUBLIC_BE_HOST +
                  `/sub-committees/committee/${committee.committeeId}`,
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
          process.env.NEXT_PUBLIC_BE_HOST + "/sub-level",
        );
        setSubLevels(subLevelsResponse.data);

        // Fetch structures data
        const structuresResponses = await Promise.all(
          committeesResponse.data.flatMap(async (committee) => {
            try {
              const committeeStructuresResponse = await axios.get<Structure[]>(
                process.env.NEXT_PUBLIC_BE_HOST +
                  `/structures/committee/${committee.committeeId}`,
              );
              const committeeStructures = committeeStructuresResponse.data;

              const subCommitteesStructuresResponses = await Promise.all(
                (subCommittees[committee.committeeId] || []).map(async (sub) =>
                  axios.get<Structure[]>(
                    process.env.NEXT_PUBLIC_BE_HOST +
                      `/structures/subcommittee/${sub.subCommitteeId}`,
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
              process.env.NEXT_PUBLIC_BE_HOST + `/positions/${positionId}`,
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
          process.env.NEXT_PUBLIC_BE_HOST + "/members",
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

  const filteredMembers = members.filter((member) => {
    const committeeMatch = selectedCommitteeId
      ? member.committeeId === selectedCommitteeId
      : true;
    const subCommitteeMatch = selectedSubCommitteeId
      ? member.subCommitteeId === selectedSubCommitteeId
      : true;
    const provinceMatch = selectedProvince
      ? member.province === selectedProvince
      : true;
    const districtMatch = selectedDistrict
      ? member.district === selectedDistrict
      : true;
    const municipalityMatch = selectedMunicipality
      ? member.municipality === selectedMunicipality
      : true;
    const addressMatch = selectedAddress
      ? member.address === selectedAddress
      : true;

    return (
      committeeMatch &&
      subCommitteeMatch &&
      provinceMatch &&
      districtMatch &&
      municipalityMatch &&
      addressMatch
    );
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const mobileNumbers = filteredMembers
      .map((member) => member.mobileNumber)
      .filter((number) => number) // Ensure we don't include undefined or empty values
      .join(",");

    setTo(mobileNumbers);

    console.log("Sending message to", mobileNumbers);

    const messageCount = calculateMessageCount(text);

    const recipients = mobileNumbers
      .split(",")
      .filter((number) => number.trim() !== "").length;
    const adminCredits = CreditsChecker();

    const payload = {
      token: token,
      from,
      to: mobileNumbers,
      text,
    };

    console.log("recipients:", recipients);
    console.log("messageCount:", messageCount);
    console.log("adminCredits:", adminCredits);
    const cost = recipients * messageCount * 4;

    if (adminCredits >= cost) {
      try {
        console.log("The sending payload", payload);
        await axios.post(process.env.NEXT_PUBLIC_BE_HOST + "/messages", {
          from,
          to,
          text,
        });
        CreditsDeduct(cost);
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
    setText(newText);
    setCharCount(newText.length);
  };

  const handleCommitteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const committeeId = parseInt(e.target.value);
    const committeeId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedCommitteeId(committeeId);
    setSelectedSubCommitteeId(null); // Reset sub-committee when committee changes
  };

  const handleSubCommitteeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const subCommitteeId = parseInt(e.target.value);
    setSelectedSubCommitteeId(subCommitteeId);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(e.target.value);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value || null);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value || null);
  };

  const handleMunicipalityChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedMunicipality(e.target.value || null);
  };

  return (
    <div className="w-full rounded border bg-rose-100 shadow dark:bg-boxdark">
      <div className="rounded border-b bg-rose-200 px-7 py-4">
        <h3 className="font-medium text-black dark:text-white">
          एस एम एस विवरण प्रविष्टि फारम
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {/* From Input */}
          <div className="mb-6">
            <label
              htmlFor="from"
              className="mb-2 block text-base font-medium text-black dark:text-white"
            >
              एस एम एस पठाउने
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
          <div>
            <label className="mb-2 block text-base font-medium text-black dark:text-white">
              एस एम एस पाउने:
            </label>
            <br />
            <label className="ml-4 mr-4">समिति द्वारा फिल्टर गर्नुहोस्:</label>
            <select
              value={selectedCommitteeId ?? ""}
              onChange={handleCommitteeChange}
              className="rounded border p-2"
            >
              <option value="">सबै समिति</option>
              {committees.map((committee) => (
                <option
                  key={committee.committeeId}
                  value={committee.committeeId}
                >
                  {committee.committeeName}
                </option>
              ))}
            </select>
            <br />

            {selectedCommitteeId &&
              subCommittees[selectedCommitteeId]?.length > 0 && (
                <>
                  <label className="ml-4 mr-4">
                    उप-समिति द्वारा फिल्टर गर्नुहोस्:
                  </label>
                  <select
                    value={selectedSubCommitteeId ?? ""}
                    onChange={handleSubCommitteeChange}
                    className="rounded border p-2"
                  >
                    <option value="">सबै उप-समिति</option>
                    {subCommittees[selectedCommitteeId].map((subCommittee) => (
                      <option
                        key={subCommittee.subCommitteeId}
                        value={subCommittee.subCommitteeId}
                      >
                        {subCommittee.subCommitteeName}
                      </option>
                    ))}
                  </select>
                  <br />
                </>
              )}

            {/* Filters for Address (Country), Province, District, Municipality */}
            <label className="ml-4 mr-4">देश द्वारा फिल्टर गर्नुहोस्:</label>
            <select
              value={selectedAddress ?? ""}
              onChange={handleAddressChange}
              className="rounded border p-2"
            >
              <option value="">सबै देश</option>
              {members.length > 0 &&
                Array.from(
                  new Set(members.map((member) => member.address)),
                ).map((address) => (
                  <option key={address} value={address}>
                    {address}
                  </option>
                ))}
            </select>
            <br />

            <label className="ml-4 mr-4">प्रदेश द्वारा फिल्टर गर्नुहोस्:</label>
            <select
              value={selectedProvince ?? ""}
              onChange={handleProvinceChange}
              className="rounded border p-2"
            >
              <option value="">सबै प्रदेश</option>
              {members.length > 0 &&
                Array.from(
                  new Set(members.map((member) => member.province)),
                ).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
            </select>
            <br />

            <label className="ml-4 mr-4">जिल्ला द्वारा फिल्टर गर्नुहोस्:</label>
            <select
              value={selectedDistrict ?? ""}
              onChange={handleDistrictChange}
              className="rounded border p-2"
            >
              <option value="">सबै जिल्ला</option>
              {members.length > 0 &&
                Array.from(
                  new Set(members.map((member) => member.district)),
                ).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
            <br />

            <label className="ml-4 mr-4">
              नगरपालिका द्वारा फिल्टर गर्नुहोस्:
            </label>
            <select
              value={selectedMunicipality ?? ""}
              onChange={handleMunicipalityChange}
              className="rounded border p-2"
            >
              <option value="">सबै नगरपालिका</option>
              {members.length > 0 &&
                Array.from(
                  new Set(members.map((member) => member.municipality)),
                ).map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
            </select>
          </div>
          <br />

          {/* Text Input */}
          <div className="mb-6">
            <label
              htmlFor="text"
              className="mb-2 block text-base font-medium text-black dark:text-white"
            >
              एस एम एस विवरण
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
            एस एम एस पठाउनुहोस्
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
