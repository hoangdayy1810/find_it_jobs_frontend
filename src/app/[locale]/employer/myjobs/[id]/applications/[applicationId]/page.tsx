"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useApplication, useJob } from "@/contexts/AppContext";
import Image from "next/image";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import Email from "@/components/atoms/icons/Email";
import Phone from "@/components/atoms/icons/Phone";
import Location from "@/components/atoms/icons/Location";
import Network from "@/components/atoms/icons/Network";
import DownloadIcon from "@/components/atoms/icons/DownloadIcon";
import { formatDate } from "@/utils/fommat_date";
import { getCleanFileName } from "@/utils/getCleanFilename";
import Modal_YesNo from "@/components/atoms/Modal_YesNo";
import DateIcon from "@/components/atoms/icons/Date";
import Gender from "@/components/atoms/icons/Gender";

const DetailApplication = observer(() => {
  const params = useParams();
  const router = useRouter();
  const applicationStore = useApplication();
  const jobStore = useJob();
  const [loading, setLoading] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  const applicationId = params.applicationId as string;
  const jobId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        applicationStore?.getApplicationById(applicationId),
        jobStore?.getPrivateJobById(jobId),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [applicationId, jobId, applicationStore, jobStore]);

  const handleBack = () => {
    router.back();
  };

  const handleAccept = async () => {
    setProcessingAction(true);
    const result = await applicationStore?.updateApplicationStatus(
      applicationId,
      "approved"
    );
    setProcessingAction(false);
    setShowAcceptModal(false);
    if (result?.application) {
      // Optional: Wait a moment before going back to give user feedback
      setTimeout(() => router.back(), 1500);
    }
  };

  const handleReject = async () => {
    setProcessingAction(true);
    const result = await applicationStore?.updateApplicationStatus(
      applicationId,
      "rejected"
    );
    setProcessingAction(false);
    setShowRejectModal(false);
    if (result?.application) {
      // Optional: Wait a moment before going back to give user feedback
      setTimeout(() => router.back(), 1500);
    }
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
  const job = jobStore?.jobDetail;
  const candidate =
    typeof application.candidateId === "object"
      ? application.candidateId
      : null;

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Candidate Information Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            Candidate details could not be loaded for this application.
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

  // Helper function to get status display properties
  const getStatusDisplay = () => {
    switch (application.status) {
      case "pending":
        return {
          text: "Pending Review",
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

  // Find labels for candidate's selection values
  const getGenderLabel = (value: string) => {
    const options = [
      { value: "Male", label: "Nam" },
      { value: "Female", label: "Nữ" },
      { value: "Other", label: "Khác" },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getDegreeLabel = (value: string) => {
    const options = [
      { value: "high_school", label: "Trung học phổ thông" },
      { value: "associate", label: "Cao đẳng" },
      { value: "bachelor", label: "Cử nhân" },
      { value: "master", label: "Thạc sĩ" },
      { value: "phd", label: "Tiến sĩ" },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getPositionLabel = (value: string) => {
    const options = [
      { value: "intern", label: "Thực tập sinh" },
      { value: "fresher", label: "Fresher" },
      { value: "junior", label: "Junior" },
      { value: "middle", label: "Middle" },
      { value: "senior", label: "Senior" },
      { value: "team_lead", label: "Team Lead" },
      { value: "manager", label: "Manager" },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getDurationLabel = (value: string) => {
    const options = [
      { value: "less_than_1", label: "Dưới 1 năm" },
      { value: "1_3", label: "1-3 năm" },
      { value: "3_5", label: "3-5 năm" },
      { value: "more_than_5", label: "Trên 5 năm" },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with back button, status and action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            aria-label="Back"
          >
            <VectorLeftIcon />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Application Details
            </h1>
            <p className="text-gray-600">
              For position: <span className="font-medium">{job?.title}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className={`px-4 py-1 rounded-full text-sm font-medium ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
          >
            {statusDisplay.text}
          </div>

          {application.status === "pending" && (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAcceptModal(true)}
                disabled={processingAction}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={processingAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Candidate overview */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Candidate profile card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-48 h-64 relative overflow-hidden mb-4">
                <Image
                  src={candidate.avatar || "/images/avatar_placeholder.png"}
                  alt={candidate.fullName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {candidate.fullName}
              </h2>
              <p className="text-gray-600">{candidate.jobTitle}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">
                  <Email />
                </span>
                <span className="text-gray-700">{candidate.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">
                  <Phone />
                </span>
                <span className="text-gray-700">{candidate.phone}</span>
              </div>
              {candidate.dateOfBirth && (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">
                    <DateIcon />
                  </span>
                  <span className="text-gray-700">
                    {formatDate(new Date(candidate.dateOfBirth))}
                  </span>
                </div>
              )}
              {candidate.gender && (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">
                    <Gender />
                  </span>
                  <span className="text-gray-700">
                    {getGenderLabel(candidate.gender)}
                  </span>
                </div>
              )}
              {candidate.address && (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">
                    <Location />
                  </span>
                  <span className="text-gray-700">{candidate.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Application details card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Application Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Applied on:</span>
                <span className="font-medium">
                  {formatDate(new Date(application.appliedAt))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${statusDisplay.textColor}`}>
                  {statusDisplay.text}
                </span>
              </div>
            </div>

            {/* CV download section */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-medium mb-2">Resume/CV</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">
                    <Network />
                  </span>
                  <span className="text-sm text-gray-600">
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
          </div>
        </div>

        {/* Right column - Application and candidate details */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Cover Letter</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{application.coverLetter}</p>
              </div>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>

              {Array.isArray(candidate.skills) &&
              candidate.skills.length > 0 ? (
                <div className="space-y-4">
                  {/* Group skills by category (key) */}
                  {[...new Set(candidate.skills.map((skill) => skill.key))].map(
                    (key) => (
                      <div key={key} className="mb-4">
                        <h4 className="text-md font-medium text-gray-700 mb-2">
                          {key}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills
                            .filter((skill) => skill.key === key)
                            .map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                              >
                                {skill.value}
                              </span>
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No skills information available
                </p>
              )}
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Education</h3>
              <div className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{edu.school}</h4>
                    <div className="text-gray-600 flex items-center space-x-2">
                      <span>{getDegreeLabel(edu.degree)}</span>
                      <span>•</span>
                      <span>{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {candidate.experience && candidate.experience.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
              <div className="space-y-4">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">{exp.company}</h4>
                    <div className="text-gray-600 flex items-center space-x-2">
                      <span>{getPositionLabel(exp.position)}</span>
                      <span>•</span>
                      <span>{getDurationLabel(exp.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {candidate.other && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: candidate.other,
                }}
              />
            </div>
          )}

          {/* Achievements */}
          {candidate.achievement && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: candidate.achievement,
                }}
              />
            </div>
          )}

          {/* Action buttons for mobile (duplicate for better UX on mobile) */}
          {application.status === "pending" && (
            <div className="flex justify-center space-x-4 md:hidden">
              <button
                onClick={() => setShowAcceptModal(true)}
                disabled={processingAction}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
              >
                Accept
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={processingAction}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      <Modal_YesNo
        isOpen={showAcceptModal}
        modalMessage="Are you sure you want to accept this application?"
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleAccept}
      />

      {/* Reject Confirmation Modal */}
      <Modal_YesNo
        isOpen={showRejectModal}
        modalMessage="Are you sure you want to reject this application?"
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
      />
    </div>
  );
});

export default DetailApplication;
