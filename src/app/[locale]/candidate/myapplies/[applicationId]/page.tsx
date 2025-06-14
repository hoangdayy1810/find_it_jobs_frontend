"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useApplication, useJob } from "@/contexts/AppContext";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import { formatDistance, format } from "date-fns";
import { formatDate } from "@/utils/fommat_date";
import { getCleanFileName } from "@/utils/getCleanFilename";
import Network from "@/components/atoms/icons/Network";
import DownloadIcon from "@/components/atoms/icons/DownloadIcon";
import { useTranslations } from "next-intl";
import { JOBTYPE } from "@/utils/constant";
import CompanyLogo from "@/components/atoms/CompanyLogo";
import StatusBadge from "@/components/atoms/StatusBadge";
import JobDetailItem from "@/components/atoms/JobDetailItem";
import TimelineItem from "@/components/atoms/TimelineItem";
import { useLocale } from "next-intl";
import { enUS, vi } from "date-fns/locale";
import Location_mdIcon from "@/components/atoms/icons/Location_mdIcon";
import Salary_mdIcon from "@/components/atoms/icons/Salary_mdIcon";
import Job_mdIcon from "@/components/atoms/icons/Job_mdIcon";
import Calendar_mdIcon from "@/components/atoms/icons/Calendar_mdIcon";

const DetailApplication = observer(() => {
  const params = useParams();
  const router = useRouter();
  const applicationStore = useApplication();
  const jobStore = useJob();
  const [loading, setLoading] = useState(true);
  const t = useTranslations();
  const locale = useLocale();

  const localeMap = {
    en: enUS,
    vi: vi,
  };

  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;
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
            {t("myapplies.application_detail.not_found")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("myapplies.application_detail.not_found_message")}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("myapplies.application_detail.go_back")}
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
            {t("myapplies.application_detail.job_unavailable")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("myapplies.application_detail.job_unavailable_message")}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("myapplies.application_detail.go_back")}
          </button>
        </div>
      </div>
    );
  }

  // Get employer info if available
  const employer = typeof job.employerId === "object" ? job.employerId : null;

  // Find the translation key for job type
  const getJobTypeTranslation = (jobType: string) => {
    const jobTypeObj = JOBTYPE.find((type) => type.value === jobType);
    return jobTypeObj ? t(jobTypeObj.label) : jobType;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <VectorLeftIcon />
          <span className="ml-2">
            {t("myapplies.application_detail.back_to_applications")}
          </span>
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
          <StatusBadge t={t} status={application.status} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Job & Application Details */}
        <div className="w-full lg:w-2/3">
          {/* Job Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              {t("myapplies.application_detail.job_information")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <JobDetailItem
                icon={<Location_mdIcon />}
                label={t("myapplies.application_detail.location")}
                value={job.location}
              />

              <JobDetailItem
                icon={<Salary_mdIcon />}
                label={t("myapplies.application_detail.salary")}
                value={`${job.salary.min.toLocaleString()} ${" "} ${t(
                  "all.VND"
                )} - ${job.salary.max.toLocaleString()} ${" "} ${t("all.VND")}`}
              />

              <JobDetailItem
                icon={<Job_mdIcon />}
                label={t("myapplies.application_detail.job_type")}
                value={getJobTypeTranslation(job.jobType)}
              />

              <JobDetailItem
                icon={<Calendar_mdIcon />}
                label={t("myapplies.application_detail.posted_on")}
                value={
                  job.postedAt
                    ? formatDate(new Date(job.postedAt))
                    : t("myapplies.application_detail.not_specified")
                }
              />
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              {t("myapplies.application_detail.application_timeline")}
            </h2>

            <div className="mt-4">
              <TimelineItem
                date={format(new Date(application.appliedAt), "PPP 'at' p")}
                title={t("myapplies.application_detail.application_submitted")}
                description={t(
                  "myapplies.application_detail.application_submitted_desc"
                )}
              />

              {application.status === "approved" && (
                <TimelineItem
                  date={format(new Date(), "PPP 'at' p")}
                  title={t("myapplies.application_detail.application_approved")}
                  description={t(
                    "myapplies.application_detail.application_approved_desc"
                  )}
                  isLast={true}
                />
              )}

              {application.status === "rejected" && (
                <TimelineItem
                  date={format(new Date(), "PPP 'at' p")}
                  title={t("myapplies.application_detail.application_rejected")}
                  description={t(
                    "myapplies.application_detail.application_rejected_desc"
                  )}
                  isLast={true}
                />
              )}

              {application.status === "pending" && (
                <TimelineItem
                  date={format(new Date(), "PPP 'at' p")}
                  title={t("myapplies.application_detail.under_review")}
                  description={t(
                    "myapplies.application_detail.under_review_desc"
                  )}
                  isLast={true}
                />
              )}
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                {t("myapplies.application_detail.cover_letter")}
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
              {t("myapplies.application_detail.application_summary")}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("myapplies.application_detail.application_id")}
                </span>
                <span className="font-medium">{application._id.slice(-8)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("myapplies.application_detail.applied_on")}
                </span>
                <span className="font-medium">
                  {formatDate(new Date(application.appliedAt))}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("myapplies.application_detail.status")}
                </span>
                <span className="font-medium">
                  {application.status === "pending" && (
                    <span className="text-yellow-600">
                      {t("application.status.pending")}
                    </span>
                  )}
                  {application.status === "approved" && (
                    <span className="text-green-600">
                      {t("application.status.approved")}
                    </span>
                  )}
                  {application.status === "rejected" && (
                    <span className="text-red-600">
                      {t("application.status.rejected")}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("myapplies.application_detail.time_in_review")}
                </span>
                <span className="font-medium">
                  {formatDistance(new Date(application.appliedAt), new Date(), {
                    addSuffix: false,
                    locale: dateLocale,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Submitted Resume Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              {t("myapplies.application_detail.submitted_resume")}
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
                <span className="mr-1">
                  {t("myapplies.application_detail.download")}
                </span>
                <DownloadIcon />
              </a>
            </div>
          </div>

          {/* What's Next Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              {t("myapplies.application_detail.whats_next")}
            </h2>

            <div className="space-y-4">
              {application.status === "pending" && (
                <>
                  <p className="text-sm">
                    {t("myapplies.application_detail.pending_message")}
                  </p>
                  <p className="text-sm">
                    {t("myapplies.application_detail.average_response")}
                  </p>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-sm text-yellow-800">
                      {t("myapplies.application_detail.pending_tip")}
                    </p>
                  </div>
                </>
              )}

              {application.status === "approved" && (
                <>
                  <p className="text-sm">
                    {t("myapplies.application_detail.approved_message")}
                  </p>
                  <p className="text-sm">
                    {t("myapplies.application_detail.approved_next_steps")}
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>{t("myapplies.application_detail.approved_step1")}</li>
                    <li>{t("myapplies.application_detail.approved_step2")}</li>
                    <li>{t("myapplies.application_detail.approved_step3")}</li>
                  </ul>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800">
                      {t("myapplies.application_detail.approved_tip")}
                    </p>
                  </div>
                </>
              )}

              {application.status === "rejected" && (
                <>
                  <p className="text-sm">
                    {t("myapplies.application_detail.rejected_message")}
                  </p>
                  <p className="text-sm">
                    {t("myapplies.application_detail.rejected_next")}
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>{t("myapplies.application_detail.rejected_step1")}</li>
                    <li>{t("myapplies.application_detail.rejected_step2")}</li>
                    <li>{t("myapplies.application_detail.rejected_step3")}</li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      {t("myapplies.application_detail.rejected_tip")}
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
