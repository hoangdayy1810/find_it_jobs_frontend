"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useJob, useSpecialization, useTag } from "@/contexts/AppContext";
import { IJob } from "@/stores/jobStore";
import AdvancedPagination from "@/components/molecules/AdvancedPagination";
import { EXPERIENCE, JOBTYPE, SALARY_RANGE } from "@/utils/constant";
import SpecializationList from "@/components/molecules/SpecializationList";
import FilterSection from "@/components/molecules/FilterSection";
import JobListItem from "@/components/molecules/JobListItem";
import RadioFilterGroup from "@/components/atoms/RadioFilterGroup";
import { useTranslations } from "next-intl";

const JobsPage = observer(() => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobStore = useJob();
  const specializationStore = useSpecialization();
  const tagStore = useTag();

  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 10;

  // Parse filters from URL
  const getInitialFilters = () => {
    const params = new URLSearchParams(searchParams);
    return {
      specializationId: params.get("specializationId") || "",
      location: params.get("location") || "",
      jobType: params.get("jobType") || "",
      salaryRange: params.get("salaryRange") || "",
      experience: params.get("experience") || "",
      tags: Object.fromEntries(
        Array.from(params.entries())
          .filter(
            ([key]) =>
              key &&
              ![
                "specializationId",
                "location",
                "jobType",
                "salaryRange",
                "experience",
                "page",
                "limit",
              ].includes(key)
          )
          .map(([key, value]) => [key, value])
      ),
    };
  };

  const [filters, setFilters] = useState(getInitialFilters());

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    console.log("newFilters", newFilters);
    setFilters(newFilters);
    updateURL(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Update URL with filter parameters
  const updateURL = (currentFilters: any) => {
    const params = new URLSearchParams();

    if (currentFilters.specializationId) {
      params.set("specializationId", currentFilters.specializationId);
    }

    if (currentFilters.location) {
      params.set("location", currentFilters.location);
    }

    if (currentFilters.jobType) {
      params.set("jobType", currentFilters.jobType);
    }

    if (currentFilters.salaryRange) {
      params.set("salaryRange", currentFilters.salaryRange);
    }

    if (currentFilters.experience) {
      params.set("experience", currentFilters.experience);
    }

    // Add tag filters
    if (currentFilters.tags) {
      Object.entries(currentFilters.tags).forEach(([key, value]) => {
        params.set(`${key}`, value as string);
      });
    }

    console.log("params", params.toString());

    router.replace(`/jobs?${params.toString()}`);
  };

  // Fetch jobs based on filters
  const fetchJobs = async (page = 1) => {
    setIsLoading(true);

    // Format the request body according to the required structure
    const queryParams = {
      page,
      limit: jobsPerPage,
      specializationId: filters.specializationId || "",
      location: filters.location || "",
      jobType: filters.jobType || "",
      salaryRange: filters.salaryRange || "",
      experience: filters.experience || "",
      ...Object.fromEntries(
        Object.entries(filters.tags || {}).map(([key, value]) => [key, value])
      ),
    };

    const result = await jobStore?.getFilteredJobs(queryParams);

    if (result) {
      setJobs(result.jobs || []);
      setTotalJobs(result.pagination.totalJobs || 0);
      setTotalPages(result.pagination.totalPages || 1);
    }

    setIsLoading(false);
  };

  // Load specializations and tag filters
  useEffect(() => {
    const loadData = async () => {
      await specializationStore?.getSpecialization();
    };

    loadData();
  }, [specializationStore]);

  // Fetch jobs when filters or page changes
  useEffect(() => {
    fetchJobs(currentPage);
  }, [filters, currentPage]);

  // Re-initialize filters when URL changes
  useEffect(() => {
    setFilters(getInitialFilters());
  }, [searchParams]);

  // Handle page change from pagination
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t("jobs-list.title")}
      </h1>
      <div className="mb-4 text-gray-600">
        {t("jobs-list.count-1")} {totalJobs} {t("jobs-list.count-2")}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Job listings (3/4 width) */}
        <div className="w-full lg:w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {jobs.length === 0 ? (
                <div className="bg-white py-20 rounded-lg shadow-sm text-center">
                  <p className="text-lg text-gray-600">
                    {t("jobs-list.no-jobs-found")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <JobListItem
                      key={job._id}
                      job={job}
                      tagKeysByJobs={tagStore?.tagKeysByJobs || []}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <AdvancedPagination
                    t={t}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Right side - Filters (1/4 width) */}
        <div className="w-full lg:w-1/4">
          {/* Specializations section */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {t("jobs-list.specializations").toUpperCase()}
            </h2>
            <SpecializationList
              specializations={specializationStore?.specialization || []}
              selectedId={filters.specializationId}
              onSelect={(id) => handleFilterChange("specializationId", id)}
            />
          </div>

          {/* Filters section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              {t("jobs-list.filters").toUpperCase()}
            </h2>

            {/* Job Type Filter */}
            <FilterSection title="Job Type">
              <RadioFilterGroup
                name="jobType"
                options={JOBTYPE.map((type) => ({
                  value: type.value,
                  label: t(type.label),
                }))}
                selectedValue={filters.jobType}
                onChange={(value) => handleFilterChange("jobType", value)}
              />
            </FilterSection>

            {/* Experience Filter */}
            <FilterSection title="Experience">
              <RadioFilterGroup
                name="experience"
                options={Object.entries(EXPERIENCE).map(([key, label]) => ({
                  value: key,
                  label: t(label),
                }))}
                selectedValue={filters.experience || ""}
                onChange={(value) => handleFilterChange("experience", value)}
              />
            </FilterSection>

            {/* Salary Range Filter */}
            <FilterSection title="Salary Range">
              <RadioFilterGroup
                name="salaryRange"
                options={SALARY_RANGE.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))}
                selectedValue={filters.salaryRange}
                onChange={(value) => handleFilterChange("salaryRange", value)}
              />
            </FilterSection>

            {/* Tag Filters - Dynamic based on tagKeysByJobs */}
            {tagStore?.tagKeysByJobs &&
              tagStore.tagKeysByJobs.map((tagKey) => (
                <FilterSection key={tagKey.name} title={tagKey.name}>
                  <RadioFilterGroup
                    name={`${tagKey.name}`}
                    options={
                      tagKey.children?.map((child) => ({
                        value: child.name,
                        label: child.name,
                      })) || []
                    }
                    selectedValue={filters.tags?.[tagKey.name] || ""}
                    onChange={(value) => {
                      const newTags = { ...filters.tags, [tagKey.name]: value };
                      handleFilterChange("tags", newTags);
                    }}
                  />
                </FilterSection>
              ))}

            {/* Reset Filters Button */}
            <button
              onClick={() => {
                setFilters(getInitialFilters());
                router.push("/jobs");
              }}
              className="w-full mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
            >
              {t("jobs-list.reset-filters")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default JobsPage;
