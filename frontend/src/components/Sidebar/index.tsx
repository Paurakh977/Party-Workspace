"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, 
  Calendar, 
  Users, 
  UserCheck, 
  Crown, 
  MessageSquare, 
  MapPin, 
  Building2, 
  UserPlus, 
  Heart, 
  FileText, 
  User, 
  BarChart3, 
  Settings,
  Menu as MenuIcon,
  X
} from "lucide-react";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import RoleChecker from "../Role/role-checker";
import ImageFetchLoader from "../ImageFetchLoader";
import { resolveImageUrl } from "@/utils/imageUrl";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface Settings {
  settingId: number;
  icon: string | null;
  carousel1: string | null;
  carousel2: string | null;
  carousel3: string | null;
  carousel4: string | null;
  carousel5: string | null;
}

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  credits: number;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <Home className="w-4 h-4" />,
        label: "गृह पृष्ठ",
        route: "/",
      },
      {
        icon: <Calendar className="w-4 h-4" />,
        label: "समितिहरु",
        route: "#",
        children: [
          { label: "समितिहरुको सुची", route: "/tables/committeesTable" },
          { label: "सदस्यहरुको सुची", route: "/tables/membersTable" },
        ],
      },
      {
        icon: <Users className="w-4 h-4" />,
        label: "संगठनात्मक संरचना",
        route: "#",
        children: [
          {
            label: "केन्द्रीय कार्यसमिति",
            route: "/tables/selectedMembersTable/1",
          },
          { label: "प्रदेश कार्यसमिति (inactive)", route: "#" },
          {
            label: "जिल्ला कार्यसमिति",
            route: "/tables/selectedMembersTable/10",
          },
          { label: "क्षेत्रिय कार्यसमिति (inactive)", route: "#" },
          { label: "प्रदेश सभा कार्यसमिति (inactive)", route: "#" },
          {
            label: "पालिका कार्यसमिति",
            route: "/tables/selectedMembersTable/3",
          },
          { label: "वडा कार्यसमिति (inactive)", route: "#" },
          { label: "टोल ईकाई कार्यसमिति (inactive)", route: "#" },
        ],
      },
      {
        icon: <UserCheck className="w-4 h-4" />,
        label: "पार्टी प्रतिनिधि",
        route: "#",
        children: [
          {
            label: "महासमिति सदस्य",
            route: "/tables/selectedMembersTable/4",
          },
          {
            label: "महाधिवेशन प्रतिनिधि",
            route: "/tables/selectedMembersTable/5",
          },
          { label: "प्रदेश अधिवेशन प्रतिनिधि (inactive)", route: "#" },
          { label: "प्रदेश प्रतिनिधि (inactive)", route: "#" },
          { label: "क्षेत्रिय प्रतिनिधि (inactive)", route: "#" },
        ],
      },
      {
        icon: <Crown className="w-4 h-4" />,
        label: "जनप्रतिनिधि",
        route: "#",
        children: [
          {
            label: "राष्ट्रिय सभा",
            route: "/tables/selectedMembersTable/9",
          },
          {
            label: "प्रतिनिधि सभा",
            route: "/tables/selectedMembersTable/8",
          },
          {
            label: "प्रदेश सभा",
            route: "/tables/selectedMembersTable/7",
          },
          { label: "स्थानीय तह (inactive)", route: "#" },
        ],
      },
      {
        icon: <Calendar className="w-4 h-4" />,
        label: "कार्यक्रमहरु",
        route: "#",
        children: [
          { label: "कार्यक्रम थप्नुहोस्", route: "/events/input" },
          { label: "कार्यक्रम सुची", route: "/events/list" },
        ],
      },
      {
        icon: <MessageSquare className="w-4 h-4" />,
        label: "सन्देसहरु",
        route: "#",
        children: [
          { label: "सन्देस पठाउनुहोस्", route: "/messages/input" },
          { label: "सन्देसहरुको सुचि", route: "/messages/list" },
        ],
      },
      {
        icon: <MapPin className="w-4 h-4" />,
        label: "जनप्रतिनिधिहरु",
        route: "#",
        children: [
          { label: "प्रतिनिधि सभा सदस्यहरु", route: "#" },
          { label: "राष्ट्रिय सभा सदस्यहरु", route: "#" },
          { label: "प्रदेश सभा सदस्यहरु", route: "#" },
          { label: "जि.स.स. पदाधिकाहरू", route: "#" },
          { label: "स्थानीय तहका पदाधिकाहरू", route: "#" },
        ],
      },
      {
        icon: <Building2 className="w-4 h-4" />,
        label: "भातृ संघहरु",
        route: "#",
        children: [
          { label: "नयाँ संघ थप्नुहोस्", route: "#" },
          { label: "संघहरुको सुची", route: "#" },
        ],
      },
      {
        icon: <UserPlus className="w-4 h-4" />,
        label: "प्रयोगकर्ता",
        route: "#",
        children: [
          { label: "प्रयोगकर्ता थप्नुहोस्", route: "/forms/usersForm" },
          { label: "प्रयोगकर्ताहरुको सुची", route: "/tables/usersTable" },
        ],
      },
      {
        icon: <Heart className="w-4 h-4" />,
        label: "शुभेच्छुक संस्थाहरु",
        route: "#",
        children: [
          { label: "नयाँ संस्था थप्नुहोस्", route: "#" },
          { label: "संस्थाहरुको सुची", route: "#" },
        ],
      },
      {
        icon: <FileText className="w-4 h-4" />,
        label: "विवरण प्रविष्टी",
        route: "/forms/membersForm",
      },
      {
        icon: <User className="w-4 h-4" />,
        label: "प्रोफाइल",
        route: "/profile",
      },
      {
        icon: <BarChart3 className="w-4 h-4" />,
        label: "रिप‍ोर्ट",
        route: "/tables",
      },
      {
        icon: <Settings className="w-4 h-4" />,
        label: "सेटिङहरु",
        route: "#",
        children: [
          { label: "समिति सेटिङ", route: "/forms/committeeForm" },
          { label: "उपसमिति सेटिङ", route: "/forms/subCommitteeForm" },
          { label: "तह सेटिङ", route: "/forms/levelsForm" },
          { label: "संरचना सेटिङ", route: "/forms/structuresForm" },
          { label: "सामाजिक लिंक अपलोड", route: "/forms/video-links" },
          { label: "पि.डि.एफ अपलोड", route: "/forms/pdfs" },
        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const role = RoleChecker();
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const settings = ImageFetchLoader();

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
        <aside
        className={`fixed left-0 top-0 z-[1100] flex h-screen w-72 flex-col overflow-y-hidden duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0

          /* Light mode: solid white with gray border */
          bg-white border-r border-gray-200

          /* Shadow for depth */
          shadow-2xl shadow-black/10

          /* Dark mode */
          dark:bg-gray-900 dark:border-gray-700
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {settings && settings.icon ? (
                <Image
                  src={resolveImageUrl(settings.icon)}
                  alt="Uploaded Icon"
                  width={32}
                  height={32}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/logo/logo.svg";
                  }}
                  className="rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
                  नेपाली काँग्रेस
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  अभियान
                </p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="rounded-lg p-2 text-gray-600 hover:bg-white/50 hover:text-gray-800 transition-all duration-200 lg:hidden dark:text-gray-300 dark:hover:bg-gray-700/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav className="p-4 space-y-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-3">
                  {group.name}
                </h3>
                <ul className="space-y-1">
                  {group.menuItems
                    .filter(
                      (menuItem) =>
                        (menuItem.label !== "सेटिङहरु" &&
                          menuItem.label !== "प्रयोगकर्ता") ||
                        role === "superadmin",
                    )
                    .map((menuItem, menuIndex) => (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                प्रयोगकर्ता
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {role === "superadmin" ? "सुपर एडमिन" : "प्रयोगकर्ता"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;