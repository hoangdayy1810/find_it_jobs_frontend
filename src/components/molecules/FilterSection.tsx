"use client";
import React, { useState } from "react";
import RotateUpDownArrow from "../atoms/icons/RotateUpDownArrow";

// Filter Section Component
const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-4 border-b pb-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-gray-700">{title}</h3>
        <RotateUpDownArrow expanded={expanded} />
      </div>

      {expanded && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
};

export default FilterSection;
