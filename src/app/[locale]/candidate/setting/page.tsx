"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUser } from "@/contexts/AppContext";
import { observer } from "mobx-react-lite";
import Modal from "@/components/atoms/Modal";
import PasswordInput from "@/components/atoms/PasswordInput";
import { useTranslations } from "next-intl";
import LoadingIcon from "@/components/atoms/icons/LoadingIcon";
import InfoIcon from "@/components/atoms/icons/InfoIcon";

const Setting = observer(() => {
  const t = useTranslations();
  const userStore = useUser();
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form validation schema with translations
  const schema = yup.object({
    oldPassword: yup.string().required(t("settings.password.current_required")),
    newPassword: yup
      .string()
      .required(t("settings.password.new_required"))
      .min(8, t("settings.password.new_min"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        t("settings.password.new_format")
      )
      .test(
        "not-same-as-old",
        t("settings.password.new_different"),
        function (value) {
          // Check that the new password is different from the old password
          const { oldPassword } = this.parent;
          return value !== oldPassword;
        }
      ),
    confirmPassword: yup
      .string()
      .required(t("settings.password.confirm_required"))
      .oneOf([yup.ref("newPassword")], t("settings.password.confirm_match")),
  });

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Check if user logged in with Google
  useEffect(() => {
    if (userStore?.user) {
      setIsGoogleAccount(!!userStore.user.googleId);
    }
  }, [userStore?.user]);

  // Form submission handler
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await userStore?.changePassword(
        data.oldPassword,
        data.newPassword
      );

      if (response?.isSuccess) {
        setSuccess(true);
        setModalMessage(t("settings.password.success"));
        setIsModalOpen(true);
        reset();
      } else {
        setSuccess(false);
        setModalMessage(response?.message || t("settings.password.error"));
        setIsModalOpen(true);
      }
    } catch {
      setSuccess(false);
      setModalMessage(t("settings.password.system_error"));
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t("settings.title")}
        </h1>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t("settings.password.title")}
          </h2>

          {isGoogleAccount ? (
            <div className="bg-blue-50 p-4 rounded-md text-blue-700 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InfoIcon />
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    {t("settings.google_account.message")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <PasswordInput
                id="oldPassword"
                label={t("settings.password.current")}
                register={register}
                errors={errors}
                showPassword={showOldPassword}
                toggleVisibility={() => setShowOldPassword(!showOldPassword)}
                placeholder={t("settings.password.current")}
              />

              <PasswordInput
                id="newPassword"
                label={t("settings.password.new")}
                register={register}
                errors={errors}
                showPassword={showNewPassword}
                toggleVisibility={() => setShowNewPassword(!showNewPassword)}
                placeholder={t("settings.password.new")}
              />

              <PasswordInput
                id="confirmPassword"
                label={t("settings.password.confirm")}
                register={register}
                errors={errors}
                showPassword={showConfirmPassword}
                toggleVisibility={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                placeholder={t("settings.password.confirm")}
              />

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <LoadingIcon />
                      {t("settings.password.processing")}
                    </>
                  ) : (
                    t("settings.password.button")
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal for success/error messages */}
        <Modal
          type={success ? "success" : "error"}
          isOpen={isModalOpen}
          modalMessage={modalMessage}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
});

export default Setting;
