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

export interface SpecializationList {
  specialization: ISpecialization;
  totalJobs: number;
}

class SpecializationStore {
  specialization: ISpecialization[] | null = null;
  specializationDetail: ISpecialization | null = null;
  specializationList: SpecializationList[] | null = null;

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

  async getRootSpecializationsWithJobCounts() {
    try {
      const response = await axiosInstance.get(
        "/api/specializations/root-with-counts"
      );
      if (response.data) {
        runInAction(() => {
          this.specializationList = response.data.rootSpecializations;
        });
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách chuyên ngành gốc:", error);
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
