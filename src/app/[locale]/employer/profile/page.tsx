"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Edit from "@/components/atoms/icons/Edit";
import Input_Profile from "@/components/atoms/Input_Profile";
import Email from "@/components/atoms/icons/Email";
import Location from "@/components/atoms/icons/Location";
import Network from "@/components/atoms/icons/Network";
import Section_Profile from "@/components/atoms/Section_Profile";
import { useEmployer } from "@/contexts/AppContext";
import { observer } from "mobx-react-lite";
import RichTextEditor from "@/components/atoms/RichText";
import Input_Address from "@/components/atoms/Input_Address";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatWorkingDays, parseWorkingDays } from "@/utils/formatWorkingDays";
import CalendarIcon from "@/components/atoms/icons/CalendarIcon";
import CompanySizeIcon from "@/components/atoms/icons/CompanySizeIcon";
import JobIcon from "@/components/atoms/icons/JobIcon";
import { COMPANYSIZE, COMPANYTYPE, WORKINGDAYS } from "@/utils/constant";
import { useTranslations } from "next-intl";

const EmployerProfile = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const employerStore = useEmployer();
  const t = useTranslations();

  // Define form validation schema
  const validationSchema = yup.object({
    companyName: yup.string().required("Tên công ty là bắt buộc"),
    companyCode: yup.string().required("Mã công ty là bắt buộc"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    website: yup.string().url("Website không hợp lệ"),
    address: yup.string().required("Địa chỉ là bắt buộc"),
    companySize: yup.string().required("Quy mô công ty là bắt buộc"),
    companyType: yup.string().required("Loại hình công ty là bắt buộc"),
    workingDays: yup.array().of(yup.string()),
    description: yup.string(),
    logo: yup.mixed().nullable(),
  });

  // Initialize useForm
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      companyName: employerStore?.employer?.companyName || "",
      logo: employerStore?.employer?.logo || null,
      companyCode: employerStore?.employer?.companyCode || "",
      email: employerStore?.employer?.email || "",
      website: employerStore?.employer?.website || "",
      address: employerStore?.employer?.address || "",
      companySize: employerStore?.employer?.companySize || "",
      companyType: employerStore?.employer?.companyType || "",
      workingDays: employerStore?.employer?.workingDays
        ? parseWorkingDays(employerStore.employer.workingDays)
        : [],
      description: employerStore?.employer?.description || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    // Always update form values when employer data changes
    if (employerStore?.employer) {
      reset({
        companyName: employerStore.employer.companyName || "",
        companyCode: employerStore.employer.companyCode || "",
        email: employerStore.employer.email || "",
        website: employerStore.employer.website || "",
        address: employerStore.employer.address || "",
        companySize: employerStore.employer.companySize || "",
        companyType: employerStore.employer.companyType || "",
        workingDays: parseWorkingDays(employerStore.employer.workingDays || ""),
        description: employerStore.employer.description || "",
        logo: employerStore.employer.logo || null,
      });
      setIsLoading(false);
    }
  }, [employerStore?.employer, reset]);

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);

    // Create FormData for file uploads
    const formData = new FormData();

    // Append text fields
    formData.append("companyName", data.companyName);
    formData.append("companyCode", data.companyCode);
    formData.append("email", data.email);
    formData.append("website", data.website || "");
    formData.append("address", data.address || "");
    formData.append("companySize", data.companySize || "");
    formData.append("companyType", data.companyType || "");

    if (data.workingDays && data.workingDays.length > 0) {
      // Use formatWorkingDays to convert the array to the human-readable format
      const formattedDays = formatWorkingDays(data.workingDays);
      formData.append("workingDays", formattedDays);
    } else {
      formData.append("workingDays", "");
    }

    // Rich text content
    formData.append("description", data.description || "");

    // Handle logo upload with better error handling
    if (data.logo instanceof FileList && data.logo.length > 0) {
      const logoFile = data.logo[0];
      // Optional: validate file size
      if (logoFile.size > 5 * 1024 * 1024) {
        alert("Logo image should be less than 5MB");
        return; // Stop form submission
      }
      formData.append("logo", logoFile);
    }

    // TODO: Add the updateEmployerProfile method to employerStore
    if (employerStore?.employer) {
      await employerStore.updateEmployerProfile(formData);
    }

    // Exit edit mode
    setIsEditing(false);
  };

  // Add this function within your component
  const getTranslatedWorkingDays = (days: string[]) => {
    // First get the formatted string with the original function
    const formattedDays = formatWorkingDays(days);

    if (!formattedDays) return "";

    // Create a mapping for day name translations
    const dayTranslations: Record<string, string> = {
      "Thứ Hai": t("application.company.workingDays.monday"),
      "Thứ Ba": t("application.company.workingDays.tuesday"),
      "Thứ Tư": t("application.company.workingDays.wednesday"),
      "Thứ Năm": t("application.company.workingDays.thursday"),
      "Thứ Sáu": t("application.company.workingDays.friday"),
      "Thứ Bảy": t("application.company.workingDays.saturday"),
      "Chủ Nhật": t("application.company.workingDays.sunday"),
    };

    // Replace each Vietnamese day name with its translation
    let translatedString = formattedDays;
    for (const [vietDay, translatedDay] of Object.entries(dayTranslations)) {
      translatedString = translatedString.replace(
        new RegExp(vietDay, "g"),
        translatedDay
      );
    }

    return translatedString;
  };

  return (
    <>
      {!isLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Header Card */}
          <div className="bg-white p-6 shadow-sm mb-4 rounded-lg relative">
            <div className="absolute top-4 right-4">
              <button
                className="text-red-500"
                type="button"
                onClick={() => {
                  setIsEditing(!isEditing);
                  reset();
                }}
              >
                <Edit />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="mr-6 mb-4 sm:mb-0">
                <div className="w-56 h-64 overflow-hidden relative group">
                  {/* Add logo upload functionality */}
                  {isEditing ? (
                    <div className="relative group cursor-pointer h-full w-full">
                      <Image
                        src={
                          watch("logo") instanceof FileList && watch("logo")
                            ? URL.createObjectURL(
                                (watch("logo") as FileList)[0]
                              )
                            : employerStore?.employer?.logo ||
                              "/images/avatar_placeholder.png"
                        }
                        alt="Company Logo"
                        fill={true}
                        className="object-contain"
                        priority
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity">
                        <label className="m-auto cursor-pointer bg-white text-blue-500 hover:text-blue-600 px-2 py-1 rounded text-sm font-medium">
                          Thay đổi
                          <Controller
                            name="logo"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                              <input
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                onChange={(e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    onChange(e.target.files);
                                  }
                                }}
                                type="file"
                                accept="image/*"
                                className="hidden"
                              />
                            )}
                          />
                        </label>
                      </div>

                      {isEditing && watch("logo") instanceof FileList && (
                        <div
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            setValue("logo", null);
                          }}
                        >
                          ×
                        </div>
                      )}
                    </div>
                  ) : (
                    <Image
                      src={
                        employerStore?.employer?.logo ||
                        "/images/avatar_placeholder.png"
                      }
                      alt="Company Logo"
                      fill={true}
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  )}
                </div>
              </div>
              <div>
                {/* Make companyName editable */}
                {isEditing ? (
                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full mb-2"
                        placeholder={t(
                          "profile.employer.placeholder.company-name"
                        )}
                      />
                    )}
                  />
                ) : (
                  <h2 className="text-2xl font-bold">
                    {employerStore?.employer?.companyName || "Tên công ty"}
                  </h2>
                )}
                <Controller
                  name="companyCode"
                  control={control}
                  render={({ field }) => (
                    <Input_Profile
                      {...field}
                      text={field.value}
                      placeholder={t(
                        "profile.employer.placeholder.company-code"
                      )}
                      isEdit={isEditing}
                      error={errors.companyCode?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input_Profile
                    icon={<Email />}
                    {...field}
                    text={field.value}
                    placeholder={t("profile.employer.placeholder.email")}
                    isEdit={isEditing}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <Input_Profile
                    icon={<Network />}
                    {...field}
                    text={field.value}
                    placeholder={t("profile.employer.placeholder.website")}
                    isEdit={isEditing}
                    error={errors.website?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Controller
                name="companySize"
                control={control}
                render={({ field }) => {
                  // Get display value for non-edit mode
                  const displayValue = field.value
                    ? t(
                        COMPANYSIZE.find(
                          (option) => option.value === field.value
                        )?.label || "company.size.not-specified"
                      )
                    : t("profile.employer.placeholder.company-size");

                  return (
                    <Input_Profile
                      icon={<CompanySizeIcon />}
                      {...field}
                      text={displayValue}
                      isEdit={isEditing}
                      typeInput="select"
                      options={COMPANYSIZE.map((option) => ({
                        value: option.value,
                        label: t(option.label),
                      }))}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      error={errors.companySize?.message}
                    />
                  );
                }}
              />
              <Controller
                name="companyType"
                control={control}
                render={({ field }) => {
                  // Get display value for non-edit mode
                  const displayValue = field.value
                    ? t(
                        COMPANYTYPE.find(
                          (option) => option.value === field.value
                        )?.label || "company.type.not-specified"
                      )
                    : t("profile.employer.placeholder.company-type");

                  return (
                    <Input_Profile
                      icon={<JobIcon width="18" height="18" />}
                      {...field}
                      text={displayValue}
                      placeholder="Chọn loại hình công ty"
                      isEdit={isEditing}
                      typeInput="select"
                      options={COMPANYTYPE.map((option) => ({
                        value: option.value,
                        label: t(option.label),
                      }))}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      error={errors.companyType?.message}
                    />
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              <Controller
                name="workingDays"
                control={control}
                render={({ field }) => {
                  // Get translated working days display
                  const translatedWorkingDays = getTranslatedWorkingDays(
                    (field.value || []).filter(
                      (day): day is string => day !== undefined
                    )
                  );

                  return (
                    <Input_Profile
                      icon={<CalendarIcon />}
                      {...field}
                      text={
                        translatedWorkingDays ||
                        t("application.company.workingDays.none")
                      }
                      isEdit={isEditing}
                      children={
                        isEditing && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {WORKINGDAYS.map((option) => {
                              const isChecked = field.value?.includes(
                                option.value
                              );

                              return (
                                <label
                                  key={option.value}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const updatedValue = e.target.checked
                                        ? [...(field.value || []), option.value]
                                        : (field.value || []).filter(
                                            (val) => val !== option.value
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm">
                                    {t(option.label)}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )
                      }
                      error={errors.workingDays?.message}
                    />
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input_Profile
                    icon={<Location />}
                    {...field}
                    placeholder={t("profile.employer.placeholder.address")}
                    isEdit={isEditing}
                    text={field.value || ""}
                    children={
                      isEditing && (
                        <Input_Address
                          onChange={(value) => {
                            field.onChange(value);
                            setValue("address", value, {
                              shouldValidate: true,
                            });
                          }}
                          value={field.value || ""}
                        />
                      )
                    }
                    error={errors.address?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* About Section */}
          <Section_Profile
            title={t("profile.employer.about-title")}
            content={t("profile.employer.about-description")}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) =>
                isEditing ? (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("profile.employer.placeholder.description")}
                  />
                ) : (
                  <div
                    className="rich-content-display prose max-w-full"
                    dangerouslySetInnerHTML={{
                      __html:
                        field.value ||
                        `<p><em>${t(
                          "profile.employer.no-description"
                        )}</em></p>`,
                    }}
                  />
                )
              }
            />
          </Section_Profile>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
              >
                {t("profile.employer.save-button")}
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
});

export default EmployerProfile;
