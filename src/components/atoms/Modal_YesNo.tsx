import React from "react";

const Modal_YesNo = ({ isOpen, modalMessage, onClose, onConfirm }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center flex-col">
        <p>{modalMessage}</p>
        <div>
          <button
            onClick={onConfirm}
            className="mt-4 mr-5 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition duration-200"
          >
            Đồng ý
          </button>
          <button
            onClick={onClose}
            className="mt-4 ml-5 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition duration-200"
          >
            Không
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal_YesNo;
