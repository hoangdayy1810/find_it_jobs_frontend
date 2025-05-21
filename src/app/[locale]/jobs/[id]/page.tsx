"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useJob, useTag, useUser } from "@/contexts/AppContext";
import Image from "next/image";
import { formatDate } from "@/utils/fommat_date";
import { EXPERIENCE } from "@/utils/constant";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import RotateUpDownArrow from "@/components/atoms/icons/RotateUpDownArrow";
import JobIcon from "@/components/atoms/icons/JobIcon";
import Location from "@/components/atoms/icons/Location";
import CompanySizeIcon from "@/components/atoms/icons/CompanySizeIcon";
import CalendarIcon from "@/components/atoms/icons/CalendarIcon";
import GlobalIcon from "@/components/atoms/icons/GlobalIcon";
import JobListItem from "@/components/molecules/JobListItem";

const JobDetailPage = observer(() => {
  const params = useParams();
  const router = useRouter();
  const jobStore = useJob();
  const tagStore = useTag();
  const userStore = useUser();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const jobId = params.id as string;

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (jobId) {
        setLoading(true);
        await jobStore?.getPublicJobById(jobId);
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId, jobStore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!jobStore?.jobDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    title,
    employerId,
    salary,
    location,
    jobType,
    experience,
    postedAt,
    expiresAt,
    tags,
    specializationId,
    description,
  } = jobStore.jobDetail;

  // Check if employerId is an object with properties or just a string
  const companyInfo = typeof employerId === "object" ? employerId : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top navigation bar with back button */}
      <div className="flex justify-start items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
          aria-label="Back"
        >
          <VectorLeftIcon />
          <span className="ml-2">Back to Jobs</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left section - Job details (2/3 width) */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-6 shadow-sm rounded-lg">
            {/* Job title and location */}
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

              {location && (
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📍</span>
                  <span>{location}</span>
                </div>
              )}
            </div>

            {/* Apply button */}
            <div className="mt-10 mb-4">
              <button
                onClick={() => {
                  // Handle apply logic here
                  console.log("Apply for job:", jobId);
                }}
                className="px-8 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-700 transition-colors w-full"
              >
                Apply Now
              </button>
            </div>

            {/* Job details in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 border-b border-t py-6 border-gray-200">
              <div>
                <p className="text-gray-500 text-sm">Salary Range</p>
                <p className="font-medium">
                  {salary.min.toLocaleString()}đ - {salary.max.toLocaleString()}
                  đ
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Job Type</p>
                <p className="font-medium">{jobType}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Posted On</p>
                <p className="font-medium">{formatDate(new Date(postedAt))}</p>
              </div>
            </div>

            {/* Second line of attributes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 border-b pb-6 border-gray-200">
              <div>
                <p className="text-gray-500 text-sm">Specialization</p>
                <p className="font-medium">
                  {typeof specializationId === "object"
                    ? specializationId.name
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Experience</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {experience && experience.length > 0 ? (
                    <p>
                      {experience
                        .map((exp) => {
                          if (exp) return EXPERIENCE[exp];
                        })
                        .join(", ")}
                    </p>
                  ) : (
                    <span>Not specified</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Expires On</p>
                <p className="font-medium">
                  {expiresAt ? formatDate(new Date(expiresAt)) : "N/A"}
                </p>
              </div>
            </div>

            {/* Skills & Technologies */}
            {tags && tags.length > 0 && (
              <div className="mb-6 border-b pb-6 border-gray-200">
                <p className="text-gray-500 text-sm mb-2">
                  Skills & Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {tag.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Job Description</h3>
              <div
                className={`prose max-w-none overflow-hidden transition-all duration-300 ${
                  expanded ? "" : "max-h-[300px]"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: description || "<p>No description provided</p>",
                  }}
                />
              </div>

              {description && description.length > 300 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-4 text-blue-500 hover:text-blue-700 font-medium flex items-center"
                >
                  {expanded ? "Show less" : "Read more"}
                  <RotateUpDownArrow expanded={expanded} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right section - Company information (1/3 width) */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h2 className="text-xl font-semibold mb-6 border-b pb-3 border-gray-200">
              Company Information
            </h2>

            {/* Company logo and name */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 relative mb-3 overflow-hidden rounded-lg">
                {companyInfo?.logo ? (
                  <Image
                    src={companyInfo.logo}
                    alt={companyInfo.companyName || "Company logo"}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <JobIcon width="48" height="48" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-center">
                {companyInfo?.companyName || "Company Name"}
              </h3>
            </div>

            {/* Company details */}
            <div className="space-y-4">
              {companyInfo?.companyType && (
                <div className="flex items-start">
                  <div className="w-8 flex-shrink-0 text-gray-500">
                    <JobIcon width="18" height="18" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Type</p>
                    <p>{companyInfo.companyType}</p>
                  </div>
                </div>
              )}

              {companyInfo?.address && (
                <div className="flex items-start">
                  <div className="w-8 flex-shrink-0 text-gray-500">
                    <Location />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{companyInfo.address}</p>
                  </div>
                </div>
              )}

              {companyInfo?.companySize && (
                <div className="flex items-start">
                  <div className="w-8 flex-shrink-0 text-gray-500">
                    <CompanySizeIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Size</p>
                    <p>{companyInfo.companySize}</p>
                  </div>
                </div>
              )}

              {companyInfo?.workingDays && (
                <div className="flex items-start">
                  <div className="w-8 flex-shrink-0 text-gray-500">
                    <CalendarIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Working Days</p>
                    <p>{companyInfo.workingDays}</p>
                  </div>
                </div>
              )}

              {companyInfo?.website && (
                <div className="flex items-start">
                  <div className="w-8 flex-shrink-0 text-gray-500">
                    <GlobalIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={
                        companyInfo.website.startsWith("http")
                          ? companyInfo.website
                          : `https://${companyInfo.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {companyInfo.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* View more jobs from this company */}
            {companyInfo?._id && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push(`/companies/${companyInfo._id}`)}
                  className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                >
                  View More Jobs From This Company
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {jobStore.similarJobs && jobStore.similarJobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Similar Jobs You May Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobStore.similarJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => {
                  if (job._id !== jobId) {
                    router.push(`/jobs/${job._id}`);
                  }
                }}
                className={`${
                  job._id === jobId
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-md"
                }`}
              >
                {job._id === jobId ? (
                  <div className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs">
                    Current Job
                  </div>
                ) : null}
                <JobListItem
                  job={job}
                  tagKeysByJobs={tagStore?.tagKeysByJobs || []}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default JobDetailPage;
