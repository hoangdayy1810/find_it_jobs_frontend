"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useTranslations } from "next-intl";
import HideEye from "@/components/atoms/icons/HideEye";
import ShowEye from "@/components/atoms/icons/ShowEye";
import Facebook from "@/components/atoms/icons/Facebook";
import Google from "@/components/atoms/icons/Google";
import { useUser } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import Modal from "@/components/atoms/Modal";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const userStore = useUser();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Define the form schema for validation
  const schema = yup
    .object({
      userName: yup.string().required(t("login.username_required")),
      password: yup.string().required(t("login.password_required")),
      role: yup
        .string()
        .oneOf(["candidate", "employer"])
        .required(t("login.role_required")),
    })
    .required();

  type LoginFormData = yup.InferType<typeof schema>;

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "candidate",
    },
  });

  const signInWithGoogle = async () => {
    setLoading(true);
    const response = await userStore?.loginGoogle(getValues("role"));
    if (response && response.message) {
      if (response.user) {
        setIsOpenModal(true);
        setModalMessage(response.message);
      } else {
        setModalMessage(response.message);
      }
    }
    setLoading(false);
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    const { userName, password, role } = data;
    const response = await userStore?.loginUser(userName, password, role);
    if (response && response.message) {
      if (response.user) {
        setIsOpenModal(true);
        setModalMessage(response.message);
      } else {
        setModalMessage(response.message);
      }
    }
    setLoading(false);
  };

  const handleClose = () => {
    router.push(`/${getValues("role")}/profile`);
    reset();
  };

  return (
    <div className="flex">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{t("login.title")}</h1>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* User role selection */}
              <div className="mb-6">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("login.you_are")}
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    {...register("role")}
                  >
                    <option value="candidate">{t("login.candidate")}</option>
                    <option value="employer">{t("login.employer")}</option>
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
                  {t("login.userName")}
                </label>
                <div className="mt-1">
                  <input
                    id="userName"
                    type="text"
                    autoComplete="username"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("login.userName_placeholder")}
                    {...register("userName")}
                  />
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("login.password")}
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("login.password_placeholder")}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 ${
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

              {/* <div className="flex items-center justify-end">
                                <div className="text-sm">
                                    <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div> */}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? t("login.login_loading") : t("login.login_button")}
              </button>
            </div>
            {modalMessage && (
              <p className="mt-1 text-sm text-red-600">{modalMessage}</p>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-100 text-gray-500">
                  {t("login.or")}
                </span>
              </div>
            </div>

            <div className="mt-2 grid gap-3">
              {/* <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
              >
                <Facebook />
                {t("login.login_facebook")}
              </button> */}

              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
                onClick={signInWithGoogle}
              >
                <Google />
                {t("login.login_google")}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            {t("login.havent_account")}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("login.register_now")}
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

export default LoginPage;
