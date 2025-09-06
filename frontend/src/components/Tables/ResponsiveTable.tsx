"use client";

import React, { useState, useCallback } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T, index?: number) => React.ReactNode;
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
  showSerialNumber?: boolean;
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
  showSerialNumber = false,
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
        const serialNumber = pagination 
          ? (pagination.page - 1) * pagination.limit + index + 1
          : index + 1;

        if (mobileCardRender) {
          return (
            <div key={keyExtractor(item)} className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-4 shadow-sm">
              {showSerialNumber && (
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">S.N</span>
                  <span className="text-sm text-black dark:text-white font-medium">{serialNumber}</span>
                </div>
              )}
              {mobileCardRender(item, index)}
            </div>
          );
        }

        return (
          <div key={keyExtractor(item)} className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-4 shadow-sm">
            <div className="space-y-3">
              {showSerialNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">S.N</span>
                  <span className="text-sm text-black dark:text-white font-medium">{serialNumber}</span>
                </div>
              )}
              {columns.filter(col => !col.mobileHidden).map((column) => {
                const value = getValue(item, column.key);
                return (
                  <div key={String(column.key)} className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {column.label}
                    </span>
                    <div className="text-sm text-black dark:text-white break-words">
                      {column.render ? column.render(value, item, index) : value || '-'}
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
  const DesktopTableView = () => {
    const allColumns = showSerialNumber 
      ? [{ key: 'serialNumber', label: 'S.N', width: '60px', className: 'text-center' }, ...columns]
      : columns;

    return (
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {allColumns.map((column) => (
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
              {data.map((item, index) => {
                const serialNumber = pagination 
                  ? (pagination.page - 1) * pagination.limit + index + 1
                  : index + 1;
                
                return (
                  <tr
                    key={keyExtractor(item)}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
                  >
                    {allColumns.map((column) => {
                      if (column.key === 'serialNumber') {
                        return (
                          <td
                            key="serialNumber"
                            className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center"
                          >
                            <div className="break-words">
                              {serialNumber}
                            </div>
                          </td>
                        );
                      }
                      
                      const value = getValue(item, column.key);
                      return (
                        <td
                          key={String(column.key)}
                          className={`border-b border-[#eee] px-4 py-5 dark:border-strokedark ${
                            column.className || ""
                          }`}
                        >
                          <div className="break-words">
                            {column.render ? column.render(value, item, index) : value || '-'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const Pagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { page, totalPages, total, limit } = pagination;
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, total);

    const handlePageChange = (newPage: number) => {
      if (onPageChange && newPage >= 1 && newPage <= totalPages && newPage !== page) {
        onPageChange(newPage);
      }
    };

    // Generate visible page numbers (sliding window approach)
    const generatePageNumbers = () => {
      const maxVisible = 5; // Maximum number of page buttons to show
      const pages: number[] = [];
      
      if (totalPages <= maxVisible) {
        // If total pages is less than max visible, show all
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Calculate the start and end of the visible window
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        // Adjust if we're near the end
        if (end - start < maxVisible - 1) {
          start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    };

    const visiblePages = generatePageNumbers();

    return (
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">{startIndex}</span> देखि <span className="font-medium">{endIndex}</span> सम्म, 
          कुल <span className="font-medium">{total}</span> मध्ये
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-boxdark dark:border-strokedark dark:text-gray-300 transition-colors"
            title="अघिल्लो पृष्ठ"
          >
            <FaChevronLeft className="h-3 w-3" />
          </button>
          
          {/* First page and ellipsis if needed */}
          {visiblePages[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:shadow-md dark:bg-boxdark dark:border-strokedark dark:text-gray-300 dark:hover:bg-meta-4 transition-all duration-200"
                title="पृष्ठ 1"
              >
                1
              </button>
              {visiblePages[0] > 2 && (
                <span className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 dark:bg-boxdark dark:border-strokedark dark:text-gray-300">
                  ...
                </span>
              )}
            </>
          )}
          
          {/* Visible page numbers */}
          {visiblePages.map((pageNum) => {
            const isCurrentPage = pageNum === page;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium transition-all duration-200 ${
                  isCurrentPage
                    ? "z-10 bg-blue-600 border-blue-600 text-white shadow-lg"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:shadow-md dark:bg-boxdark dark:border-strokedark dark:text-gray-300 dark:hover:bg-meta-4"
                }`}
                title={`पृष्ठ ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {/* Last page and ellipsis if needed */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 dark:bg-boxdark dark:border-strokedark dark:text-gray-300">
                  ...
                </span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:shadow-md dark:bg-boxdark dark:border-strokedark dark:text-gray-300 dark:hover:bg-meta-4 transition-all duration-200"
                title={`पृष्ठ ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}
          
          {/* Next button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-boxdark dark:border-strokedark dark:text-gray-300 transition-colors"
            title="अर्को पृष्ठ"
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