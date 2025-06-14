import React from "react";
import JobIcon from "./icons/JobIcon";
import Image from "next/image";
import { IJobSearch } from "./Search_Header";

const JobResults: React.FC<{
  jobs: IJobSearch[];
  onJobClick: (job: IJobSearch) => void;
}> = ({ jobs, onJobClick }) => {
  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div
          key={job._id}
          onClick={() => onJobClick(job)}
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden">
            {job.logo ? (
              <Image
                src={job.logo}
                alt={job.companyName}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <JobIcon width="16" height="16" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800 truncate">{job.title}</h4>
            <div className="flex items-center text-sm text-gray-500">
              <span className="truncate">{job.companyName}</span>
              <span className="truncate">{job.location}</span>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {job.jobType}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobResults;
