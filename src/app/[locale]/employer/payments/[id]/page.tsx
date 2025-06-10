"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";
import { usePayment } from "@/contexts/AppContext";
import { IPayment } from "@/stores/paymentStore";
import { formatDate } from "@/utils/fommat_date";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import PaymentStatusBadge from "@/components/atoms/PaymentStatusBadge";
import { useTranslations } from "next-intl";
import PaymentDetailRow from "@/components/molecules/PaymentDetailRow";
import LoadingState from "@/components/atoms/LoadingState";
import ErrorState from "@/components/atoms/ErrorState";

const PaymentDetailsPage = observer(() => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const paymentStore = usePayment();
  const paymentId = params.id as string;

  const [payment, setPayment] = useState<IPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentStore?.getPaymentDetails(paymentId);

      if (response?.payment) {
        setPayment(response.payment);
      } else {
        setError(response?.message || "Failed to load payment details");
      }
    } catch (err) {
      console.error("Error in payment details:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);

  const handleGoBack = () => {
    router.push("/employer/payments");
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !payment) {
    return (
      <ErrorState
        t={t}
        message={error || "Payment not found"}
        onRetry={fetchPaymentDetails}
      />
    );
  }

  // Handle job title or ID display
  const jobTitle =
    typeof payment.jobId === "object" && payment.jobId !== null
      ? payment.jobId.title
      : "Unknown Job";

  // Handle job ID
  const jobId =
    typeof payment.jobId === "object" && payment.jobId !== null
      ? payment.jobId._id
      : payment.jobId;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <VectorLeftIcon />
        <span className="ml-2">{t("payment_details.back_to_history")}</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
              {t("payment_details.title")}
            </h1>
            <PaymentStatusBadge t={t} status={payment.status} />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t("payment_details.payment_info")}
              </h2>
              <dl className="divide-y divide-gray-200">
                <PaymentDetailRow
                  label={t("payment.transaction_id")}
                  value={payment.transactionId}
                />
                <PaymentDetailRow
                  label={t("payment.table.amount")}
                  value={`${payment.amount.toLocaleString()} ${t("all.VND")}`}
                />
                <PaymentDetailRow
                  label={t("payment.table.package")}
                  value={payment.package}
                />
                <PaymentDetailRow
                  label={t("payment.table.date")}
                  value={formatDate(new Date(payment.createdAt))}
                />
                <PaymentDetailRow
                  label={t("payment.table.status")}
                  value={<PaymentStatusBadge t={t} status={payment.status} />}
                />
              </dl>
            </div>

            {/* Job Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t("payment_details.job_details")}
              </h2>
              <dl className="divide-y divide-gray-200">
                <PaymentDetailRow
                  label={t("payment_details.job_title")}
                  value={jobTitle}
                />
                <PaymentDetailRow
                  label={t("payment.job_id")}
                  value={jobId}
                  isLink={true}
                  href={`/jobs/${jobId}`}
                />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PaymentDetailsPage;
