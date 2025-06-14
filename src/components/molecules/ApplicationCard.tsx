import React from "react";
import Location_smIcon from "../atoms/icons/Location_smIcon";
import Salary_smIcon from "../atoms/icons/Salary_smIcon";
import Calendar_smIcon from "../atoms/icons/Calendar_smIcon";
import { formatDistance } from "date-fns";
import { useLocale } from "next-intl";
import { vi, enUS } from "date-fns/locale";
import CompanyLogoIcon from "../atoms/icons/CompanyLogoIcon";
import Image from "next/image";
import { IApplication } from "@/stores/applicationStore";

const ApplicationCard = ({
  application,
  onClick,
  t,
}: {
  application: IApplication;
  onClick: () => void;
  t: any;
}) => {
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;

  const job = typeof application.jobId === "object" ? application.jobId : null;
  if (!job) return null;

  // Status display configuration
  const getStatusDisplay = () => {
    switch (application.status) {
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
  const employer = typeof job.employerId === "object" ? job.employerId : null;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 ${statusDisplay.borderColor}`}
    >
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex items-start space-x-4 mb-3 md:mb-0">
            {/* Company Logo */}
            <div className="w-12 h-12 relative flex-shrink-0 rounded overflow-hidden bg-gray-100">
              {employer?.logo ? (
                <Image
                  src={employer.logo}
                  alt={employer.companyName || "Company logo"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <CompanyLogoIcon />
                </div>
              )}
            </div>

            {/* Job and company info */}
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {job.title}
              </h3>
              <p className="text-gray-600">
                {employer?.companyName || "Company"}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div
            className={`${statusDisplay.bgColor} ${statusDisplay.textColor} px-3 py-1 rounded-full text-xs font-medium inline-block md:mt-0`}
          >
            {statusDisplay.text}
          </div>
        </div>

        {/* Additional information */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar_smIcon />
            <span>
              {t("myapplies.card.applied")}{" "}
              {formatDistance(new Date(application.appliedAt), new Date(), {
                addSuffix: true,
                locale: dateLocale,
              })}
            </span>
          </div>

          <div className="flex items-center">
            <Location_smIcon />
            <span>{job.location}</span>
          </div>

          {job.salary && (
            <div className="flex items-center">
              <Salary_smIcon />
              <span>
                {job.salary.min.toLocaleString()} {t("all.VND")} -{" "}
                {job.salary.max.toLocaleString()} {t("all.VND")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
