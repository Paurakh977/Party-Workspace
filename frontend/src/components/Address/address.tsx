import React, { useState, useEffect } from "react";

interface FetchAddressResponse {
  provinceToDistrictsMap: { [key: string]: string[] };
  districtsToMunicipalitiesMap: { [key: string]: string[] };
  municipalitiesToWardsMap: { [key: string]: string[] };
  allProvinces: string[];
}

interface AddressInputProps {
  onAddressChange: (newAddress: {
    address: string;
    province?: string;
    district?: string;
    municipality?: string;
    ward?: string;
  }) => void;
  initialAddress?: string;
  initialProvince?: string;
  initialDistrict?: string;
  initialMunicipality?: string;
  initialWard?: string;
}

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

const AddressInput: React.FC<AddressInputProps> = ({
  onAddressChange,
  initialAddress = "",
  initialProvince = "",
  initialDistrict = "",
  initialMunicipality = "",
  initialWard = "",
}) => {
  const [addressType, setAddressType] = useState<string>("other");
  const [address, setAddress] = useState<string>(initialAddress);
  const [province, setProvince] = useState<string>(initialProvince);
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [municipality, setMunicipality] = useState<string>(initialMunicipality);
  const [ward, setWard] = useState<string>(initialWard);

  const [provinceToDistrictsMap, setProvinceToDistrictsMap] = useState<{
    [key: string]: string[];
  }>({});
  const [districtsToMunicipalitiesMap, setDistrictsToMunicipalitiesMap] =
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
      setDistrictsToMunicipalitiesMap(addressData.districtsToMunicipalitiesMap);
      setMunicipalitiesToWardsMap(addressData.municipalitiesToWardsMap);
      setAllProvinces(addressData.allProvinces);

      if (
        initialProvince &&
        addressData.provinceToDistrictsMap[initialProvince]
      ) {
        setLocalDistricts(addressData.provinceToDistrictsMap[initialProvince]);
      }
      if (
        initialDistrict &&
        addressData.districtsToMunicipalitiesMap[initialDistrict]
      ) {
        setLocalMunicipalities(
          addressData.districtsToMunicipalitiesMap[initialDistrict],
        );
      }
      if (
        initialMunicipality &&
        addressData.municipalitiesToWardsMap[initialMunicipality]
      ) {
        setLocalWards(
          addressData.municipalitiesToWardsMap[initialMunicipality],
        );
      }

      if (initialAddress === "नेपाल") {
        setAddressType("nepal");
        setAddress(initialAddress);
      } else if (initialAddress === "अन्य" || initialAddress === "") {
        setAddressType("other");
        setAddress(initialAddress);
      } else {
        setAddressType("foreign");
        setAddress(initialAddress);
      }
    };
    initializeAddressData();
  }, [
    initialProvince,
    initialDistrict,
    initialMunicipality,
    initialWard,
    initialAddress,
  ]);

  useEffect(() => {
    let newAddress = "";

    if (addressType === "nepal") {
      newAddress = "नेपाल";
      onAddressChange({
        address: newAddress,
        province,
        district,
        municipality,
        ward,
      });
    } else if (addressType === "foreign") {
      newAddress = address;
      onAddressChange({ address: newAddress });
    } else {
      newAddress = "अन्य";
      onAddressChange({ address: newAddress });
    }

    setAddress(newAddress);
  }, [addressType, province, district, municipality, ward, address]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label>
          <input
            type="radio"
            value="nepal"
            checked={addressType === "nepal"}
            onChange={() => {
              setAddressType("nepal");
              setProvince("");
              setDistrict("");
              setMunicipality("");
              setWard("");
              setLocalDistricts([]);
              setLocalMunicipalities([]);
              setLocalWards([]);
            }}
          />
          नेपाल
        </label>
        <label>
          <input
            type="radio"
            value="foreign"
            checked={addressType === "foreign"}
            onChange={() => {
              setAddressType("foreign");
              setAddress(""); // Reset the address field
            }}
          />
          बिदेश
        </label>
        <label>
          <input
            type="radio"
            value="other"
            checked={addressType === "other"}
            onChange={() => {
              setAddressType("other");
            }}
          />
          अन्य
        </label>
      </div>

      {addressType === "nepal" && (
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-small mb-1 block">प्रदेश:</label>
            <select
              value={province}
              onChange={(e) => {
                const selectedProvince = e.target.value;
                setProvince(selectedProvince);
                setLocalDistricts(
                  provinceToDistrictsMap[selectedProvince] || [],
                );
                setDistrict("");
                setMunicipality("");
                setWard("");
                setLocalMunicipalities([]);
                setLocalWards([]);
              }}
            >
              <option value="">प्रदेश छान्नुहोस्</option>
              {allProvinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-small mb-1 block">जिल्ला:</label>
            <select
              value={district}
              onChange={(e) => {
                const selectedDistrict = e.target.value;
                setDistrict(selectedDistrict);
                setLocalMunicipalities(
                  districtsToMunicipalitiesMap[selectedDistrict] || [],
                );
                setMunicipality("");
                setWard("");
                setLocalWards([]);
              }}
              disabled={!province}
            >
              <option value="">जिला छान्नुहोस्</option>
              {localDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-small mb-1 block">पालिका:</label>
            <select
              value={municipality}
              onChange={(e) => {
                const selectedMunicipality = e.target.value;
                setMunicipality(selectedMunicipality);
                setLocalWards(
                  municipalitiesToWardsMap[selectedMunicipality] || [],
                );
                setWard("");
              }}
              disabled={!district}
            >
              <option value="">पालिका छान्नुहोस्</option>
              {localMunicipalities.map((mun) => (
                <option key={mun} value={mun}>
                  {mun}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-small mb-1 block">वडा:</label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              disabled={!municipality}
            >
              <option value="">वडा छान्नुहोस्</option>
              {localWards.map((wardNum) => (
                <option key={wardNum} value={wardNum}>
                  {wardNum}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {addressType === "foreign" && (
        <div>
          <label className="text-small mb-1 block">देशको नाम:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2"
          />
        </div>
      )}
    </div>
  );
};

export default AddressInput;
