import React from "react";

const StatusBadge = ({ t, status }: { t: any; status: string }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case "pending":
        return {
          text: t("application.status.pending"),
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      case "approved":
        return {
          text: t("application.status.approved"),
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "rejected":
        return {
          text: t("application.status.rejected"),
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      default:
        return {
          text: t("myapplies.card.unknown_status"),
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div
      className={`${statusDisplay.bgColor} ${statusDisplay.textColor} px-4 py-2 rounded-full inline-flex items-center text-sm font-medium`}
    >
      <span
        className={`w-2 h-2 ${
          status === "pending"
            ? "bg-yellow-500"
            : status === "approved"
            ? "bg-green-500"
            : "bg-red-500"
        } rounded-full mr-2`}
      ></span>
      {statusDisplay.text}
    </div>
  );
};

export default StatusBadge;
