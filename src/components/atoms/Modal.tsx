import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import SuccessIconModal from "./icons/SuccessIconModal";
import ErrorIconModal from "./icons/ErrorIconModal";
import InfoIconModal from "./icons/InfoIconModal";

interface ModalProps {
  isOpen: boolean;
  modalMessage: string;
  onClose: () => void;
  type?: "success" | "error" | "info";
  title?: string;
  t?: any;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  modalMessage,
  onClose,
  type = "info",
  title,
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

  const getIconByType = () => {
    switch (type) {
      case "success":
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <SuccessIconModal />
          </div>
        );
      case "error":
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <ErrorIconModal />
          </div>
        );
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <InfoIconModal />
          </div>
        );
    }
  };

  const getButtonColorByType = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      case "error":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 transition-opacity duration-200 ${
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
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div>
            <div className="mb-4 text-center">
              {title && (
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h3>
              )}
            </div>
            {getIconByType()}
            <div className="mt-4">
              <p className="text-center">{modalMessage}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 flex justify-center sm:px-6">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-md border border-transparent px-10 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${getButtonColorByType()}`}
            onClick={onClose}
          >
            {t("modal.close", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
