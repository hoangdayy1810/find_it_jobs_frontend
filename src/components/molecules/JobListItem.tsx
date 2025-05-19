import { IJob } from "@/stores/jobStore";
import { formatDate } from "@/utils/fommat_date";
import { useRouter } from "next/navigation";
import React from "react";
import JobLogoIcon from "../atoms/icons/JobLogoIcon";
import Image from "next/image";

const JobListItem = ({
  job,
  tagKeysByJobs,
}: {
  job: IJob;
  tagKeysByJobs: any[];
}) => {
  const router = useRouter();

  // Get employer data
  const employer = typeof job.employerId === "object" ? job.employerId : null;

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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

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

  return (
    <div
      className="bg-white p-5 rounded-lg shadow-sm hover:shadow-xl hover:scale-[0.99] cursor-pointer transition-shadow h-full flex flex-col"
      onClick={() => router.push(`/jobs/${job._id}`)}
    >
      {/* Posted Date - at the top, faded text */}
      <span className="text-sm text-gray-400 mb-2">
        {formatCurrentDate(job.postedAt)}
      </span>

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
              +{relevantTags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListItem;
