"use client";

import { IJob } from "@/stores/jobStore";
import { formatDate } from "@/utils/fommat_date";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import JobLogoIcon from "../atoms/icons/JobLogoIcon";
import Image from "next/image";
import { applicationStore } from "@/stores/applicationStore";
import { userStore } from "@/stores/userStore";
import { candidateStore } from "@/stores/candidateStore";
import { APPLICATION_STATUS } from "@/utils/constant";
import { useTranslations } from "next-intl";

const JobListItem = ({
  job,
  tagKeysByJobs,
}: {
  job: IJob;
  tagKeysByJobs: any[];
}) => {
  const router = useRouter();
  const t = useTranslations();
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null
  );

  // Get employer data
  const employer = typeof job.employerId === "object" ? job.employerId : null;

  // Check if user is logged in as candidate and if they've applied to this job
  useEffect(() => {
    const checkApplicationStatus = async () => {
      // Only check for logged in candidates
      if (userStore.user?.role === "candidate" && candidateStore.candidate) {
        try {
          // Get candidate applications
          const result = await applicationStore.getCandidateApplications();
          if (result && result.applications) {
            // Find if current job is in the applications list
            const application = result.applications.find(
              (app: any) =>
                (typeof app.jobId === "string" && app.jobId === job._id) ||
                (typeof app.jobId === "object" && app.jobId._id === job._id)
            );

            if (application) {
              setApplicationStatus(application.status);
            }
          }
        } catch (error) {
          console.error("Error checking application status:", error);
        }
      }
    };

    checkApplicationStatus();
  }, [job._id]);

  // Format salary for display
  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(0)}M`;
      }
      return num.toLocaleString();
    };

    return `${formatNumber(min)} - ${formatNumber(max)} VND`;
  };

  // Format date for display
  const formatCurrentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("all.time.today");
    if (diffDays === 1) return t("all.time.yesterday");
    if (diffDays < 7) return t("all.time.days_ago", { count: diffDays });

    return formatDate(date);
  };

  // Get relevant tags based on tagKeysByJobs
  const getRelevantTags = () => {
    if (!job.tags || !tagKeysByJobs || tagKeysByJobs.length === 0) {
      return job.tags || [];
    }

    // Filter job tags to show those that are in the tagKeysByJobs list
    const relevantTagNames = tagKeysByJobs.flatMap(
      (tagKey) => tagKey.children?.map((child: any) => child.name) || []
    );

    return job.tags.filter((tag) => relevantTagNames.includes(tag.value));
  };

  const relevantTags = getRelevantTags();

  // Generate status badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case APPLICATION_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case APPLICATION_STATUS.APPROVED:
        return "bg-green-100 text-green-800";
      case APPLICATION_STATUS.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get translated status text
  const getStatusText = (status: string) => {
    return t(`application.status.${status.toLowerCase()}`);
  };

  return (
    <div
      className="bg-white p-5 rounded-lg shadow-sm hover:shadow-xl hover:scale-[0.99] cursor-pointer transition-shadow h-full flex flex-col"
      onClick={() => router.push(`/jobs/${job._id}`)}
    >
      {/* Posted Date and Application Status */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">
          {formatCurrentDate(job.postedAt)}
        </span>

        {applicationStatus && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(
              applicationStatus
            )}`}
          >
            {getStatusText(applicationStatus)}
          </span>
        )}
      </div>

      {/* Job Title - large font */}
      <h2 className="text-2xl font-semibold text-gray-800 hover:text-red-400 transition-colors mb-3">
        {job.title}
      </h2>

      {/* Company Info - logo and company name on same line, slightly indented */}
      <div className="flex items-center ml-1 mb-4">
        <div className="w-10 h-10 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
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
              <JobLogoIcon />
            </div>
          )}
        </div>
        <p className="text-gray-700 font-medium">
          {employer?.companyName || "Company Name"}
        </p>
      </div>

      {/* Job Details - in specified order: salary, jobType, location */}
      <div className="space-y-2 my-6 flex-grow py-2 border-t-2 border-gray-200">
        {job.salary && (
          <div className="flex items-center text-gray-600">
            <span className="mr-2 text-gray-500">💰</span>
            <span>{formatSalary(job.salary.min, job.salary.max)}</span>
          </div>
        )}

        {job.jobType && (
          <div className="flex items-center text-gray-600">
            <span className="mr-2 text-gray-500">⏱️</span>
            <span>{job.jobType}</span>
          </div>
        )}

        {job.location && (
          <div className="flex items-center text-gray-600">
            <span className="mr-2 text-gray-500">📍</span>
            <span className="truncate">{job.location}</span>
          </div>
        )}
      </div>

      {/* Tags - at the bottom */}
      {relevantTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {relevantTags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {tag.value}
            </span>
          ))}
          {relevantTags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{relevantTags.length - 3} {t("all.more")}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListItem;
