"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useApplication } from "@/contexts/AppContext";
import AdvancedPagination from "@/components/molecules/AdvancedPagination";
import { IApplication } from "@/stores/applicationStore";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/atoms/EmptyState";
import LoadingState from "@/components/atoms/LoadingState";
import StatusFilterButton from "@/components/atoms/StatusFilter";
import ApplicationCard from "@/components/molecules/ApplicationCard";

const MyApplicationList = observer(() => {
  const t = useTranslations();
  const router = useRouter();
  const applicationStore = useApplication();

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
  }, [applicationStore, currentFilter]);

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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {t("myapplies.title")}
      </h1>

      {/* Status filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <StatusFilterButton
            label={t("myapplies.filters.all")}
            isActive={currentFilter === "all"}
            onClick={() => handleFilterChange("all")}
          />
          <StatusFilterButton
            label={t("myapplies.filters.pending")}
            isActive={currentFilter === "pending"}
            onClick={() => handleFilterChange("pending")}
          />
          <StatusFilterButton
            label={t("myapplies.filters.approved")}
            isActive={currentFilter === "approved"}
            onClick={() => handleFilterChange("approved")}
          />
          <StatusFilterButton
            label={t("myapplies.filters.rejected")}
            isActive={currentFilter === "rejected"}
            onClick={() => handleFilterChange("rejected")}
          />
        </div>
      </div>

      {/* Applications list */}
      {loading ? (
        <LoadingState />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title={t("myapplies.empty.title")}
          description={t("myapplies.empty.description")}
        />
      ) : (
        <div className="space-y-4">
          {getCurrentApplications().map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onClick={() => handleApplicationClick(application._id)}
              t={t}
            />
          ))}

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
        </div>
      )}
    </div>
  );
});

export default MyApplicationList;
