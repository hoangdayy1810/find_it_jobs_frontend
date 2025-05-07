import React from "react";

interface InputProfileProps {
  icon?: React.ReactNode;
  text?: string;
  placeholder?: string;
  isEdit?: boolean;
  typeInput?: string;
  value?: any;
  onChange?: (e: any) => void;
  error?: string;
  options?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
}

const Input_Profile: React.FC<InputProfileProps> = ({
  icon,
  text,
  placeholder,
  isEdit = false,
  typeInput = "text",
  value,
  onChange,
  error,
  options = [],
  children,
  ...rest
}) => {
  // Rendering logic based on isEdit and typeInput
  const renderInput = () => {
    if (!isEdit) {
      return <p className="text-gray-700">{text || placeholder}</p>;
    }

    if (children) {
      return children;
    }

    if (typeInput === "select" && options.length > 0) {
      // Convert array value to string for single-select dropdown
      const selectValue = Array.isArray(value) ? value[0] || "" : value;

      return (
        <select
          className="w-full p-2 border rounded-md"
          value={selectValue}
          onChange={onChange}
          {...rest}
        >
          <option value="">Chọn...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={typeInput}
        className="w-full p-2 border rounded-md"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    );
  };

  return (
    <div>
      <div className="flex gap-4 mb-3">
        {icon && <div className="flex items-center mb-1">{icon}</div>}
        {renderInput()}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input_Profile;
