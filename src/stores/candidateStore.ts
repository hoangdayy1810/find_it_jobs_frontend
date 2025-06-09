import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

export interface IExperience {
  company: string;
  position: string;
  duration: string;
}
export interface IEducation {
  school: string;
  degree: string;
  year: string;
}

export interface ICandidate {
  _id: string;
  userId: string;
  avatar: string;
  fullName: string;
  jobTitle: string;
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  skills: { key: string; value: string }[];
  experience: IExperience[];
  education: IEducation[];
  achievement: string;
  other: string;
  savedJobs: string[];
  cvFile: string;
}

class CandidateStore {
  candidate: ICandidate | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getProfile(info: ICandidate) {
    this.candidate = info;
  }

  async updateCandidateProfile(data: any) {
    console.log("data", data);
    try {
      const response = await api.put("/api/account/updateCandidate", data);
      if (response.data && response.data.profileInfo) {
        runInAction(() => {
          this.candidate = response.data.profileInfo as ICandidate;
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin ứng viên:", error);
    }
  }

  async logout() {
    runInAction(() => {
      this.candidate = null;
    });
  }
}

export const candidateStore = new CandidateStore();
