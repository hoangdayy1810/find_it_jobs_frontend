"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import GreenSuccessList from "../atoms/icons/GreenSuccessList";
import PurpleSuccessList from "../atoms/icons/PurpleSuccessList";
import { observer } from "mobx-react-lite";
import { useUser } from "@/contexts/AppContext";

const CTASection = observer(({ t }: { t: any }) => {
  const [hasUser, setHasUser] = useState(false);
  const userStore = useUser();

  useEffect(() => {
    // Check if user is logged in
    if (userStore?.user) {
      setHasUser(true);
    } else {
      setHasUser(false);
    }
  }, [userStore]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gray-50 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left column - For Job Seekers */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("home.cta.candidate.title")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("home.cta.candidate.description")}
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <GreenSuccessList />
                  <span>{t("home.cta.candidate.list1")}</span>
                </div>
                <div className="flex items-center">
                  <GreenSuccessList />
                  <span>{t("home.cta.candidate.list2")}</span>
                </div>
                <div className="flex items-center">
                  <GreenSuccessList />
                  <span>{t("home.cta.candidate.list3")}</span>
                </div>
              </div>
              {!hasUser && (
                <div className="mt-8">
                  <Link
                    href="/register?role=candidate"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t("home.cta.candidate.button")}
                  </Link>
                </div>
              )}
            </div>

            {/* Right column - For Employers */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-purple-50 to-pink-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("home.cta.employer.title")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("home.cta.employer.description")}
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <PurpleSuccessList />
                  <span>{t("home.cta.employer.list1")}</span>
                </div>
                <div className="flex items-center">
                  <PurpleSuccessList />
                  <span>{t("home.cta.employer.list2")}</span>
                </div>
                <div className="flex items-center">
                  <PurpleSuccessList />
                  <span>{t("home.cta.employer.list3")}</span>
                </div>
              </div>
              {!hasUser && (
                <div className="mt-8">
                  <Link
                    href="/register?role=employer"
                    className="inline-block px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {t("home.cta.employer.button")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default CTASection;
