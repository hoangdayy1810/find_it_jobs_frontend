import Link from "next/link";
import React from "react";
import Image from "next/image";

const HeroSection = ({ t }: { t: any }) => {
  return (
    <div className="relative text-gray-700 pt-20 pb-60 px-4 sm:px-6 lg:px-8 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/background.jpeg"
          alt="Hero Background"
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          {t("home.hero.title")}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          {t("home.hero.subtitle")}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
