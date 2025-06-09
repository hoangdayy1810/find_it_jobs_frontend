"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useJob } from "@/contexts/AppContext";
import Image from "next/image";
import { formatDate } from "@/utils/fommat_date";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import { EXPERIENCE } from "@/utils/constant";
import UsersIcon from "@/components/atoms/icons/UsersIcon";

const PrivateDetailJob = observer(() => {
  const params = useParams();
  const router = useRouter();
  const jobStore = useJob();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const jobId = params.id as string;

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (jobId) {
        setLoading(true);
        await jobStore?.getPrivateJobById(jobId);
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId, jobStore]);

  useEffect(() => {
    if (jobStore?.jobDetail) {
      const { isShow, expiresAt, applicationCount } = jobStore.jobDetail;
      // Check if job can be edited: not shown, not expired, and no applications
      const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;
      setIsEditAllowed(!isShow && !isExpired && applicationCount === 0);
    }
  }, [jobStore?.jobDetail]);

  const handleEdit = () => {
    router.push(`/employer/myjobs/${jobId}/edit`);
  };

  // Add a handler for the View Candidates button
  const handleViewCandidates = () => {
    router.push(`/employer/myjobs/${jobId}/applications`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!jobStore?.jobDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
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
    _id,
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
    applicationCount,
    description,
    isShow,
  } = jobStore.jobDetail;

  // Check if employerId is an object with properties or just a string
  const companyInfo = typeof employerId === "object" ? employerId : null;

  return (
    <div className="w-full">
      {/* Top navigation bar with back button, view applications, and edit button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
          aria-label="Back"
        >
          <VectorLeftIcon />
        </button>

        <div className="flex space-x-3">
          {/* Only show view applications button when there are applications */}
          {applicationCount && applicationCount > 0 && (
            <button
              onClick={handleViewCandidates}
              className="px-6 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              <UsersIcon className="w-4 h-4 mr-2" />
              View Candidate List
            </button>
          )}

          {isEditAllowed && (
            <button
              onClick={handleEdit}
              className="px-10 py-1 bg-blue-400 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="mx-auto p-4 bg-white shadow-md rounded-lg">
        {/* Job title */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-blue-600">#{_id}</p>
          </div>

          {location && (
            <div className="flex items-center text-gray-600">
              <span className="mr-1">📍</span>
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="mb-6">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isShow ||
              (applicationCount && applicationCount > 0) ||
              new Date(expiresAt || Date.now()) < new Date()
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isShow ||
            (applicationCount && applicationCount > 0) ||
            new Date(expiresAt || Date.now()) < new Date()
              ? "Published"
              : "Draft"}
          </span>

          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {applicationCount} Application{applicationCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Company Information Row */}
        <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200">
          {companyInfo?.logo && (
            <div className="ml-6 w-10 h-10 relative overflow-hidden rounded-md">
              <Image
                src={companyInfo.logo}
                alt={companyInfo.companyName || "Company logo"}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <h2 className="font-semibold">
            {companyInfo?.companyName || "Your Company"}
          </h2>
        </div>

        {/* First line of attributes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-gray-500 text-sm">Salary Range</p>
            <p className="font-medium">
              {salary.min.toLocaleString()}đ - {salary.max.toLocaleString()}đ
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 border-gray-200">
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

        {/* Skills & Technologies - keeping this section as it provides valuable info */}
        {tags && tags.length > 0 && (
          <div className="mb-2 border-gray-200">
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
      </div>

      {/* Description - with clear separation */}
      <div className="mt-4 mx-auto p-4 bg-white shadow-md rounded-lg">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ml-1 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

export default PrivateDetailJob;
