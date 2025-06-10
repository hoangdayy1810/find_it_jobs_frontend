import React from "react";

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

export default PaymentDetailRow;
