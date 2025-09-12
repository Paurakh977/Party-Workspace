import React from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item: any): boolean => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => child.route === pathname);
    }
    return false;
  };
  

  const isItemActive = isActive(item);

  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`group relative flex items-center gap-2.5 rounded-md px-3 py-2 font-medium transition-all
          ${
            isItemActive
              ? "bg-gray-200 text-gray-900 shadow-sm ring-1 ring-gray-300 dark:bg-white/20 dark:text-white dark:ring-white/30"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
          }`}
        
      >
        {item.icon}
        <span className="truncate">{item.label}</span>
        {item.children && (
          <svg
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
              pageName === item.label.toLowerCase() && "rotate-180"
            }`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
              fill="currentColor"
            />
          </svg>
        )}
      </Link>

      {item.children && (
        <div
          className={`translate transform overflow-hidden ${
            pageName !== item.label.toLowerCase() && "hidden"
          }`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
