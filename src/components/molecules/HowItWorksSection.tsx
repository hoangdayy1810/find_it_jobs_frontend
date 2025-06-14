import React from "react";
import SearchIcon from "../atoms/icons/SearchIcon";
import DocumentIcon from "../atoms/icons/DocumentIcon";
import CalendarHome from "../atoms/icons/CalendarHome";
import SuccessCircleIcon from "../atoms/icons/SuccessCircleIcon";

const HowItWorksSection = ({ t }: { t: any }) => {
  const steps = [
    {
      icon: <SearchIcon />,
      title: t("home.howItWorks.step1.title"),
      description: t("home.howItWorks.step1.description"),
    },
    {
      icon: <DocumentIcon />,
      title: t("home.howItWorks.step2.title"),
      description: t("home.howItWorks.step2.description"),
    },
    {
      icon: <CalendarHome />,
      title: t("home.howItWorks.step3.title"),
      description: t("home.howItWorks.step3.description"),
    },
    {
      icon: <SuccessCircleIcon />,
      title: t("home.howItWorks.step4.title"),
      description: t("home.howItWorks.step4.description"),
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("home.howItWorks.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("home.howItWorks.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
