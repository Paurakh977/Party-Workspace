import React, { useState, useEffect } from "react";

interface Province {
  id: string;
  name: string;
}

interface District {
  id: string;
  name: string;
}

interface Municipality {
  id: string;
  name: string;
}

interface FetchAddressResponse {
  provinceToDistrictsMap: {
    [key: string]: {
      name: string;
      districts: District[];
    };
  };
  districtsToMunicipalitiesMap: {
    [key: string]: {
      name: string;
      municipalities: Municipality[];
    };
  };
  municipalitiesToWardsMap: {
    [key: string]: {
      name: string;
      wards: string[];
    };
  };
  allProvinces: { id: string; name: string }[];
  allCountries: { id: string; name: string }[];
}

interface AddressInputProps {
  onAddressChange: (newAddress: {
    country: string;
    province?: string;
    district?: string;
    municipality?: string;
    ward?: string;
  }) => void;
  initialCountry?: string;
  initialProvince?: string;
  initialDistrict?: string;
  initialMunicipality?: string;
  initialWard?: string;
}

const fetchAddress = async (): Promise<FetchAddressResponse> => {
  try {
    const [
      ptdResponse,
      dtmResponse,
      mtwResponse,
      allProvincesResponse,
      allCountriesResponse,
    ] = await Promise.all([
      fetch("/map-province-districts.json"),
      fetch("/map-districts-municipalities.json"),
      fetch("/map-municipalities-wards.json"),
      fetch("/all-provinces.json"),
      fetch("/all-countries.json"),
    ]);

    if (!ptdResponse.ok) {
      const errorText = await ptdResponse.text();
      throw new Error(`Error fetching provinces to districts: ${errorText}`);
    }
    const ptdResult = await ptdResponse.json();

    if (!dtmResponse.ok) {
      const errorText = await dtmResponse.text();
      throw new Error(
        `Error fetching districts to municipalities: ${errorText}`,
      );
    }
    const dtmResult = await dtmResponse.json();

    if (!mtwResponse.ok) {
      const errorText = await mtwResponse.text();
      throw new Error(`Error fetching municipalities to wards: ${errorText}`);
    }
    const mtwResult = await mtwResponse.json();

    if (!allProvincesResponse.ok) {
      const errorText = await allProvincesResponse.text();
      throw new Error(`Error fetching all provinces: ${errorText}`);
    }
    const allProvincesList = await allProvincesResponse.json();

    if (!allCountriesResponse.ok) {
      const errorText = await allCountriesResponse.text();
      throw new Error(`Error fetching all countries: ${errorText}`);
    }
    const allCountriesList = await allCountriesResponse.json();

    return {
      provinceToDistrictsMap: ptdResult,
      districtsToMunicipalitiesMap: dtmResult,
      municipalitiesToWardsMap: mtwResult,
      allProvinces: allProvincesList,
      allCountries: allCountriesList,
    };
  } catch (error) {
    console.error("Error fetching address data:", error);
    return {
      provinceToDistrictsMap: {},
      districtsToMunicipalitiesMap: {},
      municipalitiesToWardsMap: {},
      allProvinces: [],
      allCountries: [],
    };
  }
};

const AddressInput: React.FC<AddressInputProps> = ({
  onAddressChange,
  initialCountry = "",
  initialProvince = "",
  initialDistrict = "",
  initialMunicipality = "",
  initialWard = "",
}) => {
  const [country, setCountry] = useState<string>(initialCountry);
  const [province, setProvince] = useState<string>(initialProvince);
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [municipality, setMunicipality] = useState<string>(initialMunicipality);
  const [ward, setWard] = useState<string>(initialWard);

  const [provinceToDistrictsMap, setProvinceToDistrictsMap] = useState<
    FetchAddressResponse["provinceToDistrictsMap"]
  >({});
  const [districtsToMunicipalitiesMap, setDistrictsToMunicipalitiesMap] =
    useState<FetchAddressResponse["districtsToMunicipalitiesMap"]>({});
  const [municipalitiesToWardsMap, setMunicipalitiesToWardsMap] = useState<
    FetchAddressResponse["municipalitiesToWardsMap"]
  >({});
  const [allProvinces, setAllProvinces] = useState<
    { id: string; name: string }[]
  >([]);
  const [allCountries, setAllCountries] = useState<
    { id: string; name: string }[]
  >([]);
  const [localDistricts, setLocalDistricts] = useState<District[]>([]);
  const [localMunicipalities, setLocalMunicipalities] = useState<
    Municipality[]
  >([]);
  const [localWards, setLocalWards] = useState<string[]>([]);

  useEffect(() => {
    const initializeAddressData = async () => {
      const addressData = await fetchAddress();
      setProvinceToDistrictsMap(addressData.provinceToDistrictsMap);
      setDistrictsToMunicipalitiesMap(addressData.districtsToMunicipalitiesMap);
      setMunicipalitiesToWardsMap(addressData.municipalitiesToWardsMap);
      setAllProvinces(addressData.allProvinces);
      setAllCountries(addressData.allCountries);

      // Initialize the state based on the initial values provided
      if (initialCountry) {
        setCountry(initialCountry);

        if (initialProvince) {
          setProvince(initialProvince);
          const districts =
            addressData.provinceToDistrictsMap[initialProvince]?.districts ||
            [];
          setLocalDistricts(districts);

          if (initialDistrict) {
            setDistrict(initialDistrict);
            const municipalities =
              addressData.districtsToMunicipalitiesMap[initialDistrict]
                ?.municipalities || [];
            setLocalMunicipalities(municipalities);

            if (initialMunicipality) {
              setMunicipality(initialMunicipality);
              const wards =
                addressData.municipalitiesToWardsMap[initialMunicipality]
                  ?.wards || [];
              setLocalWards(wards);

              if (initialWard) {
                setWard(initialWard);
              }
            }
          }
        }
      }
    };

    initializeAddressData();
  }, [
    initialCountry,
    initialProvince,
    initialDistrict,
    initialMunicipality,
    initialWard,
  ]);

  useEffect(() => {
    // Send IDs to the backend
    onAddressChange({
      country,
      province,
      district,
      municipality,
      ward,
    });
  }, [country, province, district, municipality, ward]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    // Reset state when country changes
    setProvince("");
    setDistrict("");
    setMunicipality("");
    setWard("");
    setLocalDistricts([]);
    setLocalMunicipalities([]);
    setLocalWards([]);

    if (selectedCountry === "154") {
      // Assuming '154' is Nepal
      // Additional logic for when Nepal is selected if needed
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);

    // Set local districts based on selected province
    setLocalDistricts(
      provinceToDistrictsMap[selectedProvince]?.districts || [],
    );
    setDistrict("");
    setMunicipality("");
    setWard("");
    setLocalMunicipalities([]);
    setLocalWards([]);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);

    // Set local municipalities based on selected district
    setLocalMunicipalities(
      districtsToMunicipalitiesMap[selectedDistrict]?.municipalities || [],
    );
    setMunicipality("");
    setWard("");
    setLocalWards([]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Country Dropdown on a separate line */}
      <div className="flex">
        <div className="flex-1">
          <label className="text-small mb-1 block">देशको नाम:</label>
          <select value={country} onChange={handleCountryChange}>
            {allCountries.map((cntry) => (
              <option key={cntry.id} value={cntry.id}>
                {cntry.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Province and District Dropdowns */}
      {country === "154" && (
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-small mb-1 block">प्रदेश:</label>
            <select value={province} onChange={handleProvinceChange}>
              <option value="">प्रदेश छान्नुहोस्</option>
              {allProvinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-small mb-1 block">जिल्ला:</label>
            <select
              value={district}
              onChange={handleDistrictChange}
              disabled={!province}
            >
              <option value="">जिल्ला छान्नुहोस्</option>
              {localDistricts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Municipality and Ward Dropdowns */}
      {district && (
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-small mb-1 block">नगरपालिका:</label>
            <select
              value={municipality}
              onChange={(e) => {
                const selectedMunicipality = e.target.value;
                setMunicipality(selectedMunicipality);
                setLocalWards(
                  municipalitiesToWardsMap[selectedMunicipality]?.wards || [],
                );
                setWard("");
              }}
              disabled={!district}
            >
              <option value="">नगरपालिका छान्नुहोस्</option>
              {localMunicipalities.map((mun) => (
                <option key={mun.id} value={mun.id}>
                  {mun.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-small mb-1 block">वार्ड:</label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              disabled={!municipality}
            >
              <option value="">वार्ड छान्नुहोस्</option>
              {localWards.map((wardOption) => (
                <option key={wardOption} value={wardOption}>
                  {wardOption}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
