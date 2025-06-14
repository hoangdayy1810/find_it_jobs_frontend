import { IJob } from "@/stores/jobStore";
import { formatDate } from "@/utils/fommat_date";
import React from "react";

const JobCard = ({
  t,
  job,
  status,
  onClose,
  onDelete,
  onClick,
}: {
  t: any;
  job: IJob;
  status?: string;
  onClose: () => void;
  onDelete: () => void;
  onClick: () => void;
}) => {
  // Determine job status
  const isExpired = job.expiresAt && new Date(job.expiresAt) < new Date();
  const isActive = job.isShow && !isExpired;
  const canDelete = !job.isShow && job.applicationCount === 0;

  // Get status display properties
  const getStatusDisplay = () => {
    if (status === "inactive") {
      return {
        text: t("employer.myjobs.filters.inactive"),
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
      };
    } else if (status === "closed") {
      return {
        text: t("employer.myjobs.filters.closed"),
        bgColor: "bg-gray-400",
        textColor: "text-white",
      };
    } else if (status === "active") {
      return {
        text: t("employer.myjobs.filters.active"),
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      };
    } else return undefined;
  };

  const statusDisplay = getStatusDisplay();

  // Format tags for display
  const formattedTags = job.tags || [];
  const displayTags =
    formattedTags.length <= 3
      ? formattedTags
      : [...formattedTags.slice(0, 2), { more: formattedTags.length - 2 }];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:cursor-pointer active:scale-97 duration-150 transition-shadow">
      <div
        onClick={onClick}
        className="flex flex-col md:flex-row justify-between"
      >
        {/* Left section */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            {job.title}
          </h2>
          <div className="mt-2 space-y-1">
            {job.salary && (
              <div className="flex items-center text-gray-600">
                <span className="mr-1">💰</span>
                <span>
                  {job.salary.min.toLocaleString()} {" - "}
                  {job.salary.max.toLocaleString()} {t("all.VND")}
                </span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center text-gray-600">
                <span className="mr-1">📍</span>
                <span>{job.location}</span>
              </div>
            )}
            {job.specializationId && (
              <div className="flex items-center text-gray-600">
                <span className="mr-1">🔍</span>
                <span>{job.specializationId.name}</span>
              </div>
            )}
            {job.jobType && (
              <div className="flex items-center text-gray-600">
                <span className="mr-1">⏱️</span>
                <span>{job.jobType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="md:text-right mt-4 md:mt-0">
          {/* Status Badge */}
          {statusDisplay && (
            <div
              className={`md:ml-auto mb-2 max-w-[120px] px-2 py-1 rounded-md text-xs text-center font-medium ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
            >
              {statusDisplay.text}
            </div>
          )}
          <div className="text-gray-500 text-sm">
            {t("employer.myjobs.posted_on")}{" "}
            {formatDate(new Date(job.postedAt))}
          </div>
          {job.expiresAt && (
            <div className="text-gray-500 text-sm">
              {t("employer.myjobs.expires_on")}{" "}
              {formatDate(new Date(job.expiresAt))}
            </div>
          )}
          <div className="text-gray-500 text-sm mt-1">
            {job.applicationCount || 0} {t("employer.myjobs.applicants")} •{" "}
            {job.views} {t("employer.myjobs.views")}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap mt-3 md:justify-end gap-2">
            {displayTags.map((tag, i) => (
              <div
                key={i}
                className="px-2 py-1 text-xs border border-gray-300 rounded-full text-gray-600"
              >
                {"more" in tag ? `+${tag.more} ${t("all.more")}` : tag.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex justify-end space-x-2">
        {/* Show Close button only when job is active */}
        {isActive && (
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-yellow-600 border border-yellow-600 rounded hover:bg-yellow-50 transition-colors"
          >
            {t("employer.myjobs.close_button")}
          </button>
        )}

        {/* Show Delete button only when job is inactive AND has no applicants */}
        {canDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
          >
            {t("employer.myjobs.delete_button")}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
