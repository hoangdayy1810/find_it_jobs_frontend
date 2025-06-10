import React from "react";
import ErrorIcon from "./icons/ErrorIcon";

const ErrorState = ({
  t,
  message,
  onRetry,
}: {
  t: any;
  message: string;
  onRetry: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <ErrorIcon />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 mb-6">{t("payment_details.error.message")}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {t("payment.try_again")}
      </button>
    </div>
  );
};

export default ErrorState;
