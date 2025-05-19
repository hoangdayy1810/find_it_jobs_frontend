import React from "react";

const SpecializationList = ({
  specializations,
  selectedId,
  onSelect,
}: {
  specializations: any[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const renderSpecialization = (spec: any, depth = 0) => {
    const isSelected = spec._id === selectedId;

    return (
      <div key={spec._id} className="mb-2">
        <div
          className={`pl-${depth} py-1 cursor-pointer hover:text-red-400 transition-colors flex items-center ${
            isSelected ? "font-semibold text-red-600" : ""
          }`}
          onClick={() => onSelect(spec._id)}
        >
          <span className="text-sm truncate">{spec.name}</span>
        </div>

        {spec.children && spec.children.length > 0 && (
          <div className="pl-6 border-l border-gray-200">
            {spec.children.map((child: any) =>
              renderSpecialization(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {specializations.map((spec) => renderSpecialization(spec))}
    </div>
  );
};

export default SpecializationList;
