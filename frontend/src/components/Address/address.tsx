import React, { useState, useEffect } from "react";

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
  try {
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
  } catch (error) {
    console.error("Error fetching address data:", error);
    return {
      provinceToDistrictsMap: {},
      districtsToMunicipalitiesMap: {},
      municipalitiesToWardsMap: {},
      allProvinces: [],
    };
  }
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

  // Province change
  useEffect(() => {
    if (province) {
      const districts = provinceToDistrictsMap[province] || [];
      setLocalDistricts(districts);
      setDistrict("");
      setMunicipality("");
      setWard("");
      setLocalMunicipalities([]);
      setLocalWards([]);
    } else {
      setLocalDistricts([]);
      setLocalMunicipalities([]);
      setLocalWards([]);
    }
    onAddressChange({ province, district: "", municipality: "", ward: "" });
  }, [province]);

  // District change
  useEffect(() => {
    if (district) {
      const municipalities = districtsToMunicipalitiesMap[district] || [];
      setLocalMunicipalities(municipalities);
      setMunicipality("");
      setWard("");
      setLocalWards([]);
    } else {
      setLocalMunicipalities([]);
      setLocalWards([]);
    }
    onAddressChange({ province, district, municipality: "", ward: "" });
  }, [district]);

  // Municipality change
  useEffect(() => {
    if (municipality) {
      const wards = municipalitiesToWardsMap[municipality] || [];
      setLocalWards(wards);
      setWard("");
    } else {
      setLocalWards([]);
    }
    onAddressChange({ province, district, municipality, ward: "" });
  }, [municipality]);

  // Ward change
  useEffect(() => {
    onAddressChange({ province, district, municipality, ward });
  }, [ward]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex space-x-4">
        {/* Province Select */}
        <div className="flex-1">
          <label className="text-small mb-1 block bg-slate-400 text-center font-medium text-black dark:text-white">
            प्रदेश:
          </label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className={`bg-gray-50 w-fit rounded border border-stroke px-4.5 py-3 text-sm shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white ${
              province === "" ? "text-gray-500" : "text-black"
            }`}
          >
            <option value="" className="text-gray-500">
              प्रदेश छान्नुहोस्
            </option>
            {allProvinces.map((prov) => (
              <option key={prov} value={prov} className="text-black">
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* District Select */}
        <div className="flex-1">
          <label className="text-small mb-1 block bg-slate-400 text-center font-medium text-black dark:text-white">
            जिल्ला:
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!province}
            className={`bg-gray-50 w-fit rounded border border-stroke px-4.5 py-3 text-sm shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white ${
              district === "" ? "text-gray-500" : "text-black"
            }`}
          >
            <option value="" className="text-gray-500">
              जिल्ला छान्नुहोस्
            </option>
            {localDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Municipality Select */}
        <div className="flex-1">
          <label className="text-small mb-1 block bg-slate-400 text-center font-medium text-black dark:text-white">
            पालिका:
          </label>
          <select
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            disabled={!district}
            className={`bg-gray-50 w-fit rounded border border-stroke px-4.5 py-3 text-sm shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white ${
              municipality === "" ? "text-gray-500" : "text-black"
            }`}
          >
            <option value="" className="text-gray-500">
              पालिका छान्नुहोस्
            </option>
            {localMunicipalities.map((mun) => (
              <option key={mun} value={mun}>
                {mun}
              </option>
            ))}
          </select>
        </div>

        {/* Ward Select */}
        <div className="flex-1">
          <label className="text-small mb-1 block bg-slate-400 text-center font-medium text-black dark:text-white">
            वडा:
          </label>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={!municipality}
            className={`bg-gray-50 w-fit rounded border border-stroke px-4.5 py-3 text-sm shadow focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white ${
              ward === "" ? "text-gray-500" : "text-black"
            }`}
          >
            <option value="" className="text-gray-500">
              वडा छान्नुहोस्
            </option>
            {localWards.map((wardOption) => (
              <option key={wardOption} value={wardOption}>
                {wardOption}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddressInput;
