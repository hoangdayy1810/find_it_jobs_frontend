import React from "react";

const FilterSection2 = ({
  t,
  onFilterChange,
  statusFilter,
}: {
  t: any;
  onFilterChange: (value: string) => void;
  statusFilter: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mr-4 whitespace-nowrap"
        >
          {t("payment.filter.label")}
        </label>
        <select
          id="status"
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={statusFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="">{t("payment.filter.all")}</option>
          <option value="completed">{t("payment.status.completed")}</option>
          <option value="pending">{t("payment.status.pending")}</option>
          <option value="failed">{t("payment.status.failed")}</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSection2;
