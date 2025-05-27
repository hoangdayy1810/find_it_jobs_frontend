"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useApplication, useJob } from "@/contexts/AppContext";
import AdvancedPagination from "@/components/molecules/AdvancedPagination";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { IApplication } from "@/stores/applicationStore";

// Status Filter Component
const StatusFilterButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

// Application Card Component
const ApplicationCard = ({
  application,
  onClick,
}: {
  application: IApplication;
  onClick: () => void;
}) => {
  const job = typeof application.jobId === "object" ? application.jobId : null;
  if (!job) return null;

  // Status display configuration
  const getStatusDisplay = () => {
    switch (application.status) {
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
            <span>
              Applied{" "}
              {formatDistance(new Date(application.appliedAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
            <span>{job.location}</span>
          </div>

          {job.salary && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
              <span>
                {job.salary.min.toLocaleString()} -{" "}
                {job.salary.max.toLocaleString()} VND
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyApplicationState = () => (
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
      No applications found
    </h3>
    <p className="text-gray-500">
      You haven't applied to any jobs yet or no applications match your filter.
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
const MyApplicationList = observer(() => {
  const router = useRouter();
  const applicationStore = useApplication();
  const jobStore = useJob();

  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    IApplication[]
  >([]);

  // Pagination settings
  const applicationsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const result = await applicationStore?.getCandidateApplications();
      if (result && result.applications) {
        setApplications(result.applications);
        applyFilters(result.applications, currentFilter);
      } else {
        setApplications([]);
        setFilteredApplications([]);
      }
      setLoading(false);
    };

    fetchApplications();
  }, [applicationStore]);

  // Apply status filters
  const applyFilters = (apps: IApplication[], filter: string) => {
    let filtered = [...apps];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((app) => app.status === filter);
    }

    setFilteredApplications(filtered);
    setTotalPages(Math.ceil(filtered.length / applicationsPerPage));

    // Reset to page 1 when filter changes
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    applyFilters(applications, filter);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigate to application detail
  const handleApplicationClick = (applicationId: string) => {
    router.push(`/candidate/myapplies/${applicationId}`);
  };

  // Get current applications for pagination
  const getCurrentApplications = () => {
    const indexOfLastApp = currentPage * applicationsPerPage;
    const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
    return filteredApplications.slice(indexOfFirstApp, indexOfLastApp);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h1>

      {/* Status filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <StatusFilterButton
            label="All Applications"
            isActive={currentFilter === "all"}
            onClick={() => handleFilterChange("all")}
          />
          <StatusFilterButton
            label="Pending"
            isActive={currentFilter === "pending"}
            onClick={() => handleFilterChange("pending")}
          />
          <StatusFilterButton
            label="Approved"
            isActive={currentFilter === "approved"}
            onClick={() => handleFilterChange("approved")}
          />
          <StatusFilterButton
            label="Rejected"
            isActive={currentFilter === "rejected"}
            onClick={() => handleFilterChange("rejected")}
          />
        </div>
      </div>

      {/* Applications list */}
      {loading ? (
        <LoadingState />
      ) : filteredApplications.length === 0 ? (
        <EmptyApplicationState />
      ) : (
        <div className="space-y-4">
          {getCurrentApplications().map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onClick={() => handleApplicationClick(application._id)}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <AdvancedPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default MyApplicationList;
