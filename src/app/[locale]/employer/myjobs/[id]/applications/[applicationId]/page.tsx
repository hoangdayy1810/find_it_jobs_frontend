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
import { useTranslations } from "next-intl";
import { GENDER, DEGREE, POSITION, DURATION } from "@/utils/constant";

const DetailApplication = observer(() => {
  const t = useTranslations();
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
            {t("employer.myjobs.application_detail.not_found")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("employer.myjobs.application_detail.not_found_message")}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("employer.myjobs.application_detail.go_back")}
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
            {t("employer.myjobs.application_detail.candidate_unavailable")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t(
              "employer.myjobs.application_detail.candidate_unavailable_message"
            )}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("employer.myjobs.application_detail.go_back")}
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
          text: t("employer.myjobs.application_detail.status.pending"),
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        };
      case "approved":
        return {
          text: t("employer.myjobs.application_detail.status.approved"),
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case "rejected":
        return {
          text: t("employer.myjobs.application_detail.status.rejected"),
          bgColor: "bg-red-100",
          textColor: "text-red-800",
        };
      default:
        return {
          text: t("employer.myjobs.application_detail.status.unknown"),
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  // Replace hardcoded label functions with translations
  const getLabel = (
    array: Array<{ value: string; label: string }>,
    value: string
  ) => {
    const found = array.find((item) => item.value === value);
    return found ? t(found.label) : value;
  };

  const statusDisplay = getStatusDisplay();

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
              {t("employer.myjobs.application_detail.title")}
            </h1>
            <p className="text-gray-600">
              {t("employer.myjobs.application_detail.for_position", {
                jobTitle:
                  job?.title ||
                  t("employer.myjobs.application_detail.unknown_job"),
              })}
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
                {t("employer.myjobs.application_detail.actions.accept")}
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={processingAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("employer.myjobs.application_detail.actions.reject")}
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
                    {getLabel(GENDER, candidate.gender)}
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
            <h3 className="text-lg font-semibold mb-4">
              {t(
                "employer.myjobs.application_detail.sections.application_details"
              )}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("employer.myjobs.application_detail.sections.applied_on")}
                </span>
                <span className="font-medium">
                  {formatDate(new Date(application.appliedAt))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("employer.myjobs.application_detail.sections.status")}
                </span>
                <span className={`font-medium ${statusDisplay.textColor}`}>
                  {statusDisplay.text}
                </span>
              </div>
            </div>

            {/* CV download section */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-medium mb-2">
                {t("employer.myjobs.application_detail.sections.resume")}
              </h4>
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
                  <span className="mr-1">
                    {t("employer.myjobs.application_detail.sections.download")}
                  </span>
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
              <h3 className="text-lg font-semibold mb-4">
                {t("employer.myjobs.application_detail.sections.cover_letter")}
              </h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{application.coverLetter}</p>
              </div>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {t("employer.myjobs.application_detail.sections.skills")}
              </h3>

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
                  {t("employer.myjobs.application_detail.sections.no_skills")}
                </p>
              )}
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {t("employer.myjobs.application_detail.sections.education")}
              </h3>
              <div className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{edu.school}</h4>
                    <div className="text-gray-600 flex items-center space-x-2">
                      <span>{getLabel(DEGREE, edu.degree)}</span>
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
              <h3 className="text-lg font-semibold mb-4">
                {t(
                  "employer.myjobs.application_detail.sections.work_experience"
                )}
              </h3>
              <div className="space-y-4">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">{exp.company}</h4>
                    <div className="text-gray-600 flex items-center space-x-2">
                      <span>{getLabel(POSITION, exp.position)}</span>
                      <span>•</span>
                      <span>{getLabel(DURATION, exp.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {candidate.other && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {t("employer.myjobs.application_detail.sections.about")}
              </h3>
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
              <h3 className="text-lg font-semibold mb-4">
                {t("employer.myjobs.application_detail.sections.achievements")}
              </h3>
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
                {t("employer.myjobs.application_detail.actions.accept")}
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={processingAction}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
              >
                {t("employer.myjobs.application_detail.actions.reject")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      <Modal_YesNo
        isOpen={showAcceptModal}
        modalTitle={t("modal-yes-no.accept-application.title")}
        modalMessage={t("modal-yes-no.accept-application.message")}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleAccept}
        confirmButtonColor="green"
      />

      {/* Reject Confirmation Modal */}
      <Modal_YesNo
        isOpen={showRejectModal}
        modalTitle={t("modal-yes-no.reject-application.title")}
        modalMessage={t("modal-yes-no.reject-application.message")}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        confirmButtonColor="red"
      />
    </div>
  );
});

export default DetailApplication;
