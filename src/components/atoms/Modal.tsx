import React from "react";

const Modal = ({ isOpen, modalMessage, onClose }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center flex-col">
        <p>{modalMessage}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default Modal;
