import React from "react";
import PaymentStatusBadge from "../atoms/PaymentStatusBadge";
import { formatDate } from "@/utils/fommat_date";
import { IPayment } from "@/stores/paymentStore";

const PaymentCard = ({
  t,
  payment,
  onClick,
}: {
  t: any;
  payment: IPayment;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm mb-3 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-gray-500">
          {formatDate(new Date(payment.createdAt))}
        </span>
        <PaymentStatusBadge t={t} status={payment.status} />
      </div>

      <div className="mb-2">
        <h3 className="font-medium">{payment.package}</h3>
        <p className="text-gray-700 text-sm truncate">
          {t("payment.transaction_id")}: {payment.transactionId}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">
          {t("payment.job_id")}: {payment.jobId._id}
        </span>
        <span className="font-semibold text-lg">
          {payment.amount.toLocaleString()} {t("all.VND")}
        </span>
      </div>
    </div>
  );
};

export default PaymentCard;
