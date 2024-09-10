import React, { useState, useEffect } from "react";

// Define the interface for the fetched data structure
interface FetchAddressResponse {
  provinceToDistrictsMap: { [key: string]: string[] };
  districtsToMunicipalitiesMap: { [key: string]: string[] };
  municipalitiesToWardsMap: { [key: string]: string[] };
  allProvinces: string[];
}

interface AddressInputProps {
  onAddressChange: (address: {
    province: string;
    district: string;
    municipality: string;
    ward: string;
  }) => void;
}

// The fetchAddress function to retrieve address data from JSON files
const fetchAddress = async (): Promise<FetchAddressResponse> => {
  const [ptdResponse, dtmResponse, mtwResponse, allProvincesResponse] =
    await Promise.all([
      fetch("/map-province-districts.json"),
      fetch("/map-districts-municipalities.json"),
      fetch("/map-municipalities-wards.json"),
      fetch("/all-provinces.json"),
    ]);

  const ptdResult = await ptdResponse.json();
  const dtmResult = await dtmResponse.json();
  const mtwResult = await mtwResponse.json();
  const allProvincesList = await allProvincesResponse.json();

  return {
    provinceToDistrictsMap: ptdResult,
    districtsToMunicipalitiesMap: dtmResult,
    municipalitiesToWardsMap: mtwResult,
    allProvinces: allProvincesList,
  };
};

const AddressInput: React.FC<AddressInputProps> = ({ onAddressChange }) => {
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [municipality, setMunicipality] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  const [provinceToDistrictsMap, setProvinceToDistrictsMap] = useState<{
    [key: string]: string[];
  }>({});
  const [districtsToMunicipalitiesMap, setDistrictToMunicipalitiesMap] =
    useState<{ [key: string]: string[] }>({});
  const [municipalitiesToWardsMap, setMunicipalitiesToWardsMap] = useState<{
    [key: string]: string[];
  }>({});
  const [allProvinces, setAllProvinces] = useState<string[]>([]);
  const [localDistricts, setLocalDistricts] = useState<string[]>([]);
  const [localMunicipalities, setLocalMunicipalities] = useState<string[]>([]);
  const [localWards, setLocalWards] = useState<string[]>([]);

  // Fetch address data when the component mounts
  useEffect(() => {
    const initializeAddressData = async () => {
      const addressData = await fetchAddress();
      setProvinceToDistrictsMap(addressData.provinceToDistrictsMap);
      setDistrictToMunicipalitiesMap(addressData.districtsToMunicipalitiesMap);
      setMunicipalitiesToWardsMap(addressData.municipalitiesToWardsMap);
      setAllProvinces(addressData.allProvinces);
    };

    initializeAddressData();
  }, []);

  // Handle province change
  useEffect(() => {
    if (province) {
      const districts = provinceToDistrictsMap[province] || [];
      setLocalDistricts(districts);
      setDistrict(""); // Reset district
      setMunicipality(""); // Reset municipality
      setWard(""); // Reset ward
      setLocalMunicipalities([]);
      setLocalWards([]);
    } else {
      setLocalDistricts([]);
      setLocalMunicipalities([]);
      setLocalWards([]);
    }
    onAddressChange({ province, district: "", municipality: "", ward: "" });
  }, [province]);

  // Handle district change
  useEffect(() => {
    if (district) {
      const municipalities = districtsToMunicipalitiesMap[district] || [];
      setLocalMunicipalities(municipalities);
      setMunicipality(""); // Reset municipality
      setWard(""); // Reset ward
      setLocalWards([]);
    } else {
      setLocalMunicipalities([]);
      setLocalWards([]);
    }
    onAddressChange({ province, district, municipality: "", ward: "" });
  }, [district]);

  // Handle municipality change
  useEffect(() => {
    if (municipality) {
      const wards = municipalitiesToWardsMap[municipality] || [];
      setLocalWards(wards);
      setWard(""); // Reset ward
    } else {
      setLocalWards([]);
    }
    onAddressChange({ province, district, municipality, ward: "" });
  }, [municipality]);

  // Handle ward change
  useEffect(() => {
    onAddressChange({ province, district, municipality, ward });
  }, [ward]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex space-x-4">
        {/* Province Select */}
        <div className="flex-1">
          <label className="mb-1 block text-title-md font-medium text-black dark:text-white">
            प्रदेश:
          </label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">प्रदेश छान्नुहोस्</option>
            {allProvinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* District Select */}
        <div className="flex-1">
          <label className="mb-1 block text-title-md font-medium text-black dark:text-white">
            जिल्ला:
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!province}
            className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">जिल्ला छान्नुहोस्</option>
            {localDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Municipality Select */}
        <div className="flex-1">
          <label className="mb-1 block text-title-md font-medium text-black dark:text-white">
            पालिका:
          </label>
          <select
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            disabled={!district}
            className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">पालिका छान्नुहोस्</option>
            {localMunicipalities.map((mun) => (
              <option key={mun} value={mun}>
                {mun}
              </option>
            ))}
          </select>
        </div>

        {/* Ward Select */}
        <div className="flex-1">
          <label className="mb-1 block text-title-md font-medium text-black dark:text-white">
            वडा:
          </label>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={!municipality}
            className="bg-gray-50 w-full rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
          >
            <option value="">वडा छान्नुहोस्</option>
            {localWards.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddressInput;
