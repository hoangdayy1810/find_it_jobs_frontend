import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

export interface ISpecialization {
  _id: string;
  name: string;
  parentId?: string;
  description?: string;
  children: ISpecialization[];
}

class SpecializationStore {
  specialization: ISpecialization[] | null = null;
  specializationDetail: ISpecialization | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getSpecialization() {
    try {
      const response = await axiosInstance.get("/api/specializations");
      if (response.data) {
        runInAction(() => {
          this.specialization = response.data.specializations;
        });
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách chuyên ngành:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getSpecializationById(id: string) {
    try {
      const response = await axiosInstance.get(`/api/specializations/${id}`);
      if (response.data) {
        runInAction(() => {
          this.specializationDetail = response.data;
        });
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin chi tiết chuyên ngành:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }
}

export const specializationStore = new SpecializationStore();
