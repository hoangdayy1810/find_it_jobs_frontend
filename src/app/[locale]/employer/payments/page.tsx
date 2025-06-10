"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { usePayment } from "@/contexts/AppContext";
import { IPayment } from "@/stores/paymentStore";
import AdvancedPagination from "@/components/molecules/AdvancedPagination";
import { formatDate } from "@/utils/fommat_date";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import PaymentStatusBadge from "@/components/atoms/PaymentStatusBadge";
import PaymentCard from "@/components/molecules/PaymentCard";

import FilterSection2 from "@/components/molecules/FilterSection2";
import EmptyState from "@/components/atoms/EmptyState";

const PaymentHistoryPage = observer(() => {
  const t = useTranslations();
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
        <h1 className="text-2xl font-bold text-gray-900">
          {t("payment.title")}
        </h1>
        <p className="text-gray-600 mt-1">{t("payment.subtitle")}</p>
      </div>

      {/* Filter section */}
      <FilterSection2
        t={t}
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
              {t("payment.try_again")}
            </button>
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            title={t("payment.empty.title")}
            description={t("payment.empty.description")}
          />
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
                      {t("payment.table.date")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("payment.table.transaction_id")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("payment.table.package")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("payment.table.amount")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("payment.table.status")}
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
                          {t("payment.job_id")}: {payment.jobId._id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.package}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.amount.toLocaleString()} {t("all.VND")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentStatusBadge t={t} status={payment.status} />
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
                  t={t}
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
                {t("payment.pagination.showing", {
                  count: payments.length,
                  total: totalPayments,
                })}
              </div>
              <AdvancedPagination
                t={t}
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
