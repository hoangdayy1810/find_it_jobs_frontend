import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

export interface IPayment {
  _id: string;
  employerId: string | { _id: string; companyName: string };
  jobId: { _id: string; title: string };
  transactionId: string;
  payerId: string;
  amount: number;
  package: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentCreate {
  transactionId: string;
  payerId: string;
  amount: number;
  package: string;
  status: string;
}

class PaymentStore {
  payment: IPayment | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async generationPayment(jobId: string, data: IPaymentCreate) {
    try {
      const response = await api.post("/api/payments/generate", {
        ...data,
        jobId,
      });
      if (response.data) {
        runInAction(() => {
          this.payment = response.data.payment;
        });
      }
    } catch (error) {
      console.error("Lỗi tạo thanh toán:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getPaymentHistory(params: any = {}) {
    try {
      const response = await api.get("/api/payments/history", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching payment history:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
      return { success: false, message: "Failed to fetch payment history" };
    }
  }

  async getPaymentDetails(paymentId: string) {
    try {
      const response = await api.get(`/api/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
      return { success: false, message: "Failed to fetch payment details" };
    }
  }
}

export const paymentStore = new PaymentStore();
