import React from "react";

const PaginationButton = ({
  children,
  onClick,
  disabled = false,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) => (
  <button
    className={`px-3 py-1 rounded ${
      active
        ? "bg-blue-600 text-white"
        : disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default PaginationButton;
