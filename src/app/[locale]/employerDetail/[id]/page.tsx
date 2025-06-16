"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import { useEmployer } from "@/contexts/AppContext";
import { useTranslations, useLocale } from "next-intl";
import EmptyState from "@/components/atoms/EmptyState";
import JobCard2 from "@/components/molecules/JobCard2";
import CompanyInfoCard from "@/components/organisms/CompanyInfoCard";
import LoadingState from "@/components/atoms/LoadingState";
import { formatWorkingDays, parseWorkingDays } from "@/utils/formatWorkingDays";
import { IEmployer } from "@/stores/employerStore";
import { COMPANYSIZE } from "@/utils/constant";

const EmployerDetailPage = observer(() => {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const employerId = params.id as string;
  const employerStore = useEmployer();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTranslatedWorkingDays = (days: string[]) => {
    // First get the formatted string with the original function
    const formattedDays = formatWorkingDays(days);

    if (!formattedDays) return "";

    // Create a mapping for day name translations
    const dayTranslations: Record<string, string> = {
      "Thứ Hai": t("application.company.workingDays.monday"),
      "Thứ Ba": t("application.company.workingDays.tuesday"),
      "Thứ Tư": t("application.company.workingDays.wednesday"),
      "Thứ Năm": t("application.company.workingDays.thursday"),
      "Thứ Sáu": t("application.company.workingDays.friday"),
      "Thứ Bảy": t("application.company.workingDays.saturday"),
      "Chủ Nhật": t("application.company.workingDays.sunday"),
    };

    // Replace each Vietnamese day name with its translation
    let translatedString = formattedDays;
    for (const [vietDay, translatedDay] of Object.entries(dayTranslations)) {
      translatedString = translatedString.replace(
        new RegExp(vietDay, "g"),
        translatedDay
      );
    }

    return translatedString;
  };

  useEffect(() => {
    const fetchEmployerDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all jobs without pagination
        const response = await employerStore?.getEmployerDetailsWithJobs(
          employerId
        );

        if (!response || !response.employer) {
          setError("Failed to load employer details. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching employer details:", err);
        setError("Failed to load employer details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (employerId) {
      fetchEmployerDetails();
    }
  }, [employerId, employerStore]);

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  // Use values from the store
  const employer = {
    ...employerStore?.currentEmployer,
    workingDays: employerStore?.currentEmployer?.workingDays
      ? getTranslatedWorkingDays(
          parseWorkingDays(employerStore?.currentEmployer?.workingDays)
        )
      : employerStore?.currentEmployer?.workingDays || "",
  };
  const jobs = employerStore?.employerJobs || [];
  const totalJobs = employerStore?.totalJobs || 0;

  if (error || !employer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || t("employer_detail.error.title")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("employer_detail.error.description")}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("employer_detail.error.go_back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <VectorLeftIcon />
          <span className="ml-2">{t("employer_detail.back")}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Company Info (now 2/3 of the page) */}
        <div className="w-full lg:w-2/3">
          <CompanyInfoCard employer={employer as IEmployer} t={t} />
        </div>

        {/* Right column - Job Listings (now 1/3 of the page) */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 shadow-sm rounded-lg mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {t("employer_detail.job_openings", { count: totalJobs })}
              </h2>
            </div>

            {jobs.length === 0 ? (
              <EmptyState
                title={t("employer_detail.empty_jobs.title")}
                description={t("employer_detail.empty_jobs.description")}
              />
            ) : (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {jobs.map((job) => (
                  <JobCard2
                    key={job._id}
                    job={job}
                    onClick={() => handleJobClick(job._id)}
                    t={t}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default EmployerDetailPage;
