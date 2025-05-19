"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useJob, useSpecialization, useTag } from "@/contexts/AppContext";
import JobForm from "@/components/organisms/JobForm";

const EditJob = observer(() => {
  const params = useParams();
  const router = useRouter();
  const jobStore = useJob();
  const [loading, setLoading] = useState(true);
  const jobId = params.id as string;

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
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push("/employer/myjobs");
  };

  return (
    <JobForm
      title="Edit Job"
      initialData={jobStore.jobDetail}
      onSuccess={handleSuccess}
      isEditing={true}
    />
  );
});

export default EditJob;
