import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface ModalYesNoProps {
  isOpen: boolean;
  modalTitle?: string;
  modalMessage: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: "blue" | "red" | "green";
  t?: any;
}

const Modal_YesNo: React.FC<ModalYesNoProps> = ({
  isOpen,
  modalTitle,
  modalMessage,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  confirmButtonColor = "blue",
  t: propT,
}) => {
  const defaultT = useTranslations();
  const t = propT || defaultT;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const getButtonColorClass = () => {
    switch (confirmButtonColor) {
      case "red":
        return "bg-red-600 hover:bg-red-700";
      case "green":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {modalTitle && (
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">{modalTitle}</h3>
          </div>
        )}

        <div className="px-6 py-4">
          <div className="mt-2">
            <p className="text-gray-700">{modalMessage}</p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-10 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {cancelText || t("modal-yes-no.no")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center rounded-md border border-transparent ${getButtonColorClass()} px-10 py-1 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {confirmText || t("modal-yes-no.yes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal_YesNo;
