import React from "react";

const RadioFilterGroup = ({
  name,
  options,
  selectedValue,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-start hover:cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 hover:cursor-pointer"
          />
          <span className="ml-2 text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioFilterGroup;
