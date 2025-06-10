"use client";

import Link_NavBar_Profile from "@/components/atoms/Link_NavBar_Profile";
import LogoutButton from "@/components/atoms/LogOutButton";
import Modal_YesNo from "@/components/atoms/Modal_YesNo";
import Title_Profile from "@/components/atoms/Title_Profile";
import { useUser } from "@/contexts/AppContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LayoutEmployerProfile = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations();
  const router = useRouter();
  const userStore = useUser();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = async () => {
    const result = await userStore?.logout();
    if (result) router.push("/login");
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-80 p-4">
        <div className="sticky top-4 p-6 bg-white shadow-sm rounded-lg">
          <Title_Profile />

          <nav className="space-y-4">
            <Link_NavBar_Profile
              href="/employer/profile"
              text={t("navigation.employer.info")}
              icon="👤"
            />
            <Link_NavBar_Profile
              href="/employer/myjobs"
              text={t("navigation.employer.jobs")}
              icon="💼"
            />
            <Link_NavBar_Profile
              href="/employer/payments"
              text={t("navigation.employer.payment")}
              icon="💳"
            />
            <Link_NavBar_Profile
              href="/employer/setting"
              text={t("navigation.employer.setting")}
              icon="⚙️"
            />
            <div className="border-t border-gray-200 my-2"></div>

            <LogoutButton
              text={t("navigation.employer.logout")}
              icon="🚪"
              handleClick={() => setShowConfirmModal(true)}
            />
          </nav>
        </div>
      </div>
      <div className="flex-1 p-4">{children}</div>
      <Modal_YesNo
        isOpen={showConfirmModal}
        modalMessage="Bạn có muốn đăng xuất?"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default LayoutEmployerProfile;
