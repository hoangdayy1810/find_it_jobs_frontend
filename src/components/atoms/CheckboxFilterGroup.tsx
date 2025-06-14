import React from "react";

const CheckboxFilterGroup = ({
  name,
  options,
  selectedValues,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) => {
  const handleChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-start">
          <input
            type="checkbox"
            name={`${name}[]`}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
            className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxFilterGroup;
