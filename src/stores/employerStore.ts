import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

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
  companySize: string[];
  companyType: string[];
  workingDays: string;
}

class EmployerStore {
  employer: IEmployer | null = null;

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
}

export const employerStore = new EmployerStore();
