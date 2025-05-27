import React from "react";
import { IApplication } from "@/stores/applicationStore";
import Image from "next/image";
import { formatDistance } from "date-fns";

interface ApplicationListItemProps {
  application: IApplication;
  onClick: () => void;
}

const ApplicationListItem: React.FC<ApplicationListItemProps> = ({
  application,
  onClick,
}) => {
  // Check if candidateId is an object with properties
  const candidate =
    typeof application.candidateId === "object"
      ? application.candidateId
      : null;

  // Get status display properties
  const getStatusDisplay = () => {
    switch (application.status) {
      case "pending":
        return {
          text: "Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        };
      case "approved":
        return {
          text: "Approved",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case "rejected":
        return {
          text: "Rejected",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
        };
      default:
        return {
          text: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
    >
      <div className="flex items-start space-x-4">
        {/* Candidate Avatar */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 relative overflow-hidden rounded-full">
            {candidate?.avatar ? (
              <Image
                src={candidate.avatar}
                alt={candidate.fullName || "Candidate"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Candidate Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {candidate?.fullName || "Candidate"}
          </h3>
          <p className="text-gray-600 truncate">
            {candidate?.jobTitle || "Applicant"}
          </p>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span>
              Applied{" "}
              {formatDistance(new Date(application.appliedAt), new Date(), {
                addSuffix: true,
              })}
            </span>
            {candidate?.education && candidate.education.length > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{candidate.education[0].school}</span>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
        >
          {statusDisplay.text}
        </div>
      </div>
    </div>
  );
};

export default ApplicationListItem;
