"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { formatDate } from "@/utils/fommat_date";
import JobIcon from "@/components/atoms/icons/JobIcon";
import Location from "@/components/atoms/icons/Location";
import CompanySizeIcon from "@/components/atoms/icons/CompanySizeIcon";
import CalendarIcon from "@/components/atoms/icons/CalendarIcon";
import GlobalIcon from "@/components/atoms/icons/GlobalIcon";
import Email from "@/components/atoms/icons/Email";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import { useEmployer } from "@/contexts/AppContext";
import { IEmployer } from "@/stores/employerStore";
import { IJob } from "@/stores/jobStore";

// Company Info Card Component
const CompanyInfoCard = ({ employer }: { employer: IEmployer }) => {
  return (
    <div className="bg-white p-6 shadow-sm rounded-lg h-full">
      {/* Company logo and name */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-36 h-36 relative mb-4 overflow-hidden rounded-lg">
          {employer?.logo ? (
            <Image
              src={employer.logo}
              alt={employer.companyName || "Company logo"}
              fill
              className="object-contain"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <JobIcon width="64" height="64" />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-center">
          {employer.companyName}
        </h1>
      </div>

      {/* Company details */}
      <div className="space-y-5">
        {employer?.companyType && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <JobIcon width="18" height="18" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Company Type</p>
              <p className="font-medium">{employer.companyType}</p>
            </div>
          </div>
        )}

        {employer?.address && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <Location />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{employer.address}</p>
            </div>
          </div>
        )}

        {employer?.companySize && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <CompanySizeIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500">Company Size</p>
              <p className="font-medium">{employer.companySize}</p>
            </div>
          </div>
        )}

        {employer?.workingDays && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <CalendarIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500">Working Days</p>
              <p className="font-medium">{employer.workingDays}</p>
            </div>
          </div>
        )}

        {employer?.website && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <GlobalIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500">Website</p>
              <a
                href={
                  employer.website.startsWith("http")
                    ? employer.website
                    : `https://${employer.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                {employer.website}
              </a>
            </div>
          </div>
        )}

        {employer?.email && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <Email />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <a
                href={`mailto:${employer.email}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {employer.email}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Company description */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-xl mb-4">About the Company</h3>
        <div
          className="prose prose-sm md:prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{
            __html: employer.description || "<p>No description provided</p>",
          }}
        />
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, onClick }: { job: IJob; onClick: () => void }) => {
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
          <span>{job.jobType}</span>
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
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 flex justify-between mt-2">
        <span>Posted: {formatDate(new Date(job.postedAt))}</span>
        {job.expiresAt && (
          <span>Expires: {formatDate(new Date(job.expiresAt))}</span>
        )}
      </div>
    </div>
  );
};

// Empty State Component
const EmptyJobsState = () => (
  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
    <div className="flex justify-center mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-800 mb-2">
      No job listings found
    </h3>
    <p className="text-gray-500">
      This employer doesn't have any active job postings at the moment.
    </p>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main Component
const EmployerDetailPage = observer(() => {
  const params = useParams();
  const router = useRouter();
  const employerId = params.id as string;
  const employerStore = useEmployer();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployerDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all jobs without pagination
        const response = await employerStore?.getEmployerDetailsWithJobs(
          employerId
        );

        if (!response || !response.employer) {
          setError("Failed to load employer details. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching employer details:", err);
        setError("Failed to load employer details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (employerId) {
      fetchEmployerDetails();
    }
  }, [employerId, employerStore]);

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  // Use values from the store
  const employer = employerStore?.currentEmployer;
  const jobs = employerStore?.employerJobs || [];
  const totalJobs = employerStore?.totalJobs || 0;

  if (error || !employer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Employer not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the employer information you're looking for.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <VectorLeftIcon />
          <span className="ml-2">Back</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Company Info (now 2/3 of the page) */}
        <div className="w-full lg:w-2/3">
          <CompanyInfoCard employer={employer} />
        </div>

        {/* Right column - Job Listings (now 1/3 of the page) */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 shadow-sm rounded-lg mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Job Openings ({totalJobs})
              </h2>
            </div>

            {jobs.length === 0 ? (
              <EmptyJobsState />
            ) : (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onClick={() => handleJobClick(job._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default EmployerDetailPage;
