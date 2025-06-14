import { IJob } from "@/stores/jobStore";
import { formatDate } from "@/utils/fommat_date";
import React from "react";

const JobCard2 = ({
  job,
  onClick,
  t,
}: {
  job: IJob;
  onClick: () => void;
  t: any;
  locale: string;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      <h3 className="font-semibold text-lg text-gray-800 mb-2">{job.title}</h3>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="mr-1">💰</span>
          <span>
            {job.salary.min.toLocaleString()}đ -{" "}
            {job.salary.max.toLocaleString()}đ
          </span>
        </div>

        <div className="flex items-center">
          <span className="mr-1">📍</span>
          <span>{job.location}</span>
        </div>

        <div className="flex items-center">
          <span className="mr-1">🕒</span>
          <span>
            {t(`all.job_type.${job.jobType.toLowerCase().replace("-", "_")}`, {
              defaultValue: job.jobType,
            })}
          </span>
        </div>
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
            >
              {tag.value}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {t("employer_detail.job_card.more_tags", {
                count: job.tags.length - 3,
              })}
            </span>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 flex justify-between mt-2">
        <span>
          {t("employer_detail.job_card.posted")}:{" "}
          {formatDate(new Date(job.postedAt))}
        </span>
        {job.expiresAt && (
          <span>
            {t("employer_detail.job_card.expires")}:{" "}
            {formatDate(new Date(job.expiresAt))}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard2;
