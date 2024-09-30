import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import SearchComponent from "./SearchComponent";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to control search visibility on mobile

  return (
    <header className="sticky top-0 z-999 flex w-full bg-orange-300 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              {/* Add the hamburger icon code here */}
              <Image
                width={50}
                height={50}
                src={"/images/logo/logo-icon.svg"}
                alt="Logo"
              />
            </span>
          </button>
        </div>

        {/* SearchComponent (Hidden on mobile by default) */}
        <div className="hidden sm:block">
          <SearchComponent />
        </div>

        {/* Search button for mobile */}
        <div className="block sm:hidden">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-gray-600 bg-transparent dark:text-white"
          >
            <FaSearch />
          </button>
        </div>

        {/* Mobile search input, visible when search button is clicked */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-16 z-50 bg-white p-4 sm:hidden">
            <SearchComponent />
          </div>
        )}

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />

            {/* Notification Menu Area */}
            <DropdownNotification />

            {/* Chat Notification Area */}
            <DropdownMessage />
          </ul>

          {/* User Area */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
