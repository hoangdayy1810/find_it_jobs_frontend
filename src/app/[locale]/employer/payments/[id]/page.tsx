"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";
import { usePayment } from "@/contexts/AppContext";
import { IPayment } from "@/stores/paymentStore";
import { formatDate } from "@/utils/fommat_date";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";

// Payment Status Badge Component
const PaymentStatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let statusText = status;

  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      statusText = "Completed";
      break;
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      statusText = "Pending";
      break;
    case "failed":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      statusText = "Failed";
      break;
    case "refunded":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      statusText = "Refunded";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
    >
      {statusText}
    </span>
  );
};

// Payment Detail Row Component
const PaymentDetailRow = ({
  label,
  value,
  isLink = false,
  href = "",
}: {
  label: string;
  value: React.ReactNode;
  isLink?: boolean;
  href?: string;
}) => (
  <div className="flex flex-col sm:flex-row py-3 border-b border-gray-200">
    <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0 sm:w-1/3">
      {label}
    </dt>
    <dd className="text-sm text-gray-900 sm:w-2/3">
      {isLink ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        value
      )}
    </dd>
  </div>
);

// Invoice Section Component
const InvoiceSection = ({ payment }: { payment: IPayment }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Receipt</h3>

    <div className="flex justify-between items-center mb-6">
      <div>
        <p className="text-sm text-gray-500">Transaction ID</p>
        <p className="text-md font-medium">{payment.transactionId}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Date</p>
        <p className="text-md font-medium">
          {formatDate(new Date(payment.createdAt))}
        </p>
      </div>
    </div>

    <div className="border-t border-gray-200 pt-4 pb-2">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">Package</span>
        <span className="text-sm font-medium">{payment.package}</span>
      </div>
    </div>

    <div className="border-t border-gray-200 pt-4">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium">Total</span>
        <span className="text-base font-bold text-gray-900">
          {payment.amount.toLocaleString()} VND
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Payment Status</span>
        <PaymentStatusBadge status={payment.status} />
      </div>
    </div>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error State Component
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-red-500 mx-auto mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
    <p className="text-gray-500 mb-6">
      We couldn't load the payment details. Please try again.
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Add this method to paymentStore
// async getPaymentDetails(paymentId: string) {
//   try {
//     const response = await api.get(`/api/payments/${paymentId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching payment details:", error);
//     if (axios.isAxiosError(error) && typeof error.response?.data === "object") {
//       return error.response.data;
//     }
//     return { success: false, message: "Failed to fetch payment details" };
//   }
// }

// Main Payment Details Page Component
const PaymentDetailsPage = observer(() => {
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
        <span className="ml-2">Back to Payment History</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
              Payment Details
            </h1>
            <PaymentStatusBadge status={payment.status} />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Payment Information
              </h2>
              <dl className="divide-y divide-gray-200">
                <PaymentDetailRow
                  label="Transaction ID"
                  value={payment.transactionId}
                />
                <PaymentDetailRow
                  label="Amount"
                  value={`${payment.amount.toLocaleString()} VND`}
                />
                <PaymentDetailRow label="Package" value={payment.package} />
                <PaymentDetailRow
                  label="Date"
                  value={formatDate(new Date(payment.createdAt))}
                />
                <PaymentDetailRow
                  label="Status"
                  value={<PaymentStatusBadge status={payment.status} />}
                />
              </dl>
            </div>

            {/* Job Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Job Details
              </h2>
              <dl className="divide-y divide-gray-200">
                <PaymentDetailRow label="Job Title" value={jobTitle} />
                <PaymentDetailRow
                  label="Job ID"
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
