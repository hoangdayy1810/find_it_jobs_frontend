import React from "react";

const StatisticsSection = ({ t }: { t: any }) => {
  const stats = [
    {
      value: "5,000+",
      label: t("home.stats.jobs"),
    },
    {
      value: "1,200+",
      label: t("home.stats.companies"),
    },
    {
      value: "25,000+",
      label: t("home.stats.candidates"),
    },
    {
      value: "1,500+",
      label: t("home.stats.placements"),
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("home.stats.title")}</h2>
          <p className="text-lg max-w-3xl mx-auto opacity-90">
            {t("home.stats.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-white/10 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
