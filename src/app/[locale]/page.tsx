"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useJob, useSpecialization } from "@/contexts/AppContext";
import { SpecializationList } from "@/stores/specializationStore";
import HeroSection from "@/components/molecules/HeroSection";
import FeaturedJobsSection from "@/components/molecules/FeaturedJobsSection";
import HowItWorksSection from "@/components/molecules/HowItWorksSection";
import CategoriesSection from "@/components/molecules/CategoriesSection";
import StatisticsSection from "@/components/molecules/StatisticsSection";
import CTASection from "@/components/molecules/CTASection";

export default function Home() {
  const t = useTranslations();
  const jobStore = useJob();
  const specializationStore = useSpecialization();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [specializations, setSpecializations] = useState<SpecializationList[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const jobsResult = await jobStore?.getFilteredJobs({ limit: 6 });
      if (jobsResult?.jobs) {
        setFeaturedJobs(jobsResult.jobs);
      }

      // Fetch specializations
      await specializationStore?.getRootSpecializationsWithJobCounts();
      if (specializationStore?.specializationList) {
        setSpecializations(specializationStore?.specializationList);
      }
    };

    fetchData();
  }, [jobStore, specializationStore]);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main>
        {/* Hero Section */}
        <div className="mx-auto">
          <HeroSection t={t} />
        </div>

        {/* Featured Jobs Section */}
        <FeaturedJobsSection jobs={featuredJobs} t={t} />

        {/* Categories/Specializations Section */}
        <CategoriesSection specializations={specializations} t={t} />

        {/* How It Works Section */}
        <HowItWorksSection t={t} />

        {/* Statistics Section */}
        <StatisticsSection t={t} />

        {/* CTA Section */}
        <CTASection t={t} />
      </main>
    </div>
  );
}
