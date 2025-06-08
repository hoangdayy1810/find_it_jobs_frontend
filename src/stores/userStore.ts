import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import nookies from "nookies";
import { auth } from "../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { employerStore } from "./employerStore";
import { candidateStore } from "./candidateStore";

export interface IUser {
  _id: string;
  userName: string;
  role: string;
  googleId?: string;
  isVerified: boolean;
  isBanned: boolean;
}

export interface UpdatedList {
  hoDem?: string;
  ten?: string;
  email?: string;
  gioiTinh?: string;
  ngaySinh?: string;
  sdt?: string;
}

class UserStore {
  user: IUser | null = null;

  constructor() {
    makeAutoObservable(this);
    this.getProfile();
  }

  async loginUser(userName: string, password: string, role: string) {
    const form = {
      userName,
      password,
      role,
    };
    try {
      const response = await axiosInstance.post("/api/account/login", form);
      if (response.data) {
        if (response.data.user) {
          runInAction(() => {
            this.user = response.data.user;
          });
        }

        if (response.data.token) {
          nookies.set(null, "token", response.data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
            sameSite: "strict",
          });
        }
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async loginGoogle(role: string) {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const form = {
        idToken,
        role,
      };
      const response = await axiosInstance.post(
        "/api/account/loginGoogle",
        form
      );
      if (response.data) {
        if (response.data.user) {
          runInAction(() => {
            this.user = response.data.user;
          });
        }

        if (response.data.personalInfo) {
          if (this.user?.role === "candidate") {
            candidateStore.getProfile(response.data.personalInfo);
          }
          if (this.user?.role === "employer") {
            employerStore.getProfile(response.data.personalInfo);
          }
        }

        if (response.data.token) {
          nookies.set(null, "token", response.data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
            sameSite: "strict",
          });
        }
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi đăng nhập bằng Google:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async singinUser(userName: string, password: string, role: string) {
    const form = {
      userName,
      password,
      role,
    };
    try {
      const response = await axiosInstance.post("/api/account/register", form);

      if (response) {
        if (response.data) {
          return response.data;
        }
      }
    } catch (error) {
      console.error("Lỗi đăng kí:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async logout() {
    try {
      nookies.destroy(null, "token", {
        path: "/",
      });

      runInAction(() => {
        this.user = null;
        candidateStore.logout();
        employerStore.logout();
      });

      return true;
    } catch (error) {
      console.log("Lỗi đăng xuất ", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getProfile() {
    try {
      const response = await axiosInstance.get("/api/account/getProfile");

      if (response.data) {
        if (response.data.user) {
          runInAction(() => {
            this.user = response.data.user;
          });
        }
        if (response.data.personalInfo) {
          if (this.user?.role === "candidate") {
            candidateStore.getProfile(response.data.personalInfo);
          }
          if (this.user?.role === "employer") {
            employerStore.getProfile(response.data.personalInfo);
          }
        }
        return response.data;
      }
    } catch (error) {
      // console.error("Lỗi lấy thông tin người dùng: ", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      const response = await api.put("/api/account/changePassword", {
        oldPassword,
        newPassword,
      });

      if (response) {
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi đổi mật khẩu: ", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async updateCandidateProfile(updatedList: UpdatedList) {
    try {
      const response = await api.put(
        "/api/account/updateCandidate",
        updatedList
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi cập nhật thông tin ứng viên: ", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }
  async updateEmployerProfile(updatedList: UpdatedList) {
    try {
      const response = await api.put(
        "/api/account/updateEmployer",
        updatedList
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi cập nhật thông tin nhà tuyển dụng: ", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }
}

export const userStore = new UserStore();
