import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { tagStore } from "./tagStore";

export interface IJob {
  _id: string;
  employerId:
    | string
    | {
        _id: string;
        logo: string;
        companyName: string;
        address: string;
        companySize: string;
        companyType: string;
        workingDays: string;
        website: string;
      };
  title: string;
  description: string;
  location: string;
  salary: { min: number; max: number };
  experience: (string | undefined)[];
  jobType: string;
  postedAt: string;
  expiresAt?: string;
  isShow: boolean;
  views: number;
  tags?: { key: string; value: string }[];
  specializationId?: { _id: string; name: string };
  applicationCount?: number;
}

interface IJobSearch {
  _id: string;
  title: string;
  specializationId?: { _id: string; name: string };
  location: string;
  salary: { min: number; max: number };
  experience: (string | undefined)[];
  jobType: string;
}

class JobStore {
  jobs: IJob[] = [];
  jobsEmployer: IJob[] = [];
  jobDetail: IJob | null = null;
  similarJobs: IJob[] = [];
  jobsBySearch: IJobSearch[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async getFilteredJobs(data: any) {
    console.log("data", data);
    try {
      const response = await axiosInstance.get("/api/jobs", {
        params: data,
      });
      if (response.data && response.data.jobs) {
        runInAction(() => {
          this.jobs = response.data.jobs;
        });
        if (response.data.tags) {
          tagStore.getTagKeysByJobs(response.data.tags);
        }
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách công việc:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getJobsBySearch(data: { q: string }) {
    try {
      const response = await axiosInstance.get("/api/jobs/search", {
        params: data,
      });
      if (response.data && response.data.jobs) {
        runInAction(() => {
          this.jobsBySearch = response.data.jobs;
        });

        if (response.data.tagValues) {
          tagStore.getTagValuesBySearch(response.data.tagValues);
        }
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm công việc:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getPrivateJobsByEmployer() {
    try {
      const response = await api.get("/api/jobs/myjobs");
      if (response.data && response.data.jobs) {
        runInAction(() => {
          this.jobsEmployer = response.data.jobs;
        });
        return response.data;
      }
    } catch (error) {
      console.error(
        "Lỗi lấy danh sách cá nhân công việc của nhà tuyển dụng:",
        error
      );
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getPublicJobsByEmployer(employerId: string) {
    try {
      const response = await axiosInstance.get(
        `/api/jobs/employer/${employerId}`
      );
      if (response.data && response.data.jobs) {
        runInAction(() => {
          this.jobsEmployer = response.data.jobs;
        });
        return response.data;
      }
    } catch (error) {
      console.error(
        "Lỗi lấy danh sách cá nhân công việc của nhà tuyển dụng:",
        error
      );
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getPublicJobById(jobId: string) {
    try {
      const response = await axiosInstance.get(`/api/jobs/public/${jobId}`);
      if (response.data) {
        runInAction(() => {
          this.jobDetail = response.data.job;
          this.similarJobs = response.data.similarJobs;
        });
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin chi tiết công việc:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getPrivateJobById(jobId: string) {
    try {
      const response = await api.get(`/api/jobs/private/${jobId}`);
      if (response.data) {
        runInAction(() => {
          this.jobDetail = response.data.job;
        });
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin chi tiết công việc:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async createJob(job: IJob) {
    try {
      const response = await api.post("/api/jobs/create", job);
      if (response.data) {
        runInAction(() => {
          this.jobDetail = response.data.job;
        });
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi tạo công việc:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async updateJob(id: string, job: IJob) {
    try {
      const response = await api.put(`/api/jobs/${id}`, job);
      if (response.data) {
        runInAction(() => {
          this.jobDetail = response.data.job;
          this.jobsEmployer = this.jobsEmployer.map((jobItem) => {
            if (jobItem._id === id) {
              return { ...jobItem, ...response.data.job };
            }
            return jobItem;
          });
        });
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi cập nhật công việc:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async deleteJob(jobId: string) {
    try {
      const response = await api.delete(`/api/jobs/${jobId}`);
      if (response.data) {
        runInAction(() => {
          this.jobsEmployer = this.jobsEmployer.filter(
            (job) => job._id !== jobId
          );
        });
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi xóa công việc:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async closeJob(id: string) {
    try {
      const response = await api.patch(`/api/jobs/close/${id}`);
      if (response.data) {
        runInAction(() => {
          this.jobsEmployer = this.jobsEmployer.map((job) => {
            if (job._id === id) return { ...job, isShow: false };
            return job;
          });
        });
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi đóng công việc:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }
}

export const jobStore = new JobStore();
