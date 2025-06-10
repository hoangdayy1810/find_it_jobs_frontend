"use client";
import React, { useEffect, useState } from "react";
import { useJob } from "@/contexts/AppContext";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import FilterButton from "@/components/atoms/FilterButton";
import JobCard from "@/components/molecules/JobCard";
import Modal_YesNo from "@/components/atoms/Modal_YesNo";
import { useRouter } from "next/navigation";
import AdvancedPagination from "@/components/molecules/AdvancedPagination";
import { useTranslations } from "next-intl";

// Define filter options
type FilterType = "all" | "active" | "inactive" | "closed";

const EmployerJobs = observer(() => {
  const t = useTranslations();
  const router = useRouter();
  const jobStore = useJob();
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [jobToClose, setJobToClose] = useState<string | null>(null);

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      await jobStore?.getPrivateJobsByEmployer();
      setIsLoading(false);
    };

    fetchJobs();
  }, [jobStore]);

  const getFilteredJobs = () => {
    if (!jobStore?.jobsEmployer) return [];

    const plainArray = toJS(jobStore?.jobsEmployer);

    switch (currentFilter) {
      case "active":
        return plainArray.filter(
          (job) =>
            job.isShow && new Date(job.expiresAt || Date.now()) >= new Date()
        );
      case "inactive":
        return plainArray.filter(
          (job) =>
            !job.isShow &&
            new Date(job.expiresAt || Date.now()) >= new Date() &&
            job.applicationCount === 0
        );
      case "closed":
        return plainArray.filter(
          (job) =>
            !job.isShow &&
            (new Date(job.expiresAt || Date.now()) < new Date() ||
              (job.applicationCount && job.applicationCount > 0))
        );
      default:
        return plainArray;
    }
  };

  const filteredJobs = getFilteredJobs();
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const getStatusDisplay = (job: any) => {
    if (job.isShow && new Date(job.expiresAt || Date.now()) >= new Date())
      return "active";
    else if (
      !job.isShow &&
      new Date(job.expiresAt || Date.now()) >= new Date() &&
      job.applicationCount === 0
    )
      return "inactive";
    else if (
      !job.isShow &&
      (new Date(job.expiresAt || Date.now()) < new Date() ||
        job.applicationCount > 0)
    )
      return "closed";
    else return undefined;
  };

  // Check if current page is out of range after filter change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs =
    filteredJobs.length > 0
      ? filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
      : [];

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle job creation
  const handleCreate = () => {
    router.push("/employer/myjobs/create");
  };

  // Show confirmation modal before closing
  const handleCloseClick = (jobId: string) => {
    setJobToClose(jobId);
    setCloseModalOpen(true);
  };

  // Handle job closing when confirmed
  const confirmClose = async () => {
    if (jobToClose && jobStore) {
      await jobStore.closeJob(jobToClose);
      setCloseModalOpen(false);
      setJobToClose(null);
    }
  };

  // Cancel close
  const cancelClose = () => {
    setCloseModalOpen(false);
    setJobToClose(null);
  };

  // Show confirmation modal before deleting
  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteModalOpen(true);
  };

  // Handle deletion when confirmed
  const confirmDelete = async () => {
    if (jobToDelete && jobStore) {
      await jobStore.deleteJob(jobToDelete);
      setDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  return (
    <div className="md:p-4 pt-0">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={handleCreate}
          className="px-10 py-1 bg-blue-400 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create
        </button>
      </div>

      {/* Filter navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex overflow-x-auto">
          <FilterButton
            label="All"
            isActive={currentFilter === "all"}
            onClick={() => {
              setCurrentFilter("all");
              setCurrentPage(1);
            }}
          />
          <FilterButton
            label="Active"
            isActive={currentFilter === "active"}
            onClick={() => {
              setCurrentFilter("active");
              setCurrentPage(1);
            }}
          />
          <FilterButton
            label="Inactive"
            isActive={currentFilter === "inactive"}
            onClick={() => {
              setCurrentFilter("inactive");
              setCurrentPage(1);
            }}
          />
          <FilterButton
            label="Closed"
            isActive={currentFilter === "closed"}
            onClick={() => {
              setCurrentFilter("closed");
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Job listings */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {currentJobs.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-lg text-gray-600">No jobs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  status={getStatusDisplay(job)}
                  onClick={() => router.push(`/employer/myjobs/${job._id}`)}
                  onClose={() => handleCloseClick(job._id)}
                  onDelete={() => handleDeleteClick(job._id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <AdvancedPagination
              t={t}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal_YesNo
        isOpen={deleteModalOpen}
        modalTitle={t("modal-yes-no.delete-job.title")}
        modalMessage={t("modal-yes-no.delete-job.message")}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        confirmButtonColor="red"
      />

      {/* Close Confirmation Modal */}
      <Modal_YesNo
        isOpen={closeModalOpen}
        modalTitle={t("modal-yes-no.close-job.title")}
        modalMessage={t("modal-yes-no.close-job.message")}
        onClose={cancelClose}
        onConfirm={confirmClose}
        confirmButtonColor="red"
      />
    </div>
  );
});

export default EmployerJobs;
