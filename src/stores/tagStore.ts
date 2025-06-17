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

export interface ITagBySearch {
  _id: string;
  name: string;
  keyId: string;
  keyName: string;
}

class TagStore {
  tagKeys: ITagKey[] | null = null;
  tagKeysByJobs: ITagKey[] | null = null;
  tagValuesBySearch: ITagBySearch[] | null = null;
  currentProvine: string = "hanoi";

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

  getTagKeysByJobs(data: any) {
    runInAction(() => {
      this.tagKeysByJobs = data;
    });
  }

  getTagValuesBySearch(data: any) {
    runInAction(() => {
      this.tagValuesBySearch = data;
    });
  }

  postCurrentProvine(currentProvine: string) {
    runInAction(() => {
      this.currentProvine = currentProvine;
    });
    return this.currentProvine;
  }
}

export const tagStore = new TagStore();
