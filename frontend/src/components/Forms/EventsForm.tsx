import React, { useState, useEffect, ChangeEvent, FormEvent, use } from "react";
import axios from "axios";
import AddressInput from "../Address/address";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

// Define interfaces for the data types
interface Committee {
  committeeId: number;
  committeeName: string;
}

interface SubCommittee {
  subCommitteeId: number;
  subCommitteeName: string;
}

interface Level {
  levelId: number;
  levelName: string;
}

interface Position {
  positionId: number;
  positionName: string;
}

const EventsForm: React.FC = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [subCommittees, setSubCommittees] = useState<SubCommittee[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<number | "">("");
  const [selectedSubCommittee, setSelectedSubCommittee] = useState<number | "">(
    "",
  );
  const [selectedLevel, setSelectedLevel] = useState<number | "">("");
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
  const [isSubCommitteeDisabled, setIsSubCommitteeDisabled] =
    useState<boolean>(true);
  const [isLevelDisabled, setIsLevelDisabled] = useState<boolean>(true);

  // New state variables for the additional fields
  const [eventName, setEventName] = useState<string>("");

  // New state for address
  const [address, setAddress] = useState("");

  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  const [venue, setVenue] = useState<string>("");
  const [eventStartDate, setEventStartDate] = useState<string>("");
  const [eventEndDate, setEventEndDate] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");

  const [remarks, setRemarks] = useState<string>("");

  const handleStartDateChange = (value: string) => {
    setEventStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    setEventEndDate(value);
  };
  // Handle address changes from AddressInput component
  const handleAddressChange = (newAddress: {
    province: string;
    district: string;
    municipality: string;
    ward: string;
  }) => {
    setProvince(newAddress.province);
    setDistrict(newAddress.district);
    setMunicipality(newAddress.municipality);
    setWard(newAddress.ward);
  };

  // Fetch committees data from API on component mount
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await axios.get<Committee[]>(
          "http://localhost:3000/committees",
        );
        setCommittees(response.data);
        setIsFormDisabled(response.data.length === 0); // Disable form if no committees
      } catch (error) {
        console.error("Error fetching committees:", error);
        setIsFormDisabled(true); // Disable form on error
      }
    };

    fetchCommittees();
  }, []);

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

  // Fetch levels based on selected committee and sub-committee
  useEffect(() => {
    const fetchLevels = async () => {
      if (selectedCommittee || selectedSubCommittee) {
        try {
          let endpoint = "";

          if (selectedSubCommittee) {
            endpoint = `http://localhost:3000/sub-level/sub-committee/${selectedSubCommittee}`;
          } else if (selectedCommittee) {
            endpoint = `http://localhost:3000/sub-level/committee/${selectedCommittee}`;
          }

          if (endpoint) {
            const response = await axios.get<{ levelId: number }[]>(endpoint);
            const levelIds = response.data.map((level) => level.levelId);

            if (levelIds.length > 0) {
              const levelsResponse = await axios.get<Level[]>(
                "http://localhost:3000/levels",
              );
              const filteredLevels = levelsResponse.data.filter((level) =>
                levelIds.includes(level.levelId),
              );

              setLevels(filteredLevels);
              setIsLevelDisabled(filteredLevels.length === 0); // Disable dropdown if no levels
            } else {
              setLevels([]);
              setIsLevelDisabled(true); // Disable the levels dropdown
            }
          } else {
            setLevels([]);
            setIsLevelDisabled(true); // Disable if no endpoint
          }
        } catch (error) {
          console.error("Error fetching levels:", error);
          setLevels([]);
          setIsLevelDisabled(true); // Disable on error
        }
      } else {
        setLevels([]);
        setIsLevelDisabled(true); // Disable if no committee or sub-committee selected
      }
    };

    fetchLevels();
  }, [selectedCommittee, selectedSubCommittee]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      eventName,
      eventStartDate, // Add event start date
      eventEndDate, // Add event end date
      eventType, // Add event type
      address: address || "अन्य", // Default to 'अन्य' if not provided
      province: province || null,
      district: district || null,
      municipality: municipality || null,
      ward: ward || null,
      venue: venue || null, // Add venue if applicable
      committeeId: selectedCommittee !== "" ? selectedCommittee : null,
      subCommitteeId: selectedSubCommittee !== "" ? selectedSubCommittee : null,
      levelId: selectedLevel !== "" ? selectedLevel : null,
      remarks: remarks || null,
    };

    try {
      await axios.post("http://localhost:3000/events", payload);
      console.log("Form submitted successfully");

      // Reset form state
      setEventName("");
      setEventStartDate("");
      setEventEndDate("");
      setEventType("");
      setAddress("अन्य"); // Reset to default value
      setProvince("");
      setDistrict("");
      setMunicipality("");
      setWard("");
      setVenue("");
      setSelectedCommittee("");
      setSelectedSubCommittee("");
      setSelectedLevel("");
      setSubCommittees([]);
      setLevels([]);
      setRemarks("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-fit rounded-sm border border-stroke bg-rose-100 shadow dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
      <div className="border-b border-stroke bg-rose-200 px-7 py-4 dark:border-strokedark sm:rounded-lg">
        <h3 className="font-medium text-black dark:text-white">
          कार्यक्रम विवरण प्रविष्टि फारम
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {/* Event Name Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventName"
            >
              कार्यक्रमको नाम:
            </label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEventName(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Event Start Date Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventStartDate"
            >
              कार्यक्रमको प्रारम्भ मिति:
            </label>
            <NepaliDatePicker
              inputClassName="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              value={eventStartDate}
              onChange={handleStartDateChange}
              options={{ calenderLocale: "ne", valueLocale: "en" }}
            />
          </div>

          {/* Event End Date Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventEndDate"
            >
              कार्यक्रमको समाप्ति मिति:
            </label>
            <NepaliDatePicker
              inputClassName="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              value={eventEndDate}
              onChange={handleEndDateChange}
              options={{ calenderLocale: "ne", valueLocale: "en" }}
            />
          </div>

          {/* Event Type Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="eventType"
            >
              कार्यक्रमको प्रकार:
            </label>
            <input
              type="text"
              id="eventType"
              value={eventType}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEventType(e.target.value)
              }
              required
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Address Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="address"
            >
              ठेगाना:
            </label>
            <AddressInput onAddressChange={handleAddressChange} />
          </div>

          {/* Venue Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="venue"
            >
              कार्यक्रम स्थल:
            </label>
            <input
              type="text"
              id="venue"
              value={venue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setVenue(e.target.value)
              }
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          {/* Committee Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
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
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
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
          </div>

          {/* Sub-Committee Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
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
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
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

          {/* Level Dropdown */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="level"
            >
              स्तर:
            </label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedLevel(Number(e.target.value))
              }
              disabled={isLevelDisabled}
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">-- चयन गर्नुहोस् --</option>
              {levels.map((level) => (
                <option key={level.levelId} value={level.levelId}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>
          {/* Remarks Field */}
          <div className="mb-5.5">
            <label
              className="mb-3 block bg-sky-200 text-sm font-medium text-black dark:text-white"
              htmlFor="representative"
            >
              कैफियत:
            </label>
            <input
              type="text"
              id="remarks"
              value={remarks}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRemarks(e.target.value)
              }
              className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              placeholder="कैफियत उल्लेख गर्नुहोस्"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="inline-flex items-center rounded bg-primary px-5 py-2 text-base font-medium text-white transition hover:bg-opacity-90"
          >
            सुरक्षित गर्नुहोस्
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventsForm;
