import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";


export interface ISpecialization {
    _id: string;
    name: string;
    parentId?: string;
    description?: string;
    createdAt: string;
};

class SpecializationStore {
    specialization: ISpecialization | null = null;

    constructor() {
        makeAutoObservable(this);
    }
}

export const specializationStore = new SpecializationStore();    