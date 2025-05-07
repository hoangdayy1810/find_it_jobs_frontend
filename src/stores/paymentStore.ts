import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";


export interface IPayment {
    _id: string;
    employerId: string;
    jobId: string;
    amount: number;
    package: 'basic' | 'premium' | 'top';
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
};

class PaymentStore {
    payment: IPayment | null = null;

    constructor() {
        makeAutoObservable(this);
    }
}

export const paymentStore = new PaymentStore();    