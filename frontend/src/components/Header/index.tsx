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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1200] flex w-full border-b border-black/5 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm dark:border-white/5 dark:bg-gray-900/80">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-[1300] block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <Image
                width={50}
                height={50}
                src={"/images/logo/logo-icon.svg"}
                alt="Logo"
              />
            </span>
          </button>
        </div>

        <div className="hidden sm:block">
          <SearchComponent />
        </div>

        <div className="block sm:hidden">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="bg-transparent text-gray-700 dark:text-white"
          >
            <FaSearch />
          </button>
        </div>

        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-16 z-[1400] bg-white p-4 sm:hidden">
            <SearchComponent />
          </div>
        )}

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
            <DropdownMessage />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
