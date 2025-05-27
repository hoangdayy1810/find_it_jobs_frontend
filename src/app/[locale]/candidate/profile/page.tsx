"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Edit from "@/components/atoms/icons/Edit";
import Input_Profile from "@/components/atoms/Input_Profile";
import Email from "@/components/atoms/icons/Email";
import Phone from "@/components/atoms/icons/Phone";
import DateIcon from "@/components/atoms/icons/Date";
import Gender from "@/components/atoms/icons/Gender";
import Location from "@/components/atoms/icons/Location";
import Network from "@/components/atoms/icons/Network";
import Section_Profile from "@/components/atoms/Section_Profile";
import { useCandidate } from "@/contexts/AppContext";
import { observer } from "mobx-react-lite";
import RichTextEditor from "@/components/atoms/RichText";
import Input_Address from "@/components/atoms/Input_Address";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatDate } from "@/utils/fommat_date";
import { getCleanFileName } from "@/utils/getCleanFilename";
import DownloadIcon from "@/components/atoms/icons/DownloadIcon";

const CandidateProfile = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const candidateStore = useCandidate();

  // Define form validation schema
  const validationSchema = yup.object({
    fullName: yup.string().required("Họ và tên là bắt buộc"),
    jobTitle: yup.string().required("Chức danh là bắt buộc"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    phone: yup
      .string()
      .matches(/^[0-9]{6,15}$/, "Số điện thoại phải từ 6-15 chữ số")
      .required("Số điện thoại là bắt buộc"),
    dateOfBirth: yup
      .date()
      .required("Ngày sinh là bắt buộc")
      .max(new Date(), "Ngày sinh không thể là ngày trong tương lai"),
    gender: yup.string().required("Giới tính là bắt buộc"),
    address: yup.string().required("Địa chỉ là bắt buộc"),
    avatar: yup.mixed(),
    cvFile: yup.mixed().optional().nullable(),
    education: yup.array().of(
      yup.object().shape({
        school: yup.string().required("Tên trường là bắt buộc"),
        degree: yup.string().required("Bằng cấp là bắt buộc"),
        year: yup.string().required("Năm tốt nghiệp là bắt buộc"),
      })
    ),
    experience: yup.array().of(
      yup.object().shape({
        company: yup.string().required("Tên công ty là bắt buộc"),
        position: yup.string().required("Vị trí là bắt buộc"),
        duration: yup.string().required("Thời gian làm việc là bắt buộc"),
      })
    ),
    other: yup.string(),
    skills: yup.string(),
    achievement: yup.string(),
  });

  // Define predefined options for select fields
  const degreeOptions = [
    { value: "high_school", label: "Trung học phổ thông" },
    { value: "associate", label: "Cao đẳng" },
    { value: "bachelor", label: "Cử nhân" },
    { value: "master", label: "Thạc sĩ" },
    { value: "phd", label: "Tiến sĩ" },
  ];

  const yearOptions = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const positionOptions = [
    { value: "intern", label: "Thực tập sinh" },
    { value: "fresher", label: "Fresher" },
    { value: "junior", label: "Junior" },
    { value: "middle", label: "Middle" },
    { value: "senior", label: "Senior" },
    { value: "team_lead", label: "Team Lead" },
    { value: "manager", label: "Manager" },
  ];

  const durationOptions = [
    { value: "less_than_1", label: "Dưới 1 năm" },
    { value: "1_3", label: "1-3 năm" },
    { value: "3_5", label: "3-5 năm" },
    { value: "more_than_5", label: "Trên 5 năm" },
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
      fullName: candidateStore?.candidate?.fullName || "",
      avatar: candidateStore?.candidate?.avatar || null,
      jobTitle: candidateStore?.candidate?.jobTitle || "",
      email: candidateStore?.candidate?.email || "",
      phone: candidateStore?.candidate?.phone || "",
      dateOfBirth: candidateStore?.candidate?.dateOfBirth || new Date(),
      gender: candidateStore?.candidate?.gender || "",
      address: candidateStore?.candidate?.address || "",
      cvFile: candidateStore?.candidate?.cvFile || null,
      education: candidateStore?.candidate?.education || [],
      experience: candidateStore?.candidate?.experience || [],
      other: candidateStore?.candidate?.other || "",
      skills: candidateStore?.candidate?.skills || "",
      achievement: candidateStore?.candidate?.achievement || "",
    },
  });

  // Initialize useFieldArray for education
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  // Initialize useFieldArray for experience
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  // Replace your existing functions with these simpler versions
  const addEducation = () => {
    appendEducation({ school: "", degree: "", year: "" });
  };

  const addExperience = () => {
    appendExperience({ company: "", position: "", duration: "" });
  };

  // Reset form with candidate data when available
  const resetValues = candidateStore?.candidate
    ? {
        fullName: candidateStore.candidate.fullName || "",
        jobTitle: candidateStore.candidate.jobTitle || "",
        email: candidateStore.candidate.email || "",
        phone: candidateStore.candidate.phone || "",
        dateOfBirth: candidateStore.candidate.dateOfBirth
          ? new Date(candidateStore.candidate.dateOfBirth)
          : undefined,
        gender: candidateStore.candidate.gender || "",
        address: candidateStore.candidate.address || "",
        avatar: candidateStore.candidate.avatar || null,
        cvFile: candidateStore.candidate.cvFile || null,
        education: candidateStore.candidate.education?.length
          ? candidateStore.candidate.education
          : [],
        experience: candidateStore.candidate.experience?.length
          ? candidateStore.candidate.experience
          : [],
        other: candidateStore.candidate.other || "",
        skills: candidateStore.candidate.skills || "",
        achievement: candidateStore.candidate.achievement || "",
      }
    : undefined;

  useEffect(() => {
    // Set loading state only once
    if (isLoading) {
      setIsLoading(false);
      reset(resetValues);
    }
  }, [candidateStore?.candidate, reset]);

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);

    // Create FormData for file uploads
    const formData = new FormData();

    // Append text fields
    formData.append("fullName", data.fullName);
    formData.append("jobTitle", data.jobTitle);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    // Format date as string
    if (data.dateOfBirth) {
      formData.append(
        "dateOfBirth",
        data.dateOfBirth.toISOString().split("T")[0]
      );
    }

    formData.append("gender", data.gender);
    formData.append("address", data.address);

    // Handle array data
    if (data.education && data.education.length > 0) {
      formData.append("education", JSON.stringify(data.education));
    }

    if (data.experience && data.experience.length > 0) {
      formData.append("experience", JSON.stringify(data.experience));
    }

    // Rich text content
    formData.append("other", data.other || "");
    formData.append("skills", data.skills || "");
    formData.append("achievement", data.achievement || "");

    // Handle avatar upload with better error handling
    if (data.avatar instanceof FileList && data.avatar.length > 0) {
      const avatarFile = data.avatar[0];
      // Optional: validate file size
      if (avatarFile.size > 5 * 1024 * 1024) {
        alert("Avatar image should be less than 5MB");
        return; // Stop form submission
      }
      formData.append("avatar", avatarFile);
    }

    // Handle file uploads
    if (data.cvFile instanceof FileList && data.cvFile.length > 0) {
      formData.append("cvFile", data.cvFile[0]);
    }

    // Send FormData through candidateStore
    if (candidateStore?.candidate) {
      await candidateStore.updateCandidateProfile(formData);
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
                  {/* Add avatar upload functionality */}
                  {isEditing ? (
                    <div className="relative group cursor-pointer h-full w-full">
                      <Image
                        src={
                          watch("avatar") instanceof FileList
                            ? URL.createObjectURL(watch("avatar")[0])
                            : candidateStore?.candidate?.avatar ||
                              "/images/avatar_placeholder.png"
                        }
                        alt="Profile"
                        fill={true}
                        className="object-contain"
                        priority
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity">
                        <label className="m-auto cursor-pointer bg-white text-blue-500 hover:text-blue-600 px-2 py-1 rounded text-sm font-medium">
                          Thay đổi
                          <Controller
                            name="avatar"
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

                      {isEditing && watch("avatar") instanceof FileList && (
                        <div
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            setValue("avatar", null);
                          }}
                        >
                          ×
                        </div>
                      )}
                    </div>
                  ) : (
                    <Image
                      src={
                        candidateStore?.candidate?.avatar ||
                        "/images/avatar_placeholder.png"
                      }
                      alt="Profile"
                      fill={true}
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  )}
                </div>
              </div>
              <div>
                {/* Make fullName editable */}
                {isEditing ? (
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full mb-2"
                        placeholder="Họ và tên của bạn"
                      />
                    )}
                  />
                ) : (
                  <h2 className="text-2xl font-bold">
                    {candidateStore?.candidate?.fullName || "Họ và tên của bạn"}
                  </h2>
                )}
                <Controller
                  name="jobTitle"
                  control={control}
                  render={({ field }) => (
                    <Input_Profile
                      {...field}
                      text={field.value}
                      placeholder="Nhập chức danh của bạn"
                      isEdit={isEditing}
                      error={errors.jobTitle?.message}
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
                    placeholder="Nhập email của bạn"
                    isEdit={isEditing}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input_Profile
                    icon={<Phone />}
                    {...field}
                    text={field.value}
                    placeholder="Nhập số điện thoại của bạn"
                    typeInput="tel"
                    isEdit={isEditing}
                    error={errors.phone?.message}
                  />
                )}
              />
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => {
                  // Convert date object to string for input field
                  const dateValue = field.value
                    ? field.value.toISOString().split("T")[0]
                    : "";

                  return (
                    <Input_Profile
                      icon={<DateIcon />}
                      {...field}
                      value={dateValue}
                      text={field.value ? formatDate(field.value) : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      placeholder="Nhập ngày sinh của bạn"
                      isEdit={isEditing}
                      typeInput="date"
                      error={errors.dateOfBirth?.message}
                    />
                  );
                }}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  // Find the matching option and get its label
                  const genderOption = [
                    { value: "Male", label: "Nam" },
                    { value: "Female", label: "Nữ" },
                    { value: "Other", label: "Khác" },
                  ];

                  return (
                    <Input_Profile
                      icon={<Gender />}
                      {...field}
                      text={
                        genderOption.find(
                          (option) => option.value === field.value
                        )?.label || field.value
                      }
                      placeholder="Chọn giới tính của bạn"
                      isEdit={isEditing}
                      typeInput="select"
                      options={genderOption}
                      error={errors.gender?.message}
                    />
                  );
                }}
              />
            </div>
            <div
              className={`grid grid-cols-1 ${
                !isEditing && "md:grid-cols-2"
              } gap-4 mt-6`}
            >
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input_Profile
                    icon={<Location />}
                    {...field}
                    placeholder="Nhập địa chỉ của bạn"
                    isEdit={isEditing}
                    text={field.value}
                    children={
                      <Input_Address
                        onChange={(value) => {
                          field.onChange(value);
                          // Force validation after change
                          setValue("address", value, { shouldValidate: true });
                        }}
                        value={field.value}
                      />
                    }
                    error={errors.address?.message}
                  />
                )}
              />
              <Controller
                name="cvFile"
                control={control}
                render={({ field: { onChange, value, ...field } }) => {
                  let displayFileName = null;
                  if (value instanceof FileList && value.length > 0) {
                    displayFileName = value[0]?.name;
                  } else if (typeof value === "string" && value) {
                    displayFileName = getCleanFileName(value);
                  }

                  return (
                    <div className="flex flex-row space-x-4">
                      <Input_Profile
                        icon={<Network />}
                        {...field}
                        // Use the calculated displayFileName or the default text
                        text={displayFileName || "Tải lên CV của bạn"}
                        isEdit={isEditing}
                        children={
                          isEditing && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label className="bg-blue-100 text-blue-600 px-3 py-1 rounded cursor-pointer hover:bg-blue-200">
                                  Chọn file
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onClick={(e) => {
                                      (e.target as HTMLInputElement).value = "";
                                    }}
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                    }}
                                  />
                                </label>

                                {/* Show filename and delete button only if displayFileName is truthy */}
                                {displayFileName && (
                                  <div className="ml-2 flex items-center">
                                    <span className="text-sm text-gray-600">
                                      {displayFileName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        // Set value to null and trigger validation/dirty state
                                        setValue("cvFile", null, {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                        });
                                      }}
                                      className="ml-2 text-red-500 hover:text-red-700 text-xs"
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }
                      />
                      {/* Download button logic (checks specifically for initial string value and not editing) */}
                      {typeof value === "string" && value && !isEditing && (
                        <div>
                          <a
                            href={value}
                            download={getCleanFileName(value)} // Use cleaned name for download
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 flex items-center text-sm"
                            rel="noopener noreferrer"
                          >
                            <span className="mr-1">Tải xuống</span>
                            <DownloadIcon />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </div>

          {/* About Section */}
          <Section_Profile
            title="Giới thiệu bản thân"
            content="Giới thiệu điểm mạnh và những gì bạn muốn chia sẻ thêm"
          >
            <Controller
              name="other"
              control={control}
              render={({ field }) =>
                isEditing ? (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Giới thiệu bản thân của bạn"
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

          {/* Education Section */}
          <Section_Profile
            title="Học vấn"
            content="Chia sẻ trình độ học vấn của bạn"
          >
            {isEditing ? (
              educationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="mb-4 p-4 bg-gray-50 rounded-lg relative"
                >
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeEducation(index)}
                    >
                      ✕
                    </button>
                  )}

                  {/* Updated: All three fields in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      name={`education.${index}.school`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trường học
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Nhập tên trường học"
                            disabled={!isEditing}
                          />
                          {errors.education?.[index]?.school && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.education[index]?.school?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name={`education.${index}.degree`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bằng cấp
                          </label>
                          <select
                            {...field}
                            className="w-full p-2 border rounded-md"
                            disabled={!isEditing}
                          >
                            <option value="">Chọn bằng cấp</option>
                            {degreeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.education?.[index]?.degree && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.education[index]?.degree?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name={`education.${index}.year`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Năm tốt nghiệp
                          </label>
                          <select
                            {...field}
                            className="w-full p-2 border rounded-md"
                            disabled={!isEditing}
                          >
                            <option value="">Chọn năm</option>
                            {yearOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.education?.[index]?.year && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.education[index]?.year?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>
                {educationFields.length > 0 ? (
                  educationFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="mb-4 border-l-4 border-blue-500 pl-4"
                    >
                      <h3 className="font-semibold text-lg">
                        {watch(`education.${index}.school`) || "Trường học"}
                      </h3>
                      <div className="text-gray-600 flex items-center space-x-2">
                        <span>
                          {degreeOptions.find(
                            (o) =>
                              o.value === watch(`education.${index}.degree`)
                          )?.label || "Bằng cấp"}
                        </span>
                        <span>•</span>
                        <span>
                          {watch(`education.${index}.year`) || "Năm tốt nghiệp"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    Chưa có thông tin học vấn
                  </p>
                )}
              </div>
            )}

            {isEditing && (
              <button
                type="button"
                onClick={addEducation}
                className="mt-2 flex items-center text-blue-500 hover:text-blue-600"
              >
                <span className="mr-2">+</span> Thêm học vấn
              </button>
            )}
          </Section_Profile>

          {/* Experience Section */}
          <Section_Profile
            title="Kinh nghiệm làm việc"
            content="Chia sẻ kinh nghiệm làm việc của bạn"
          >
            {isEditing ? (
              experienceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="mb-4 p-4 bg-gray-50 rounded-lg relative"
                >
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeExperience(index)}
                    >
                      ✕
                    </button>
                  )}

                  {/* All three fields in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      name={`experience.${index}.company`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Công ty
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Nhập tên công ty"
                            disabled={!isEditing}
                          />
                          {errors.experience?.[index]?.company && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.experience[index]?.company?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name={`experience.${index}.position`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vị trí
                          </label>
                          <select
                            {...field}
                            className="w-full p-2 border rounded-md"
                            disabled={!isEditing}
                          >
                            <option value="">Chọn vị trí</option>
                            {positionOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.experience?.[index]?.position && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.experience[index]?.position?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name={`experience.${index}.duration`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời gian làm việc
                          </label>
                          <select
                            {...field}
                            className="w-full p-2 border rounded-md"
                            disabled={!isEditing}
                          >
                            <option value="">Chọn thời gian</option>
                            {durationOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.experience?.[index]?.duration && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.experience[index]?.duration?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>
                {experienceFields.length > 0 ? (
                  experienceFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="mb-4 border-l-4 border-green-500 pl-4"
                    >
                      <h3 className="font-semibold text-lg">
                        {watch(`experience.${index}.company`) || "Công ty"}
                      </h3>
                      <div className="text-gray-600 flex items-center space-x-2">
                        <span>
                          {positionOptions.find(
                            (o) =>
                              o.value === watch(`experience.${index}.position`)
                          )?.label || "Vị trí"}
                        </span>
                        <span>•</span>
                        <span>
                          {durationOptions.find(
                            (o) =>
                              o.value === watch(`experience.${index}.duration`)
                          )?.label || "Thời gian làm việc"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    Chưa có thông tin kinh nghiệm làm việc
                  </p>
                )}
              </div>
            )}

            {isEditing && (
              <button
                type="button"
                onClick={addExperience}
                className="mt-2 flex items-center text-blue-500 hover:text-blue-600"
              >
                <span className="mr-2">+</span> Thêm kinh nghiệm làm việc
              </button>
            )}
          </Section_Profile>

          {/* Skill Section */}
          <Section_Profile
            title="Kỹ năng"
            content="Liệt kê các kỹ năng chuyên môn của bạn"
          >
            <Controller
              name="skills"
              control={control}
              render={({ field }) =>
                isEditing ? (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Liệt kê các kỹ năng của bạn"
                  />
                ) : (
                  <div
                    className="rich-content-display prose max-w-full"
                    dangerouslySetInnerHTML={{
                      __html:
                        field.value ||
                        "<p><em>Chưa có thông tin kỹ năng</em></p>",
                    }}
                  />
                )
              }
            />
          </Section_Profile>

          {/* Achievement Section */}
          <Section_Profile
            title="Thành tựu"
            content="Chia sẻ các chứng chỉ, dự án và thành tựu nổi bật của bạn"
          >
            <Controller
              name="achievement"
              control={control}
              render={({ field }) =>
                isEditing ? (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Liệt kê các thành tựu của bạn"
                  />
                ) : (
                  <div
                    className="rich-content-display prose max-w-full"
                    dangerouslySetInnerHTML={{
                      __html:
                        field.value ||
                        "<p><em>Chưa có thông tin thành tựu</em></p>",
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

export default CandidateProfile;
