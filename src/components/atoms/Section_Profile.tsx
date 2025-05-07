import React from "react";
import Add_Circle from "./icons/Add_Circle";

interface Section_ProfileProps {
  title: string;
  content?: string;
  children?: React.ReactNode;
}

const Section_Profile: React.FC<Section_ProfileProps> = ({
  title,
  content,
  children,
}) => {
  return (
    <div className="bg-white p-6 shadow-sm mb-4 rounded-lg relative">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 italic mb-4">{content}</p>
      {children}
    </div>
  );
};

export default Section_Profile;
