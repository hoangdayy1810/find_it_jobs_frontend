import React from "react";
import CompanyLogoIcon from "@/components/atoms/icons/CompanyLogoIcon";
import Image from "next/image";

const CompanyLogo = ({ logo, name }: { logo?: string; name: string }) => (
  <div className="w-16 h-16 relative flex-shrink-0 rounded overflow-hidden bg-gray-100">
    {logo ? (
      <Image
        src={logo}
        alt={`${name} logo`}
        fill
        className="object-contain"
        unoptimized
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <CompanyLogoIcon />
      </div>
    )}
  </div>
);

export default CompanyLogo;
