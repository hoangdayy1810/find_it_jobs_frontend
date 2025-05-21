import React from "react";

const SearchInput: React.FC<{
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}> = ({ placeholder, value, onChange, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="relative h-8 md:h-11 border border-gray-300 rounded-xl shadow-sm">
        <input
          type="text"
          className="w-full h-full focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent rounded-lg pl-4 pr-12 text-gray-700"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 h-4/5 w-10 md:w-1/12 bg-[#C92127] rounded-md cursor-pointer flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <img
              className="h-5 w-5 md:h-6 md:w-6"
              src="/images/header/ico_search_white.svg"
              alt="search"
            />
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
