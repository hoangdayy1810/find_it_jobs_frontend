"use client";

import Link_NavBar_Profile from "@/components/atoms/Link_NavBar_Profile";
import LogoutButton from "@/components/atoms/LogOutButton";
import Modal_YesNo from "@/components/atoms/Modal_YesNo";
import Title_Profile from "@/components/atoms/Title_Profile";
import { useUser } from "@/contexts/AppContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LayoutCandidateProfile = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
              href="/candidate/profile"
              text={t("navigation.candidate.profile")}
              icon="👤"
            />
            <Link_NavBar_Profile
              href="/candidate/myapplies"
              text={t("navigation.candidate.my_jobs")}
              icon="💼"
            />
            <Link_NavBar_Profile
              href="/candidate/setting"
              text={t("navigation.candidate.settings")}
              icon="⚙️"
            />
            <div className="border-t border-gray-200 my-2"></div>
            <LogoutButton
              text={t("navigation.candidate.logout")}
              icon="🚪"
              handleClick={() => setShowConfirmModal(true)}
            />
          </nav>
        </div>
      </div>
      <div className="flex-1 p-4">{children}</div>
      <Modal_YesNo
        t={t}
        isOpen={showConfirmModal}
        modalTitle={t("modal-yes-no.logout.title")}
        modalMessage={t("modal-yes-no.logout.message")}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleLogout}
        confirmButtonColor="blue"
      />
    </div>
  );
};

export default LayoutCandidateProfile;
