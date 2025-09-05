"use client";

import React, { useState, useCallback } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  mobileHidden?: boolean;
  className?: string;
  width?: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResponsiveTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: PaginationData;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSearch?: (search: string) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  searchValue?: string;
  className?: string;
  emptyMessage?: string;
  title?: string;
  actions?: React.ReactNode;
  mobileCardRender?: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

export default function ResponsiveTable<T>({
  data,
  columns,
  pagination,
  loading = false,
  onPageChange,
  onSearch,
  onSort,
  searchValue = "",
  className = "",
  emptyMessage = "कुनै डेटा भेटिएन",
  title,
  actions,
  mobileCardRender,
  keyExtractor,
}: ResponsiveTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);

  const handleSort = useCallback((column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    if (onSort) {
      onSort(column, newDirection);
    }
  }, [sortColumn, sortDirection, onSort]);

  const getValue = (item: T, key: keyof T | string): any => {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj: any, k: string) => obj?.[k], item);
    }
    return item[key as keyof T];
  };

  // Mobile Card View
  const MobileCardView = () => (
    <div className="space-y-4">
      {data.map((item, index) => {
        if (mobileCardRender) {
          return (
            <div key={keyExtractor(item)} className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-4 shadow-sm">
              {mobileCardRender(item, index)}
            </div>
          );
        }

        return (
          <div key={keyExtractor(item)} className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-4 shadow-sm">
            <div className="space-y-3">
              {columns.filter(col => !col.mobileHidden).map((column) => {
                const value = getValue(item, column.key);
                return (
                  <div key={String(column.key)} className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {column.label}
                    </span>
                    <div className="text-sm text-black dark:text-white break-words">
                      {column.render ? column.render(value, item) : value || '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Desktop Table View
  const DesktopTableView = () => (
    <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`min-w-[120px] px-4 py-4 font-medium text-black dark:text-white ${
                    column.className || ""
                  } ${column.sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4" : ""}`}
                  onClick={column.sortable ? () => handleSort(String(column.key)) : undefined}
                  style={column.width ? { width: column.width } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{column.label}</span>
                    {column.sortable && (
                      <div className="ml-2">
                        {sortColumn === column.key && (
                          <span className="text-primary">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
              >
                {columns.map((column) => {
                  const value = getValue(item, column.key);
                  return (
                    <td
                      key={String(column.key)}
                      className={`border-b border-[#eee] px-4 py-5 dark:border-strokedark ${
                        column.className || ""
                      }`}
                    >
                      <div className="break-words">
                        {column.render ? column.render(value, item) : value || '-'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const Pagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { page, totalPages, total, limit } = pagination;
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, total);

    return (
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">{startIndex}</span> देखि <span className="font-medium">{endIndex}</span> सम्म, 
          कुल <span className="font-medium">{total}</span> मध्ये
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page <= 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-boxdark dark:border-strokedark dark:text-gray-300"
          >
            <FaChevronLeft className="h-3 w-3" />
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange && onPageChange(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  pageNum === page
                    ? "z-10 bg-primary border-primary text-white"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-boxdark dark:border-strokedark dark:text-gray-300"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-boxdark dark:border-strokedark dark:text-gray-300"
          >
            <FaChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            {title && (
              <h4 className="text-xl font-semibold text-black dark:text-white">
                {title}
              </h4>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            {onSearch && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:bg-boxdark dark:border-strokedark dark:text-white"
                  placeholder="खोज्नुहोस्..."
                />
              </div>
            )}
            
            {/* Actions */}
            {actions && (
              <div className="flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            {emptyMessage}
          </div>
        </div>
      )}

      {/* Table Content */}
      {!loading && data.length > 0 && (
        <>
          {isMobile ? <MobileCardView /> : <DesktopTableView />}
          <Pagination />
        </>
      )}
    </div>
  );
}
