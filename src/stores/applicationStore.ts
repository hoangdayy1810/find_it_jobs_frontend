import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-hot-toast";
import { IJob } from "./jobStore";
import { ICandidate } from "./candidateStore";

export interface IApplication {
  _id: string;
  jobId: string | IJob;
  candidateId: string | ICandidate;
  status: string;
  appliedAt: string;
  cvFile: string;
  coverLetter?: string;
}

export interface IApplicationFilterOptions {
  schools: string[];
  degrees: string[];
  companies: string[];
  positions: string[];
}

export interface IApplicationPagination {
  totalApplications: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IApplicationQueryParams {
  status?: string;
  school?: string;
  degree?: string;
  company?: string;
  position?: string;
  page?: number;
  limit?: number;
}

class ApplicationStore {
  application: IApplication | null = null;
  applications: IApplication[] = [];
  filterOptions: IApplicationFilterOptions = {
    schools: [],
    degrees: [],
    companies: [],
    positions: [],
  };
  pagination: IApplicationPagination = {
    totalApplications: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  };
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Apply for a job
  async applyForJob(formData: FormData) {
    this.loading = true;
    try {
      const response = await api.post("/api/applications/submit", formData);

      if (response.data.application) {
        runInAction(() => {
          this.application = response.data.application;
          // Add to applications list if needed
          if (this.applications.length > 0) {
            this.applications.push(response.data.application);
          }
        });
        toast.success("Application submitted successfully!", {
          duration: 5000,
        });
        return { success: true, application: response.data.application };
      } else {
        toast.error(response.data.message || "Failed to submit application", {
          duration: 5000,
        });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      let errorMessage = "An error occurred while submitting your application";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage, { duration: 5000 });
      return { success: false, message: errorMessage };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Get candidate applications
  async getCandidateApplications() {
    this.loading = true;
    try {
      const response = await api.get("/api/applications/candidate");

      if (response.data.applications) {
        runInAction(() => {
          this.applications = response.data.applications;
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return { success: false, message: "Failed to fetch applications" };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Get applications by job ID with filtering and pagination
  async getApplicationsByJobId(
    jobId: string,
    query: IApplicationQueryParams = {}
  ) {
    this.loading = true;
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (query.status) queryParams.append("status", query.status);
      if (query.school) queryParams.append("school", query.school);
      if (query.degree) queryParams.append("degree", query.degree);
      if (query.company) queryParams.append("company", query.company);
      if (query.position) queryParams.append("position", query.position);
      if (query.page) queryParams.append("page", query.page.toString());
      if (query.limit) queryParams.append("limit", query.limit.toString());

      const response = await api.get(
        `/api/applications/job/${jobId}?${queryParams.toString()}`
      );

      runInAction(() => {
        if (response.data.applications) {
          this.applications = response.data.applications;
        }

        if (response.data.filterOptions) {
          this.filterOptions = response.data.filterOptions;
        }

        if (response.data.pagination) {
          this.pagination = response.data.pagination;
        }
      });

      return {
        applications: response.data.applications || [],
        filterOptions: response.data.filterOptions || {
          schools: [],
          degrees: [],
          companies: [],
          positions: [],
        },
        pagination: response.data.pagination || {
          totalApplications: 0,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
        },
      };
    } catch (error) {
      console.error("Error fetching applications by job ID:", error);
      let errorMessage = "Failed to fetch applications";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      return {
        applications: [],
        filterOptions: {
          schools: [],
          degrees: [],
          companies: [],
          positions: [],
        },
        pagination: {
          totalApplications: 0,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
        },
      };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Get application by ID
  async getApplicationById(applicationId: string) {
    this.loading = true;
    try {
      const response = await api.get(`/api/applications/${applicationId}`);

      if (response.data.application) {
        runInAction(() => {
          this.application = response.data.application;
        });
        return { application: response.data.application };
      } else {
        toast.error("Application not found");
        return { application: null };
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      let errorMessage = "Failed to fetch application details";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      return { application: null };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Update application status
  async updateApplicationStatus(applicationId: string, status: string) {
    this.loading = true;
    try {
      const response = await api.patch(`/api/applications/${applicationId}`, {
        status,
      });

      if (response.data.application) {
        runInAction(() => {
          // Update application in store if it exists
          this.application = response.data.application;

          // Update in applications list if it exists there
          const index = this.applications.findIndex(
            (app) => app._id === applicationId
          );
          if (index !== -1) {
            this.applications[index] = response.data.application;
          }
        });

        toast.success(`Application status updated to ${status}`);
        return { application: response.data.application };
      } else {
        toast.error(
          response.data.message || "Failed to update application status"
        );
        return { application: null };
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      let errorMessage = "Failed to update application status";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      return { application: null };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const applicationStore = new ApplicationStore();
