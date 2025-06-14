import React from "react";
import Email from "../atoms/icons/Email";
import GlobalIcon from "../atoms/icons/GlobalIcon";
import CalendarIcon from "../atoms/icons/CalendarIcon";
import CompanySizeIcon from "../atoms/icons/CompanySizeIcon";
import JobIcon from "../atoms/icons/JobIcon";
import Location from "@/components/atoms/icons/Location";
import Image from "next/image";
import { IEmployer } from "@/stores/employerStore";

const CompanyInfoCard = ({ employer, t }: { employer: IEmployer; t: any }) => {
  return (
    <div className="bg-white p-6 shadow-sm rounded-lg h-full">
      {/* Company logo and name */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-36 h-36 relative mb-4 overflow-hidden rounded-lg">
          {employer?.logo ? (
            <Image
              src={employer.logo}
              alt={employer.companyName || "Company logo"}
              fill
              className="object-contain"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <JobIcon width="64" height="64" />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-center">
          {employer.companyName}
        </h1>
      </div>

      {/* Company details */}
      <div className="space-y-5">
        {employer?.companyType && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <JobIcon width="18" height="18" />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("employer_detail.company_info.company_type")}
              </p>
              <p className="font-medium">
                {t(
                  `application.company.type.${employer.companyType.toLowerCase()}`,
                  { defaultValue: employer.companyType }
                )}
              </p>
            </div>
          </div>
        )}

        {employer?.address && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <Location />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("employer_detail.company_info.address")}
              </p>
              <p className="font-medium">{employer.address}</p>
            </div>
          </div>
        )}

        {employer?.companySize && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <CompanySizeIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("employer_detail.company_info.company_size")}
              </p>
              <p className="font-medium">
                {t(`application.company.size.${employer.companySize}`, {
                  defaultValue: employer.companySize,
                })}
              </p>
            </div>
          </div>
        )}

        {employer?.workingDays && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <CalendarIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("employer_detail.company_info.working_days")}
              </p>
              <p className="font-medium">{employer.workingDays}</p>
            </div>
          </div>
        )}

        {employer?.website && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <GlobalIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("employer_detail.company_info.website")}
              </p>
              <a
                href={
                  employer.website.startsWith("http")
                    ? employer.website
                    : `https://${employer.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                {employer.website}
              </a>
            </div>
          </div>
        )}

        {employer?.email && (
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-gray-500">
              <Email />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("employer_detail.company_info.email")}
              </p>
              <a
                href={`mailto:${employer.email}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {employer.email}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Company description */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-xl mb-4">
          {t("employer_detail.company_info.about")}
        </h3>
        <div
          className="prose prose-sm md:prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{
            __html:
              employer.description ||
              `<p>${t("employer_detail.company_info.no_description")}</p>`,
          }}
        />
      </div>
    </div>
  );
};

export default CompanyInfoCard;
