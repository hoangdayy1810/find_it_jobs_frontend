import React from "react";

interface LogoutButtonProps {
  text: string;
  icon: string;
  handleClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  text,
  icon,
  handleClick,
}) => {
  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center p-2 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-100"
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </button>
  );
};

export default LogoutButton;
