"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useApplication, useJob } from "@/contexts/AppContext";
import Image from "next/image";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import { formatDistance, format } from "date-fns";
import { formatDate } from "@/utils/fommat_date";
import { getCleanFileName } from "@/utils/getCleanFilename";
import Network from "@/components/atoms/icons/Network";
import DownloadIcon from "@/components/atoms/icons/DownloadIcon";

// Application Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  // Status display configuration
  const getStatusDisplay = () => {
    switch (status) {
      case "pending":
        return {
          text: "Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      case "approved":
        return {
          text: "Approved",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "rejected":
        return {
          text: "Rejected",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      default:
        return {
          text: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div
      className={`${statusDisplay.bgColor} ${statusDisplay.textColor} px-4 py-2 rounded-full inline-flex items-center text-sm font-medium`}
    >
      <span
        className={`w-2 h-2 ${
          status === "pending"
            ? "bg-yellow-500"
            : status === "approved"
            ? "bg-green-500"
            : "bg-red-500"
        } rounded-full mr-2`}
      ></span>
      {statusDisplay.text}
    </div>
  );
};

// Company Logo Component
const CompanyLogo = ({ logo, name }: { logo?: string; name: string }) => (
  <div className="w-16 h-16 relative flex-shrink-0 rounded overflow-hidden bg-gray-100">
    {logo ? (
      <Image
        src={logo}
        alt={`${name} logo`}
        fill
        className="object-contain"
        unoptimized
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
    )}
  </div>
);

// Job Detail Item Component
const JobDetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start space-x-3">
    <div className="text-gray-500 flex-shrink-0 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

// Application Timeline Item Component
const TimelineItem = ({
  date,
  title,
  description,
  isLast = false,
}: {
  date: string;
  title: string;
  description?: string;
  isLast?: boolean;
}) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-4">
      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
      {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
    </div>
    <div className="pb-6">
      <p className="text-xs text-gray-500">{date}</p>
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  </div>
);

// Main Component
const DetailApplication = observer(() => {
  const params = useParams();
  const router = useRouter();
  const applicationStore = useApplication();
  const jobStore = useJob();
  const [loading, setLoading] = useState(true);

  const applicationId = params.applicationId as string;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await applicationStore?.getApplicationById(applicationId);
      if (result?.application) {
        // If jobId is a string, we need to fetch the job details
        if (typeof result.application.jobId === "string") {
          await jobStore?.getPublicJobById(result.application.jobId);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [applicationId, applicationStore, jobStore]);

  const handleBack = () => {
    router.push("/candidate/myapplies");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!applicationStore?.application) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Application Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The application you're looking for does not exist or has been
            removed.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const application = applicationStore.application;
  const job =
    typeof application.jobId === "object"
      ? application.jobId
      : jobStore?.jobDetail;

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Job Information Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            Job details could not be loaded for this application.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get employer info if available
  const employer = typeof job.employerId === "object" ? job.employerId : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <VectorLeftIcon />
          <span className="ml-2">Back to My Applications</span>
        </button>
      </div>

      {/* Application Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <CompanyLogo
              logo={employer?.logo}
              name={employer?.companyName || "Company"}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
              <p className="text-gray-600">
                {employer?.companyName || "Company"}
              </p>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Job & Application Details */}
        <div className="w-full lg:w-2/3">
          {/* Job Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Job Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <JobDetailItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                label="Location"
                value={job.location}
              />

              <JobDetailItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                label="Salary"
                value={`${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} VND`}
              />

              <JobDetailItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                label="Job Type"
                value={job.jobType}
              />

              <JobDetailItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
                label="Posted On"
                value={formatDate(new Date(job.postedAt))}
              />
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Application Timeline
            </h2>

            <div className="mt-4">
              <TimelineItem
                date={format(new Date(application.appliedAt), "PPP 'at' p")}
                title="Application Submitted"
                description="Your application was successfully submitted."
              />

              {application.status === "approved" && (
                <TimelineItem
                  date={format(new Date(), "PPP 'at' p")} // You should use the actual status change date
                  title="Application Approved"
                  description="Congratulations! Your application has been approved by the employer."
                  isLast={true}
                />
              )}

              {application.status === "rejected" && (
                <TimelineItem
                  date={format(new Date(), "PPP 'at' p")} // You should use the actual status change date
                  title="Application Rejected"
                  description="We're sorry, the employer has decided not to proceed with your application."
                  isLast={true}
                />
              )}

              {application.status === "pending" && (
                <TimelineItem
                  date={format(new Date(), "PPP 'at' p")}
                  title="Under Review"
                  description="Your application is currently being reviewed by the employer."
                  isLast={true}
                />
              )}
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Your Cover Letter
              </h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{application.coverLetter}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Submitted Documents & Stats */}
        <div className="w-full lg:w-1/3">
          {/* Application Summary Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Application Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Application ID:</span>
                <span className="font-medium">{application._id.slice(-8)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Applied On:</span>
                <span className="font-medium">
                  {formatDate(new Date(application.appliedAt))}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">
                  {application.status === "pending" && (
                    <span className="text-yellow-600">Pending</span>
                  )}
                  {application.status === "approved" && (
                    <span className="text-green-600">Approved</span>
                  )}
                  {application.status === "rejected" && (
                    <span className="text-red-600">Rejected</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Time in Review:</span>
                <span className="font-medium">
                  {formatDistance(new Date(application.appliedAt), new Date(), {
                    addSuffix: false,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Submitted Resume Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Submitted Resume
            </h2>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">
                  <Network />
                </span>
                <span className="text-sm text-gray-600 truncate max-w-[150px]">
                  {getCleanFileName(application.cvFile)}
                </span>
              </div>

              <a
                href={application.cvFile}
                download={getCleanFileName(application.cvFile)}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 flex items-center text-sm"
                rel="noopener noreferrer"
              >
                <span className="mr-1">Download</span>
                <DownloadIcon />
              </a>
            </div>
          </div>

          {/* What's Next Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              What's Next?
            </h2>

            <div className="space-y-4">
              {application.status === "pending" && (
                <>
                  <p className="text-sm">
                    Your application is currently being reviewed by the
                    employer. You will be notified when there is an update.
                  </p>
                  <p className="text-sm">Average response time: 1-2 weeks</p>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-sm text-yellow-800">
                      Tip: Continue applying to other positions while you wait
                      to increase your chances of finding the right job.
                    </p>
                  </div>
                </>
              )}

              {application.status === "approved" && (
                <>
                  <p className="text-sm">
                    Congratulations! The employer has approved your application.
                  </p>
                  <p className="text-sm">Next steps:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Check your email for further instructions</li>
                    <li>Prepare for potential interviews</li>
                    <li>Research more about the company</li>
                  </ul>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800">
                      Tip: Respond promptly to any communication from the
                      employer to show your continued interest.
                    </p>
                  </div>
                </>
              )}

              {application.status === "rejected" && (
                <>
                  <p className="text-sm">
                    We're sorry, but the employer has decided not to proceed
                    with your application at this time.
                  </p>
                  <p className="text-sm">
                    Don't be discouraged! Here's what you can do:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Review and update your resume</li>
                    <li>Continue applying to other positions</li>
                    <li>Consider roles that better match your skills</li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      Tip: Each application is a learning experience. Use this
                      opportunity to refine your approach for future
                      applications.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DetailApplication;
