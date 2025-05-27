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
    const candidateStore = useCandidate();
    const applicationStore = useApplication();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tab, setTab] = useState<"profile" | "application">("profile");

    // Initialize form with candidate data
    const {
      control,
      handleSubmit,
      setValue,
      watch,
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
                  Thông tin ứng viên
                </button>
                <button
                  onClick={() => setTab("application")}
                  className={`px-4 py-2 font-medium ${
                    tab === "application"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Nộp đơn ứng tuyển
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Job Information */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-lg">{jobTitle}</p>
              <p className="text-gray-600">{companyName}</p>
            </div>

            {tab === "profile" && candidate && (
              <div className="space-y-6">
                {/* Profile Header Card - Similar to candidate profile */}
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
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{candidate.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">
                        <Phone />
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">Điện thoại</p>
                        <p>{candidate.phone}</p>
                      </div>
                    </div>
                    {candidate.dateOfBirth && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          <DateIcon />
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">Ngày sinh</p>
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
                          <p className="text-sm text-gray-500">Giới tính</p>
                          <p>{getGenderLabel(candidate.gender)}</p>
                        </div>
                      </div>
                    )}
                    {candidate.address && (
                      <div className="flex items-center space-x-2 col-span-2">
                        <span className="text-gray-500">
                          <Location />
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">Địa chỉ</p>
                          <p>{candidate.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Section */}
                {candidate.skills && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Kỹ năng</h3>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          candidate.skills ||
                          "<p><em>Chưa có thông tin kỹ năng</em></p>",
                      }}
                    />
                  </div>
                )}

                {/* Education Section */}
                {candidate.education && candidate.education.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Học vấn</h3>
                    <div className="space-y-3">
                      {candidate.education.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-500 pl-4"
                        >
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

                {/* Experience Section */}
                {candidate.experience && candidate.experience.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      Kinh nghiệm làm việc
                    </h3>
                    <div className="space-y-3">
                      {candidate.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-green-500 pl-4"
                        >
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

                {/* About Section */}
                {candidate.other && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      Giới thiệu bản thân
                    </h3>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          candidate.other ||
                          "<p><em>Chưa có thông tin giới thiệu</em></p>",
                      }}
                    />
                  </div>
                )}

                {/* Achievement Section */}
                {candidate.achievement && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Thành tựu</h3>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          candidate.achievement ||
                          "<p><em>Chưa có thông tin thành tựu</em></p>",
                      }}
                    />
                  </div>
                )}

                {/* Resume/CV Section */}
                {candidate.cvFile && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">
                      CV/Resume hiện tại
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
                        <span className="mr-1">Tải xuống</span>
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
                    Tiếp tục nộp đơn
                  </button>
                </div>
              </div>
            )}

            {tab === "application" && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <p className="text-gray-700">
                  Bạn đang ứng tuyển với tư cách{" "}
                  <span className="font-semibold">
                    {candidateStore?.candidate?.fullName}
                  </span>
                  . Vui lòng tải lên CV và thêm thư xin việc (tuỳ chọn) để hoàn
                  tất đơn ứng tuyển.
                </p>

                {/* CV Upload */}
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">
                    CV/Resume (Tùy chọn)
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
                                    Đang sử dụng CV từ hồ sơ: {displayFileName}
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <a
                                    href={value}
                                    download={getCleanFileName(value)}
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 flex items-center text-sm"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="mr-1">Tải xuống</span>
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
                                ? "Tải lên CV khác cho đơn ứng tuyển này (tuỳ chọn)"
                                : "Tải lên CV của bạn cho đơn ứng tuyển này"}
                            </p>
                            <div className="flex items-center">
                              <label className="bg-blue-100 text-blue-600 px-3 py-1 rounded cursor-pointer hover:bg-blue-200">
                                Chọn tệp
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
                                      Xoá
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
                    Thư xin việc (Tuỳ chọn)
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Giới thiệu bản thân và giải thích lý do bạn phù hợp với vị
                    trí này.
                  </p>
                  <Controller
                    name="coverLetter"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        className="w-full p-3 border rounded-md h-40"
                        placeholder="Viết thư xin việc của bạn tại đây..."
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
                    Quay lại thông tin
                  </button>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Huỷ
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang gửi...
                        </>
                      ) : (
                        "Nộp đơn ứng tuyển"
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
