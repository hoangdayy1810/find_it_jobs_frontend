import React from "react";
import EmptyIcon from "./icons/EmptyIcon";

const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
      <EmptyIcon />
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;
