import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";


export interface IApplication {
    _id: string;
    jobId: string;
    candidateId: string;
    status: string;
    appliedAt: boolean;
    cvFile: string;
};

class ApplicationStore {
    application: IApplication | null = null;

    constructor() {
        makeAutoObservable(this);
    }
}

export const applicationStore = new ApplicationStore();    