import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

export interface IPayment {
  _id: string;
  employerId: string;
  jobId: string;
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
}

export const paymentStore = new PaymentStore();
