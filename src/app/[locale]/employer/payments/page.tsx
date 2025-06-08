"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { usePayment } from "@/contexts/AppContext";
import { IPayment } from "@/stores/paymentStore";
import AdvancedPagination from "@/components/molecules/AdvancedPagination";
import { formatDate } from "@/utils/fommat_date";
import { useRouter } from "next/navigation";

// PaymentStatusBadge component
const PaymentStatusBadge = ({ status }: { status: string }) => {
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
    case "refunded":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
};

// PaymentCard component for mobile view
const PaymentCard = ({
  payment,
  onClick,
}: {
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
        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="mb-2">
        <h3 className="font-medium">{payment.package}</h3>
        <p className="text-gray-700 text-sm truncate">
          ID: {payment.transactionId}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">
          Job ID: {payment.jobId._id}
        </span>
        <span className="font-semibold text-lg">
          {payment.amount.toLocaleString()} VND
        </span>
      </div>
    </div>
  );
};

// EmptyState component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-gray-300 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <h3 className="text-lg font-medium text-gray-800 mb-2">
      No payment history found
    </h3>
    <p className="text-gray-500 text-center max-w-md">
      You haven't made any payments yet. When you purchase job postings or
      promotions, they'll appear here.
    </p>
  </div>
);

// Simplified Filter Section Component
const FilterSection = ({
  onFilterChange,
  statusFilter,
}: {
  onFilterChange: (value: string) => void;
  statusFilter: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mr-4 whitespace-nowrap"
        >
          Filter by Status:
        </label>
        <select
          id="status"
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={statusFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>
  );
};

// Main Payment History Page
const PaymentHistoryPage = observer(() => {
  const router = useRouter();
  const paymentStore = usePayment();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare API parameters
        const params: any = {
          page: currentPage,
          limit: 10,
        };

        // Only add status filter if it's selected
        if (statusFilter) {
          params.status = statusFilter;
        }

        // Call API via store
        const response = await paymentStore?.getPaymentHistory(params);

        if (response?.payments) {
          setPayments(response.payments);
          setTotalPages(response.pagination.totalPages);
          setTotalPayments(response.pagination.totalPayments);
        } else {
          setError("Failed to load payment history");
        }
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("An error occurred while fetching payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [currentPage, statusFilter, paymentStore]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentClick = (paymentId: string) => {
    router.push(`/employer/payments/${paymentId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-1">
          View and manage all your past transactions
        </p>
      </div>

      {/* Filter section */}
      <FilterSection
        onFilterChange={handleStatusFilterChange}
        statusFilter={statusFilter}
      />

      {/* Payment history content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => setCurrentPage(1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : payments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop view - Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Transaction ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Package
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      onClick={() => handlePaymentClick(payment._id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(new Date(payment.createdAt))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.transactionId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Job ID: {payment.jobId._id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.package}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.amount.toLocaleString()} VND
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view - Cards */}
            <div className="md:hidden p-4 space-y-4">
              {payments.map((payment) => (
                <PaymentCard
                  key={payment._id}
                  payment={payment}
                  onClick={() => handlePaymentClick(payment._id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && !error && payments.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{payments.length}</span>{" "}
                of <span className="font-medium">{totalPayments}</span> payments
              </div>
              <AdvancedPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default PaymentHistoryPage;
