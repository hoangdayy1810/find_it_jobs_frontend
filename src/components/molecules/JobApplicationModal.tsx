"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { useApplication, useCandidate } from "@/contexts/AppContext";
import { getCleanFileName } from "@/utils/getCleanFilename";
import DownloadIcon from "@/components/atoms/icons/DownloadIcon";
import Network from "@/components/atoms/icons/Network";
import { observer } from "mobx-react-lite";
import { formatDate } from "@/utils/fommat_date";
import Email from "@/components/atoms/icons/Email";
import Phone from "@/components/atoms/icons/Phone";
import DateIcon from "@/components/atoms/icons/Date";
import Gender from "@/components/atoms/icons/Gender";
import Location from "@/components/atoms/icons/Location";
import { useTranslations } from "next-intl";
import { GENDER, DEGREE, POSITION, DURATION } from "@/utils/constant";
import XIcon from "../atoms/icons/XIcon";
import LoadingIcon from "../atoms/icons/LoadingIcon";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

const schema = yup.object({
  cvFile: yup.mixed(),
  coverLetter: yup.string(),
});

const JobApplicationModal = observer(
  ({
    isOpen,
    onClose,
    jobId,
    jobTitle,
    companyName,
  }: JobApplicationModalProps) => {
    const t = useTranslations();
    const candidateStore = useCandidate();
    const applicationStore = useApplication();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tab, setTab] = useState<"profile" | "application">("profile");

    // Initialize form with candidate data
    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors },
      reset,
    } = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        cvFile: candidateStore?.candidate?.cvFile || undefined,
        coverLetter: "",
      },
    });

    // Update form values when candidate data changes
    useEffect(() => {
      if (candidateStore?.candidate && isOpen) {
        reset({
          cvFile: candidateStore.candidate.cvFile || null,
          coverLetter: "",
        });
      }
    }, [candidateStore?.candidate, isOpen, reset]);

    // Handle form submission
    const onSubmit = async (data: any) => {
      try {
        setIsSubmitting(true);
        const formData = new FormData();

        // Add job and candidate info
        formData.append("jobId", jobId);
        formData.append("fullName", candidateStore?.candidate?.fullName || "");
        formData.append("email", candidateStore?.candidate?.email || "");
        formData.append("phone", candidateStore?.candidate?.phone || "");
        formData.append("coverLetter", data.coverLetter || "");

        // Handle CV file
        if (data.cvFile instanceof FileList && data.cvFile.length > 0) {
          formData.append("cvFile", data.cvFile[0]);
        } else if (typeof data.cvFile === "string" && data.cvFile) {
          // If using existing CV, send the URL/path
          formData.append("existingCvFile", data.cvFile);
        }

        // Submit application using applicationStore
        const result = await applicationStore?.applyForJob(formData);

        if (result?.success) {
          onClose();
        }
      } catch (error) {
        console.error("Error submitting application:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isOpen) return null;

    const candidate = candidateStore?.candidate;

    // Get label function using constants
    const getLabel = (
      array: Array<{ value: string; label: string }>,
      value: string
    ) => {
      const found = array.find(
        (item) => item.value.toLowerCase() === value.toLowerCase()
      );
      return found ? t(found.label) : value;
    };

    return (
      <div className="fixed inset-0 bg-black/10 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header with tabs */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <div className="flex space-x-4">
                <button
                  onClick={() => setTab("profile")}
                  className={`px-4 py-2 font-medium ${
                    tab === "profile"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {t("job_application.modal.tabs.profile")}
                </button>
                <button
                  onClick={() => setTab("application")}
                  className={`px-4 py-2 font-medium ${
                    tab === "application"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {t("job_application.modal.tabs.application")}
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <XIcon />
              </button>
            </div>

            {/* Job Information */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-lg">{jobTitle}</p>
              <p className="text-gray-600">{companyName}</p>
            </div>

            {tab === "profile" && candidate && (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white p-4 rounded-lg shadow-sm relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="mr-6 mb-4 sm:mb-0">
                      <div className="w-32 h-32 overflow-hidden relative">
                        <Image
                          src={
                            candidate.avatar || "/images/avatar_placeholder.png"
                          }
                          alt="Profile"
                          fill={true}
                          className="object-contain"
                          priority
                          unoptimized
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {candidate.fullName}
                      </h2>
                      <p className="text-gray-600">{candidate.jobTitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">
                        <Email />
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("job_application.modal.personal_info.email")}
                        </p>
                        <p>{candidate.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">
                        <Phone />
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("job_application.modal.personal_info.phone")}
                        </p>
                        <p>{candidate.phone}</p>
                      </div>
                    </div>
                    {candidate.dateOfBirth && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          <DateIcon />
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t(
                              "job_application.modal.personal_info.birth_date"
                            )}
                          </p>
                          <p>{formatDate(new Date(candidate.dateOfBirth))}</p>
                        </div>
                      </div>
                    )}
                    {candidate.gender && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          <Gender />
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t("job_application.modal.personal_info.gender")}
                          </p>
                          <p>{getLabel(GENDER, candidate.gender)}</p>
                        </div>
                      </div>
                    )}
                    {candidate.address && (
                      <div className="flex items-center space-x-2 col-span-2">
                        <span className="text-gray-500">
                          <Location />
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t("job_application.modal.personal_info.address")}
                          </p>
                          <p>{candidate.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Section */}
                {candidate.skills && candidate.skills.length > 0 ? (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {t("job_application.modal.skills.title")}
                    </h3>

                    {/* Group skills by key */}
                    {Array.isArray(candidate.skills) ? (
                      <div className="space-y-4">
                        {/* Get unique keys */}
                        {[
                          ...new Set(
                            candidate.skills.map((skill) => skill.key)
                          ),
                        ].map((key) => (
                          <div key={key} className="mb-2">
                            <h4 className="text-sm font-medium text-gray-600 mb-1">
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
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        {t("job_application.modal.skills.no_skills")}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {t("job_application.modal.skills.title")}
                    </h3>
                    <p className="text-gray-500 italic">
                      {t("job_application.modal.skills.no_skills")}
                    </p>
                  </div>
                )}

                {/* Education Section */}
                {candidate.education && candidate.education.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {t("job_application.modal.education.title")}
                    </h3>
                    <div className="space-y-3">
                      {candidate.education.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-500 pl-4"
                        >
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

                {/* Experience Section */}
                {candidate.experience && candidate.experience.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {t("job_application.modal.experience.title")}
                    </h3>
                    <div className="space-y-3">
                      {candidate.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-green-500 pl-4"
                        >
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

                {/* About Section */}
                {candidate.other && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {t("job_application.modal.about.title")}
                    </h3>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          candidate.other ||
                          `<p><em>${t(
                            "job_application.modal.about.no_info"
                          )}</em></p>`,
                      }}
                    />
                  </div>
                )}

                {/* Achievement Section */}
                {candidate.achievement && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {t("job_application.modal.achievements.title")}
                    </h3>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          candidate.achievement ||
                          `<p><em>${t(
                            "job_application.modal.achievements.no_info"
                          )}</em></p>`,
                      }}
                    />
                  </div>
                )}

                {/* Resume/CV Section */}
                {candidate.cvFile && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      {t("job_application.modal.cv.title")}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          <Network />
                        </span>
                        <span className="text-sm text-gray-600">
                          {getCleanFileName(candidate.cvFile)}
                        </span>
                      </div>
                      <a
                        href={candidate.cvFile}
                        download={getCleanFileName(candidate.cvFile)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 flex items-center text-sm"
                        rel="noopener noreferrer"
                      >
                        <span className="mr-1">
                          {t("job_application.modal.cv.download")}
                        </span>
                        <DownloadIcon />
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setTab("application")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t("job_application.modal.buttons.continue")}
                  </button>
                </div>
              </div>
            )}

            {tab === "application" && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <p className="text-gray-700">
                  {t.rich("job_application.modal.applying_as", {
                    name: candidateStore?.candidate?.fullName || "",
                    bold: (chunks) => (
                      <span className="font-semibold">{chunks}</span>
                    ),
                  })}
                </p>

                {/* CV Upload */}
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">
                    {t("job_application.modal.cv.title")}
                  </h3>
                  <Controller
                    name="cvFile"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => {
                      let displayFileName = null;
                      if (value instanceof FileList && value.length > 0) {
                        displayFileName = value[0]?.name;
                      } else if (typeof value === "string" && value) {
                        displayFileName = getCleanFileName(value);
                      }

                      return (
                        <div className="space-y-3">
                          {/* Current CV indication */}
                          {typeof value === "string" && value && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Network />
                                  <span className="ml-2 text-sm text-gray-600">
                                    {t("job_application.modal.cv.current", {
                                      filename:
                                        displayFileName ||
                                        t("job_application.modal.cv.no_file"),
                                    })}
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <a
                                    href={value}
                                    download={getCleanFileName(value)}
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 flex items-center text-sm"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="mr-1">
                                      {t("job_application.modal.cv.download")}
                                    </span>
                                    <DownloadIcon />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* New CV upload */}
                          <div className="flex flex-col">
                            <p className="text-sm text-gray-600 mb-2">
                              {typeof value === "string" && value
                                ? t("job_application.modal.cv.upload_different")
                                : t("job_application.modal.cv.upload_new")}
                            </p>
                            <div className="flex items-center">
                              <label className="bg-blue-100 text-blue-600 px-3 py-1 rounded cursor-pointer hover:bg-blue-200">
                                {t("job_application.modal.cv.select_file")}
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  className="hidden"
                                  onClick={(e) => {
                                    (e.target as HTMLInputElement).value = "";
                                  }}
                                  onChange={(e) => {
                                    onChange(e.target.files);
                                  }}
                                />
                              </label>
                              {value instanceof FileList &&
                                value.length > 0 && (
                                  <div className="ml-3 flex items-center">
                                    <span className="text-sm text-gray-600 mr-2">
                                      {value[0]?.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setValue(
                                          "cvFile",
                                          candidateStore?.candidate?.cvFile ||
                                            undefined
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      {t("job_application.modal.cv.delete")}
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {errors.cvFile && (
                    <p className="mt-1 text-sm text-red-600">
                      {typeof errors.cvFile === "object" &&
                      "message" in errors.cvFile
                        ? (errors.cvFile as { message?: string }).message
                        : ""}
                    </p>
                  )}
                </div>

                {/* Cover Letter */}
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <label className="block text-lg font-medium mb-2">
                    {t("job_application.modal.cover_letter.title")}
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    {t("job_application.modal.cover_letter.description")}
                  </p>
                  <Controller
                    name="coverLetter"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        className="w-full p-3 border rounded-md h-40"
                        placeholder={t(
                          "job_application.modal.cover_letter.placeholder"
                        )}
                      />
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setTab("profile")}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    {t("job_application.modal.buttons.back")}
                  </button>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      {t("job_application.modal.buttons.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingIcon />
                          {t("job_application.modal.buttons.submitting")}
                        </>
                      ) : (
                        t("job_application.modal.buttons.submit")
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default JobApplicationModal;
