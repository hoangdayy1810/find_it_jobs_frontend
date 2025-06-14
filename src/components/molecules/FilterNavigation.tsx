import React from "react";
import { useTranslations } from "next-intl";
import AllFilterIcon from "@/components/atoms/icons/AllFilterIcon";
import ActiveFilterIcon from "@/components/atoms/icons/ActiveFilterIcon";
import InactiveFilterIcon from "@/components/atoms/icons/InactiveFilterIcon";
import FilterCloseIcon from "@/components/atoms/icons/FilterCloseIcon";

export type FilterType = "all" | "active" | "inactive" | "closed";

interface FilterNavigationProps {
  currentFilter: FilterType;
  setFilter: (filter: FilterType) => void;
  setCurrentPage: (page: number) => void;
  counts: {
    all: number;
    active: number;
    inactive: number;
    closed: number;
  };
}

const FilterNavigation: React.FC<FilterNavigationProps> = ({
  currentFilter,
  setFilter,
  setCurrentPage,
  counts,
}) => {
  const t = useTranslations();

  const handleFilterChange = (filter: FilterType) => {
    setFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="relative">
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100">
          <button
            onClick={() => handleFilterChange("all")}
            className={`flex items-center min-w-[120px] px-6 py-4 text-sm font-medium transition-colors relative ${
              currentFilter === "all"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <AllFilterIcon />
            {t("employer.myjobs.filters.all")}
            {counts.all > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {counts.all}
              </span>
            )}
            {currentFilter === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>

          <button
            onClick={() => handleFilterChange("active")}
            className={`flex items-center min-w-[120px] px-6 py-4 text-sm font-medium transition-colors relative ${
              currentFilter === "active"
                ? "text-green-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <ActiveFilterIcon />
            {t("employer.myjobs.filters.active")}
            {counts.active > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-600">
                {counts.active}
              </span>
            )}
            {currentFilter === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>

          <button
            onClick={() => handleFilterChange("inactive")}
            className={`flex items-center min-w-[120px] px-6 py-4 text-sm font-medium transition-colors relative ${
              currentFilter === "inactive"
                ? "text-yellow-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <InactiveFilterIcon />
            {t("employer.myjobs.filters.inactive")}
            {counts.inactive > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                {counts.inactive}
              </span>
            )}
            {currentFilter === "inactive" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600"></div>
            )}
          </button>

          <button
            onClick={() => handleFilterChange("closed")}
            className={`flex items-center min-w-[120px] px-6 py-4 text-sm font-medium transition-colors relative ${
              currentFilter === "closed"
                ? "text-red-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FilterCloseIcon />
            {t("employer.myjobs.filters.closed")}
            {counts.closed > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600">
                {counts.closed}
              </span>
            )}
            {currentFilter === "closed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterNavigation;
