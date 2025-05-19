import api from "@/utils/axios_catch_error_token";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

export interface ITagKey {
  _id: string;
  name: string;
  children?: ITagValue[];
  description?: string;
}

export interface ITagValue {
  _id: string;
  tagKeyId: string;
  name: string;
  description?: string;
}

class TagStore {
  tagKeys: ITagKey[] | null = null;
  tagValues: ITagValue[] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getTagKeys() {
    try {
      const response = await axiosInstance.get("/api/tags/keys");
      if (response.data) {
        runInAction(() => {
          this.tagKeys = response.data.tagKeys;
        });
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách tag keys:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }

  async getTagValues() {
    try {
      const response = await axiosInstance.get("/api/tags/values");
      if (response.data) {
        runInAction(() => {
          this.tagValues = response.data;
        });
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách tag values:", error);
      if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "object"
      ) {
        return error.response.data;
      }
    }
  }
}

export const tagStore = new TagStore();
