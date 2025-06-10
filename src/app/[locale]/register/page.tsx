"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useTranslations } from "next-intl";
import HideEye from "@/components/atoms/icons/HideEye";
import ShowEye from "@/components/atoms/icons/ShowEye";
import { useUser } from "@/contexts/AppContext";
import Modal from "@/components/atoms/Modal";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const userStore = useUser();

  // Define the form schema for validation
  const schema = yup
    .object({
      userName: yup
        .string()
        .required(t("register.username_required"))
        .min(8, t("register.username_length", { count: 8 }))
        .max(50, t("register.username_length", { count: 50 }))
        .matches(/^[a-zA-Z0-9]+$/, t("register.username_alphanumeric")),
      password: yup
        .string()
        .required(t("register.password_required"))
        .min(8, t("register.password_length", { count: 8 }))
        .max(50, t("register.password_length", { count: 50 }))
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          t("register.password_requirements")
        ),
      confirmPassword: yup
        .string()
        .required(t("register.password_confirm_required"))
        .oneOf([yup.ref("password")], t("register.match_password")),
      role: yup
        .string()
        .oneOf(["candidate", "employer"])
        .required(t("register.role_required")),
    })
    .required();

  type RegisterFormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "candidate",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    const { userName, password, role } = data;
    const response = await userStore?.singinUser(userName, password, role);
    if (response && response.message) {
      if (response.isSuccess) {
        setIsOpenModal(true);
        setModalMessage(response.message);
      } else {
        setModalMessage(response.message);
      }
    }
    setLoading(false);
  };

  const handleClose = () => {
    router.push("/login");
    reset();
  };

  return (
    <div className="flex">
      {/* Left side - Register form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{t("register.title")}</h1>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* User role selection */}
              <div className="mb-6">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("register.you_are")}
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    {...register("role")}
                  >
                    <option value="candidate">{t("register.candidate")}</option>
                    <option value="employer">{t("register.employer")}</option>
                  </select>

                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Username field */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("register.userName")}
                </label>
                <div className="mt-1">
                  <input
                    id="userName"
                    type="text"
                    autoComplete="username"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("register.userName_placeholder")}
                    {...register("userName")}
                  />
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.userName.message}
                    </p>
                  )}
                  {modalMessage && (
                    <p className="mt-1 text-sm text-red-600">{modalMessage}</p>
                  )}
                </div>
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("register.password")}
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("register.password_placeholder")}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-4 ${
                      errors?.password?.message ? "pb-6" : ""
                    }  flex items-center`}
                  >
                    {showPassword ? <HideEye /> : <ShowEye />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm password field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("register.password_confirm")}
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("register.password_confirm_placeholder")}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 right-0 pr-4 ${
                      errors?.confirmPassword?.message ? "pb-6" : ""
                    }  flex items-center`}
                  >
                    {showConfirmPassword ? <HideEye /> : <ShowEye />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading
                  ? t("register.register_loading")
                  : t("register.register_button")}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600">
            {t("register.already_have_account")}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("register.login_now")}
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 bg-blue-50">
        <div className="h-[660px] w-full flex items-center justify-center">
          <img
            src="/images/login_illustration.jpg"
            alt="Login illustration"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
      <Modal
        type="success"
        isOpen={isOpenModal}
        modalMessage={modalMessage}
        onClose={handleClose}
      />
    </div>
  );
};

export default RegisterPage;
