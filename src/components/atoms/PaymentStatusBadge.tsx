import React from "react";

const PaymentStatusBadge = ({ status, t }: { status: string; t: any }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";

  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "failed":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {t(`payment.status.${status.toLowerCase()}`)}
    </span>
  );
};

export default PaymentStatusBadge;
