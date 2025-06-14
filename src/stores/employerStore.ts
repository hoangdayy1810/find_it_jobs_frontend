import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { IJob } from "./jobStore";

export interface IEmployer {
  _id: string;
  userId: string;
  logo: string;
  companyName: string;
  companyCode: string;
  description: string;
  email: string;
  website: string;
  address: string;
  companySize: string;
  companyType: string;
  workingDays: string;
}

export interface IEmployerWithJobs {
  employer: IEmployer;
  jobs: IJob[];
  totalJobs: number;
}

class EmployerStore {
  employer: IEmployer | null = null;
  employerJobs: IJob[] = [];
  totalJobs: number = 0;
  currentEmployer: IEmployer | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getProfile(info: IEmployer) {
    this.employer = info;
  }

  async updateEmployerProfile(data: any) {
    try {
      const response = await api.put("/api/account/updateEmployer", data);
      if (response.data && response.data.profileInfo) {
        runInAction(() => {
          this.employer = response.data.profileInfo as IEmployer;
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin nhà tuyển dụng:", error);
    }
  }

  async getEmployerDetailsWithJobs(employerId: string) {
    try {
      const response = await axiosInstance.get(
        `/api/jobs/employer/${employerId}`
      );

      if (response.data) {
        runInAction(() => {
          this.currentEmployer = response.data.employer;
          this.employerJobs = response.data.jobs;
          this.totalJobs = response.data.totalJobs;
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching employer details:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
      return { success: false, message: "Failed to load employer details" };
    }
  }

  async logout() {
    runInAction(() => {
      this.employer = null;
    });
  }
}

export const employerStore = new EmployerStore();
