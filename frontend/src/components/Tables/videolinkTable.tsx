"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons for buttons

interface SocialLink {
  id: number;
  linkName: string;
  link: string;
  linkDate: string;
  linkPublisher: string;
  country: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
}

interface Country {
  countryId: number;
  countryName: string;
}

interface Province {
  provinceId: number;
  provinceName: string;
}

interface District {
  districtId: number;
  districtName: string;
}

interface Municipality {
  municipalityId: number;
  municipalityName: string;
}

const SocialLinkDisplayer: React.FC = () => {
  const router = useRouter();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddressData = async () => {
    try {
      const [
        countriesResponse,
        provincesResponse,
        districtsResponse,
        municipalitiesResponse,
      ] = await Promise.all([
        axios.get<Country[]>(`${process.env.NEXT_PUBLIC_BE_HOST}/country`),
        axios.get<Province[]>(`${process.env.NEXT_PUBLIC_BE_HOST}/province`),
        axios.get<District[]>(`${process.env.NEXT_PUBLIC_BE_HOST}/district`),
        axios.get<Municipality[]>(
          `${process.env.NEXT_PUBLIC_BE_HOST}/municipality`,
        ),
      ]);
      setCountries(countriesResponse.data);
      setProvinces(provincesResponse.data);
      setDistricts(districtsResponse.data);
      setMunicipalities(municipalitiesResponse.data);
    } catch (err) {
      console.error("Error fetching address data:", err);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_HOST}/social-links`,
      );
      setSocialLinks(response.data);
    } catch (err) {
      setError("Error fetching social links.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSocialLink = (linkId: number) => {
    // Navigate to update page or open modal for editing (replace with your logic)
    router.push(`/forms/updateVideolinkForm/${linkId}`);
  };

  const handleDeleteSocialLink = async (linkId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_HOST}/social-links/${linkId}`,
      );
      setSocialLinks(socialLinks.filter((link) => link.id !== linkId));
      alert("Social link deleted successfully.");
    } catch (err) {
      console.error("Error deleting social link:", err);
      alert("Error deleting social link.");
    }
  };

  useEffect(() => {
    fetchAddressData();
    fetchSocialLinks();
  }, []);

  const formatAddress = (socialLink: SocialLink): string => {
    const { country, province, district, municipality, ward } = socialLink;
    const countryName =
      countries.find((c) => c.countryId === parseInt(country))?.countryName ||
      "";
    const provinceName =
      provinces.find((p) => p.provinceId === parseInt(province))
        ?.provinceName || "";
    const districtName =
      districts.find((d) => d.districtId === parseInt(district))
        ?.districtName || "";
    const municipalityName =
      municipalities.find((m) => m.municipalityId === parseInt(municipality))
        ?.municipalityName || "";

    if (municipalityName && ward) {
      return `${municipalityName} - ${ward}, ${districtName} जिल्ला, ${provinceName} प्रदेश, ${countryName}`;
    }
    if (districtName) {
      return `${districtName}, ${provinceName} प्रदेश, ${countryName}`;
    }
    if (provinceName) {
      return `${provinceName} प्रदेश, ${countryName}`;
    }
    return countryName;
  };

  if (loading) return <p>Loading social links...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="overflow-x-auto">
      <div className="border-gray-700 dark:border-gray-700 min-w-[1500px] rounded-sm border bg-rose-100 p-6 px-5 pb-2.5 pt-6 shadow dark:bg-boxdark sm:rounded-lg sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          <span className="bg-lime-600">सामाजिक लिङ्क तालिका</span>
        </h4>
        <table className="min-w-full table-auto">
          <thead className="dark:bg-gray-700">
            <tr className="bg-slate-400">
              <th className="border-gray-700 w-2 border-2 px-4 py-2 font-bold text-black">
                क्रम संख्या
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                लिङ्क नाम
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                लिङ्क
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                प्रकाशित गर्ने
              </th>
              <th className="border-gray-700 w-30 border-2 px-4 py-2 font-bold text-black">
                मिति
              </th>
              <th className="border-gray-700 w-50 border-2 px-4 py-2 font-bold text-black">
                ठेगाना
              </th>
              <th className="border-gray-700 w-20 border-2 px-4 py-2 font-bold text-black">
                क्रियाकलाप
              </th>
            </tr>
          </thead>
          <tbody>
            {socialLinks.map((socialLink, index) => (
              <tr
                key={socialLink.id}
                className={`${
                  index === socialLinks.length - 1
                    ? ""
                    : "border-gray-700 border-b"
                } hover:bg-gray-50`}
              >
                <td className="border-2 px-4 py-2 text-center text-black">
                  {index + 1}
                </td>
                <td className="border-2 px-4 py-2 text-center text-black">
                  {socialLink.linkName}
                </td>
                <td className="border-2 px-4 py-2 text-center text-black">
                  <a
                    href={socialLink.link}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {socialLink.link}
                  </a>
                </td>
                <td className="border-2 px-4 py-2 text-center text-black">
                  {socialLink.linkPublisher}
                </td>
                <td className="border-2 px-4 py-2 text-center text-black">
                  {socialLink.linkDate}
                </td>
                <td className="border-2 px-4 py-2 text-center text-black">
                  {formatAddress(socialLink)}
                </td>
                <td className="border-2 px-4 py-2 text-center">
                  <button
                    onClick={() => handleUpdateSocialLink(socialLink.id)}
                    className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteSocialLink(socialLink.id)}
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

export default SocialLinkDisplayer;
