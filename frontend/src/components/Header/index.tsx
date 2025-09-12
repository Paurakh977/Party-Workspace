import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import SearchComponent from "./SearchComponent";
import { useState } from "react";
import { Search, Menu } from "lucide-react";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1200] flex w-full border-b border-black/5 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm dark:border-white/5 dark:bg-gray-900/80">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="hidden items-center gap-2 sm:flex">
            <Image width={28} height={28} src={"/images/logo/logo-icon.svg"} alt="Logo" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Nepali Congress</span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center sm:flex">
          <SearchComponent />
        </div>

        <div className="flex items-center gap-3 2xsm:gap-5">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 sm:hidden dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
            <DropdownMessage />
          </ul>
          <DropdownUser />
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute left-0 right-0 top-full z-[1400] border-b border-black/5 bg-white p-3 sm:hidden dark:border-white/5 dark:bg-gray-900">
          <SearchComponent />
        </div>
      )}
    </header>
  );
};

export default Header;
