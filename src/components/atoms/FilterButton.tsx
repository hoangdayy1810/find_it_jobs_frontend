import React from "react";

const FilterButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`px-6 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-blue-600"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default FilterButton;
