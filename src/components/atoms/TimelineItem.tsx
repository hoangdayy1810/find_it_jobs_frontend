import React from "react";

const TimelineItem = ({
  date,
  title,
  description,
  isLast = false,
}: {
  date: string;
  title: string;
  description?: string;
  isLast?: boolean;
}) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-4">
      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
      {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
    </div>
    <div className="pb-6">
      <p className="text-xs text-gray-500">{date}</p>
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  </div>
);

export default TimelineItem;
