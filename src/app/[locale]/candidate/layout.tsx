"use client";

import Link_NavBar_Profile from "@/components/atoms/Link_NavBar_Profile";
import Title_Profile from "@/components/atoms/Title_Profile";
import React from "react";

const LayoutCandidateProfile = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-80 p-4">
        <div className="sticky top-4 p-6 bg-white shadow-sm rounded-lg">
          <Title_Profile />

          <nav className="space-y-4">
            <Link_NavBar_Profile
              href="/candidate/profile"
              text="Hồ sơ của tôi"
              icon="👤"
            />
            <Link_NavBar_Profile
              href="/candidate/myapplies"
              text="Việc làm của tôi"
              icon="💼"
            />
            <Link_NavBar_Profile
              href="/candidate/setting"
              text="Cài đặt"
              icon="⚙️"
            />
          </nav>
        </div>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default LayoutCandidateProfile;
