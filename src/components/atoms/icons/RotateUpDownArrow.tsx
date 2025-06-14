import React from "react";

const RotateUpDownArrow = ({ expanded }: { expanded: boolean }) => {
  return (
    <svg
      className={`w-4 h-4 transform transition-transform ${
        expanded ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  );
};

export default RotateUpDownArrow;
