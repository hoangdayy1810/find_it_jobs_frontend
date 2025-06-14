"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import JobForm from "@/components/organisms/JobForm";
import { useTranslations } from "next-intl";

const CreateJob = observer(() => {
  const router = useRouter();
  const t = useTranslations(); // Add translation hook
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
        <span className="ml-3 text-gray-600">
          {t("employer.myjobs.loading")}
        </span>
      </div>
    );
  }

  return (
    <JobForm
      title={t("employer.myjobs.create.title")}
      onSuccess={handleSuccess}
      isEditing={false}
      t={t}
    />
  );
});

export default CreateJob;
