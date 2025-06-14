import React, { useEffect, useRef } from "react";

const SpecializationList = ({
  specializations,
  selectedId,
  onSelect,
}: {
  specializations: any[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  // Create a ref for the container and to track the selected item element
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the selected item when selectedId changes or on component mount
  useEffect(() => {
    if (selectedId && containerRef.current) {
      setTimeout(() => {
        if (selectedItemRef.current && containerRef.current) {
          selectedItemRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, [selectedId]);

  const renderSpecialization = (spec: any, depth = 0) => {
    const isSelected = spec._id === selectedId;

    // Function to assign ref to the selected item
    const assignRef = (el: HTMLDivElement | null) => {
      if (isSelected) {
        selectedItemRef.current = el;
      }
    };

    return (
      <div key={spec._id} className="mb-2">
        <div
          ref={assignRef}
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
    <div ref={containerRef} className="max-h-96 overflow-y-auto">
      {specializations.map((spec) => renderSpecialization(spec))}
    </div>
  );
};

export default SpecializationList;
