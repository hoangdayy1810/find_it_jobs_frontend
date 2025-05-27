"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import JobLogoIcon from "../atoms/icons/JobLogoIcon";

const FeaturedJobsSection = ({ jobs = [], t }: { jobs: any[]; t: any }) => {
  const router = useRouter();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("home.featuredJobs.title")}
          </h2>
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {t("home.featuredJobs.viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => router.push(`/jobs/${job._id}`)}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 relative flex-shrink-0 mr-4 bg-gray-100 rounded overflow-hidden">
                  {job.employerId?.logo ? (
                    <Image
                      src={job.employerId.logo}
                      alt={job.employerId.companyName}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <JobLogoIcon />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {job.employerId?.companyName || "Company"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">💰</span>
                  <span>
                    {job.salary?.min?.toLocaleString()} -{" "}
                    {job.salary?.max?.toLocaleString()} {t("all.VND")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">📍</span>
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">⏱️</span>
                  <span>{job.jobType}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags?.slice(0, 3).map((tag: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {tag.value}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">{t("home.featuredJobs.noJobs")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
