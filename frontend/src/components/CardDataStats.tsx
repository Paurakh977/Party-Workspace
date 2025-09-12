import React, { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.1)] hover:-translate-y-1 dark:bg-gray-900 dark:shadow-[0_1px_3px_rgba(255,255,255,0.1),0_1px_2px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_10px_25px_rgba(255,255,255,0.1),0_4px_10px_rgba(255,255,255,0.05)]">
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-gray-800/30"></div>
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Icon and main stats row */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent text-blue-600 ring-1 ring-blue-500/10 transition-all duration-300 group-hover:from-blue-500/20 group-hover:via-blue-500/10 group-hover:ring-blue-500/20 group-hover:scale-110 dark:from-blue-400/20 dark:via-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
            {children}
          </div>
          
          {/* Rate indicator */}
          {rate && (
            <div className="flex items-center">
              {levelUp && (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-500/10 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{rate}</span>
                </div>
              )}
              {levelDown && (
                <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-500/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>{rate}</span>
                </div>
              )}
              {!levelUp && !levelDown && (
                <div className="rounded-full bg-gray-500/10 px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
                  {rate}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="mt-6 space-y-2">
          {/* Number */}
          <div className="text-3xl font-bold tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-100">
            {total}
          </div>
          
          {/* Title */}
          <div className="text-sm font-medium text-gray-600 transition-colors duration-200 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300">
            {title}
          </div>
        </div>
      </div>
      
      {/* Subtle bottom border accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </div>
  );
};

export default CardDataStats;