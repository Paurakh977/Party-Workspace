"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <ul className="mb-2 mt-1 flex flex-col gap-1 pl-6">
      {item.map((child: any, index: number) => {
        const active = pathname === child.route || pathname.startsWith(child.route);

        return (
          <li key={index}>
            <Link
              href={child.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-all
                ${
                  active
                    ? "bg-gray-200 text-gray-900 font-medium border-l-2 border-blue-500 dark:bg-white/20 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
            >
              {child.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarDropdown;
