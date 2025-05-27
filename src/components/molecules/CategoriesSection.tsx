import { SpecializationList } from "@/stores/specializationStore";
import Link from "next/link";
import React from "react";

const CategoriesSection = ({
  specializations = [],
  t,
}: {
  specializations: SpecializationList[];
  t: any;
}) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("home.categories.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("home.categories.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {specializations.slice(0, 10).map((specialization) => (
            <Link
              key={specialization.specialization._id}
              href={`/jobs?specializationId=${specialization.specialization._id}`}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center h-32"
            >
              <div className="text-blue-600 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">
                {specialization.specialization.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {specialization.totalJobs || 0} {t("home.categories.jobs")}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/jobs"
            className="inline-block px-6 py-3 bg-white border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors"
          >
            {t("home.categories.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
