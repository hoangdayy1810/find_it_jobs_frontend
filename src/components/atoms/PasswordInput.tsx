import React from "react";
import HideEye from "./icons/HideEye";
import ShowEye from "./icons/ShowEye";

const PasswordInput = ({
  id,
  label,
  register,
  errors,
  showPassword,
  toggleVisibility,
  placeholder,
}: {
  id: string;
  label: string;
  register: any;
  errors: any;
  showPassword: boolean;
  toggleVisibility: () => void;
  placeholder: string;
}) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        className={`w-full px-3 py-2 border ${
          errors[id] ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        placeholder={placeholder}
        {...register(id)}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        tabIndex={-1}
      >
        {showPassword ? <HideEye /> : <ShowEye />}
      </button>
    </div>
    {errors[id] && (
      <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>
    )}
  </div>
);

export default PasswordInput;
