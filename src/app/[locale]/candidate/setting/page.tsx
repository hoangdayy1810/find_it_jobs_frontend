"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUser } from "@/contexts/AppContext";
import { observer } from "mobx-react-lite";
import Modal from "@/components/atoms/Modal";
import PasswordInput from "@/components/atoms/PasswordInput";

const Setting = observer(() => {
  const userStore = useUser();
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form validation schema
  const schema = yup.object({
    oldPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
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

      if (response?.success) {
        setSuccess(true);
        setModalMessage("Password changed successfully!");
        setIsModalOpen(true);
        reset();
      } else {
        setSuccess(false);
        setModalMessage(
          response?.message || "Failed to change password. Please try again."
        );
        setIsModalOpen(true);
      }
    } catch (error) {
      setSuccess(false);
      setModalMessage("An error occurred. Please try again later.");
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
          Account Settings
        </h1>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Change Password
          </h2>

          {isGoogleAccount ? (
            <div className="bg-blue-50 p-4 rounded-md text-blue-700 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    You're logged in with Google, so you can't change your
                    password here. To manage your Google account password,
                    please visit your Google account settings.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <PasswordInput
                id="oldPassword"
                label="Current Password"
                register={register}
                errors={errors}
                showPassword={showOldPassword}
                toggleVisibility={() => setShowOldPassword(!showOldPassword)}
                placeholder="Enter your current password"
              />

              <PasswordInput
                id="newPassword"
                label="New Password"
                register={register}
                errors={errors}
                showPassword={showNewPassword}
                toggleVisibility={() => setShowNewPassword(!showNewPassword)}
                placeholder="Enter your new password"
              />

              <PasswordInput
                id="confirmPassword"
                label="Confirm New Password"
                register={register}
                errors={errors}
                showPassword={showConfirmPassword}
                toggleVisibility={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                placeholder="Confirm your new password"
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
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal for success/error messages */}
        <Modal
          isOpen={isModalOpen}
          modalMessage={modalMessage}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
});

export default Setting;
