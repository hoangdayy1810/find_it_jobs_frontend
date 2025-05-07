import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";


export interface IJob {
    _id: string;
    employerId: string;
    title: string;
    description: string;
    location: string;
    salary: { min: number; max: number };
    postedAt: string;
    expiresAt?: string;
    isPremium: boolean;
    views: number;
    tags: { key: string; value: string }[];
    specializationId?: string;
};

class JobStore {
    job: IJob | null = null;

    constructor() {
        makeAutoObservable(this);
    }
}

export const jobStore = new JobStore();    