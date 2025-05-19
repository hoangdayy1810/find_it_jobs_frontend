"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import JobForm from "@/components/organisms/JobForm";

const CreateJob = observer(() => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSuccess = () => {
    // Redirect to jobs list after successful creation
    router.push("/employer/myjobs");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 px-4">
      <JobForm
        title="Create New Job"
        onSuccess={handleSuccess}
        isEditing={false}
      />
    </div>
  );
});

export default CreateJob;
