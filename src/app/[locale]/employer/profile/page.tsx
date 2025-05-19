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

const EmployerProfile = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const employerStore = useEmployer();

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

  // Define predefined options for select fields
  const companySizeOptions = [
    { value: "1-10", label: "1-10 nhân viên" },
    { value: "11-50", label: "11-50 nhân viên" },
    { value: "51-200", label: "51-200 nhân viên" },
    { value: "201-500", label: "201-500 nhân viên" },
    { value: "500+", label: "Trên 500 nhân viên" },
  ];

  const companyTypeOptions = [
    { value: "Product", label: "Product" },
    { value: "Outsourcing", label: "Outsourcing" },
    { value: "Startup", label: "Startup" },
    { value: "Other", label: "Khác" },
  ];

  const workingDaysOptions = [
    { value: "Monday", label: "Thứ Hai" },
    { value: "Tuesday", label: "Thứ Ba" },
    { value: "Wednesday", label: "Thứ Tư" },
    { value: "Thursday", label: "Thứ Năm" },
    { value: "Friday", label: "Thứ Sáu" },
    { value: "Saturday", label: "Thứ Bảy" },
    { value: "Sunday", label: "Chủ Nhật" },
  ];

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

  // Reset form with employer data when available
  const resetValues = employerStore?.employer
    ? {
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
      }
    : undefined;

  useEffect(() => {
    // Set loading state only once
    if (isLoading) {
      setIsLoading(false);
      reset(resetValues);
    }
  }, [employerStore?.employer, reset, isLoading, resetValues]);

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
                  reset(resetValues);
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
                            render={({
                              field: { onChange, value, ...field },
                            }) => (
                              <input
                                {...field}
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
                        placeholder="Tên công ty của bạn"
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
                      placeholder="Mã số công ty của bạn"
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
                    placeholder="Nhập email của công ty"
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
                    placeholder="Nhập website của công ty"
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
                  return (
                    <Input_Profile
                      icon={<Network />}
                      {...field}
                      text={field.value || "Chưa chọn quy mô công ty"}
                      placeholder="Chọn quy mô công ty"
                      isEdit={isEditing}
                      typeInput="select"
                      options={companySizeOptions}
                      onChange={(e) => {
                        // This handles single select
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
                  return (
                    <Input_Profile
                      icon={<Network />}
                      {...field}
                      text={field.value || "Chưa chọn loại hình công ty"}
                      placeholder="Chọn loại hình công ty"
                      isEdit={isEditing}
                      typeInput="select"
                      options={companyTypeOptions}
                      onChange={(e) => {
                        // This handles single select
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
                  console.log("Current field value in render:", field.value);

                  // Filter out any undefined values and format the working days
                  const formattedWorkingDays = formatWorkingDays(
                    (field.value || []).filter(
                      (day): day is string => day !== undefined
                    )
                  );

                  return (
                    <Input_Profile
                      icon={<Network />}
                      {...field}
                      text={formattedWorkingDays || "Chưa chọn ngày làm việc"}
                      placeholder="Chọn ngày làm việc"
                      isEdit={isEditing}
                      children={
                        isEditing && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {workingDaysOptions.map((option) => {
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
                                    {option.label}
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
                    placeholder="Nhập địa chỉ của công ty"
                    isEdit={isEditing}
                    text={field.value || ""}
                    children={
                      isEditing && (
                        <Input_Address
                          onChange={(value) => {
                            field.onChange(value); // Changed to directly set string value
                            // Force validation after change
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
            title="Giới thiệu công ty"
            content="Giới thiệu về công ty và những gì bạn muốn chia sẻ thêm"
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) =>
                isEditing ? (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Giới thiệu về công ty của bạn"
                  />
                ) : (
                  <div
                    className="rich-content-display prose max-w-full"
                    dangerouslySetInnerHTML={{
                      __html:
                        field.value ||
                        "<p><em>Chưa có thông tin giới thiệu</em></p>",
                    }}
                  />
                )
              }
            />
          </Section_Profile>

          {isEditing && (
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
              >
                Lưu thông tin
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
});

export default EmployerProfile;
