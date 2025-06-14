"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useApplication, useJob } from "@/contexts/AppContext";
import VectorLeftIcon from "@/components/atoms/icons/VectorLeftIcon";
import {
  IApplication,
  IApplicationQueryParams,
} from "@/stores/applicationStore";
import AdvancedPagination from "@/components/molecules/AdvancedPagination";
import ApplicationListItem from "@/components/molecules/ApplicationListItem";
import Select from "@/components/atoms/Select";
import { useTranslations, useLocale } from "next-intl";
import { DEGREE, POSITION } from "@/utils/constant";

const ApplicationList = observer(() => {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const applicationStore = useApplication();
  const jobStore = useJob();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IApplicationQueryParams>({
    status: "",
    school: "",
    degree: "",
    company: "",
    position: "",
    tags: {},
    page: 1,
    limit: 10,
  });
  const [applications, setApplications] = useState<IApplication[]>([]);

  // Fetch job detail and applications
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await jobStore?.getPrivateJobById(jobId);
      const result = await applicationStore?.getApplicationsByJobId(
        jobId,
        filters
      );
      if (result) {
        setApplications(result.applications);
      }
      setLoading(false);
    };

    fetchData();
  }, [jobId, jobStore, applicationStore, filters]);

  // Handle filter change
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      page: 1,
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      status: "",
      school: "",
      degree: "",
      company: "",
      position: "",
      tags: {},
      page: 1,
      limit: 10,
    });
  };

  // Handle page change from pagination
  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
    }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get job title for display
  const jobTitle = jobStore?.jobDetail?.title || "Job";

  return (
    <div className="w-full">
      {/* Header with back button and title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
            aria-label="Back"
          >
            <VectorLeftIcon />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {t("employer.myjobs.applications.title", { jobTitle })}
          </h1>
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">
          {t("employer.myjobs.applications.filter_section")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("employer.myjobs.applications.status")}
            </label>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              options={[
                {
                  value: "",
                  label: t("employer.myjobs.applications.all_statuses"),
                },
                { value: "pending", label: t("application.status.pending") },
                { value: "approved", label: t("application.status.approved") },
                { value: "rejected", label: t("application.status.rejected") },
              ]}
            />
          </div>

          {/* School filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("employer.myjobs.applications.school")}
            </label>
            <Select
              value={filters.school}
              onChange={(e) => handleFilterChange("school", e.target.value)}
              options={[
                {
                  value: "",
                  label: t("employer.myjobs.applications.all_schools"),
                },
                ...(applicationStore?.filterOptions?.schools || []).map(
                  (school) => ({
                    value: school,
                    label: school,
                  })
                ),
              ]}
            />
          </div>

          {/* Degree filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("employer.myjobs.applications.degree")}
            </label>
            <Select
              value={filters.degree}
              onChange={(e) => handleFilterChange("degree", e.target.value)}
              options={[
                {
                  value: "",
                  label: t("employer.myjobs.applications.all_degrees"),
                },
                ...(applicationStore?.filterOptions?.degrees || []).map(
                  (degreeValue) => {
                    const degreeConstant = DEGREE.find(
                      (d) => d.value === degreeValue
                    );
                    return {
                      value: degreeValue,
                      label: degreeConstant
                        ? t(degreeConstant.label)
                        : degreeValue,
                    };
                  }
                ),
              ]}
            />
          </div>

          {/* Company filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("employer.myjobs.applications.company")}
            </label>
            <Select
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
              options={[
                {
                  value: "",
                  label: t("employer.myjobs.applications.all_companies"),
                },
                ...(applicationStore?.filterOptions?.companies || []).map(
                  (company) => ({
                    value: company,
                    label: company,
                  })
                ),
              ]}
            />
          </div>

          {/* Position filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("employer.myjobs.applications.position")}
            </label>
            <Select
              value={filters.position}
              onChange={(e) => handleFilterChange("position", e.target.value)}
              options={[
                {
                  value: "",
                  label: t("employer.myjobs.applications.all_positions"),
                },
                ...(applicationStore?.filterOptions?.positions || []).map(
                  (positionValue) => {
                    const positionConstant = POSITION.find(
                      (p) => p.value === positionValue
                    );
                    return {
                      value: positionValue,
                      label: positionConstant
                        ? t(positionConstant.label)
                        : positionValue,
                    };
                  }
                ),
              ]}
            />
          </div>

          {applicationStore?.filterOptions?.tags &&
            applicationStore.filterOptions.tags.length > 0 &&
            applicationStore.filterOptions.tags.map(
              (tagCategory) =>
                tagCategory?.values.length > 0 && (
                  <div key={tagCategory.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {tagCategory.key}
                    </label>
                    <Select
                      value={
                        (filters.tags && filters.tags[tagCategory.key]) || ""
                      }
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFilters((prev) => ({
                          ...prev,
                          tags: {
                            ...(prev.tags || {}),
                            [tagCategory.key]: newValue,
                          },
                          page: 1,
                        }));
                      }}
                      options={[
                        {
                          value: "",
                          label: t(
                            "employer.myjobs.applications.all_category",
                            {
                              category: tagCategory.key,
                            }
                          ),
                        },
                        ...tagCategory.values.map((value) => ({
                          value,
                          label: value,
                        })),
                      ]}
                    />
                  </div>
                )
            )}
        </div>

        {/* Reset filters button */}
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        >
          {t("employer.myjobs.applications.reset_filters")}
        </button>
      </div>

      {/* Applications list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-lg text-gray-600">
            {t("employer.myjobs.applications.no_applications")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationListItem
              t={t}
              locale={locale}
              key={application._id}
              application={application}
              onClick={() =>
                router.push(
                  `/employer/myjobs/${jobId}/applications/${application._id}`
                )
              }
            />
          ))}

          {/* Pagination */}
          <div className="mt-6">
            <AdvancedPagination
              t={t}
              currentPage={filters.page || 1}
              totalPages={applicationStore?.pagination.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default ApplicationList;
