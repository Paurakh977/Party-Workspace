"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons for buttons
import ResponsiveTable, { TableColumn, PaginationData } from "./ResponsiveTable";

interface SocialLink {
  id: number;
  linkName: string;
  link: string;
  linkDate: string;
  linkPublisher: string;
  description: string;
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
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

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

  // Define table columns
  const columns: TableColumn<SocialLink>[] = [
    {
      key: 'linkName',
      label: 'लिङ्क नाम',
      searchable: true,
      className: 'font-medium',
      render: (value, socialLink) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {value}
          </div>
          {socialLink.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {socialLink.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'link',
      label: 'लिङ्क',
      render: (value) => (
        <a
          href={value}
          className="text-blue-600 hover:underline text-sm break-all inline-flex items-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {value.length > 30 ? `${value.substring(0, 30)}...` : value}
        </a>
      ),
      mobileHidden: true,
    },
    {
      key: 'linkPublisher',
      label: 'प्रकाशित गर्ने',
      searchable: true,
    },
    {
      key: 'linkDate',
      label: 'मिति',
      sortable: true,
    },
    {
      key: 'address',
      label: 'ठेगाना',
      render: (_, socialLink) => formatAddress(socialLink),
      mobileHidden: true,
    },
    {
      key: 'actions',
      label: 'क्रियाकलाप',
      render: (_, socialLink) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateSocialLink(socialLink.id)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            title="सम्पादन गर्नुहोस्"
          >
            <FaEdit className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleDeleteSocialLink(socialLink.id)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            title="मेटाउनुहोस्"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  // Mobile card rendering
  const renderMobileCard = (socialLink: SocialLink, index: number) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white text-lg">
            {socialLink.linkName}
          </h3>
          {socialLink.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {socialLink.description}
            </p>
          )}
          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {socialLink.linkPublisher && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {socialLink.linkPublisher}
              </span>
            )}
            {socialLink.linkDate && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {socialLink.linkDate}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-3">
          <button
            onClick={() => handleUpdateSocialLink(socialLink.id)}
            className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            title="सम्पादन गर्नुहोस्"
          >
            <FaEdit className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleDeleteSocialLink(socialLink.id)}
            className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            title="मेटाउनुहोस्"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-400">लिङ्क: </span>
          <a
            href={socialLink.link}
            className="text-blue-600 hover:underline break-all inline-flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {socialLink.link.length > 40 ? `${socialLink.link.substring(0, 40)}...` : socialLink.link}
          </a>
        </div>
        
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-400">ठेगाना: </span>
          <span className="text-gray-900 dark:text-white">{formatAddress(socialLink)}</span>
        </div>
      </div>
    </div>
  );

  if (loading) return <p>Loading social links...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <ResponsiveTable
        data={socialLinks}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={searchTerm}
        title="सामाजिक लिङ्क तालिका"
        keyExtractor={(socialLink) => socialLink.id.toString()}
        mobileCardRender={renderMobileCard}
        emptyMessage="कुनै सामाजिक लिङ्क भेटिएन"
        showSerialNumber={true}
      />
    </div>
  );
};

export default SocialLinkDisplayer;
