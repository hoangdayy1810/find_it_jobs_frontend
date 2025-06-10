"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useJob } from "@/contexts/AppContext";
import JobForm from "@/components/organisms/JobForm";
import { useTranslations } from "next-intl";

const EditJob = observer(() => {
  const params = useParams();
  const router = useRouter();
  const jobStore = useJob();
  const [loading, setLoading] = useState(true);
  const jobId = params.id as string;
  const t = useTranslations();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch job details
      await jobStore?.getPrivateJobById(jobId);

      setLoading(false);
    };

    fetchData();
  }, [jobId, jobStore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!jobStore?.jobDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">
          {t("employer.myjobs.detail.not_found")}
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("employer.myjobs.detail.go_back")}
        </button>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push("/employer/myjobs");
  };

  return (
    <JobForm
      title={t("employer.myjobs.detail.edit")}
      initialData={jobStore.jobDetail}
      onSuccess={handleSuccess}
      isEditing={true}
      t={t}
    />
  );
});

export default EditJob;
