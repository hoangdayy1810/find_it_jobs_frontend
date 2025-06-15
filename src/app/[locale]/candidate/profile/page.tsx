"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Edit from "@/components/atoms/icons/Edit";
import Input_Profile from "@/components/atoms/Input_Profile";
import Email from "@/components/atoms/icons/Email";
import Phone from "@/components/atoms/icons/Phone";
import DateIcon from "@/components/atoms/icons/Date";
import Gender from "@/components/atoms/icons/Gender";
import Location from "@/components/atoms/icons/Location";
import Network from "@/components/atoms/icons/Network";
import Section_Profile from "@/components/atoms/Section_Profile";
import { useCandidate, useTag } from "@/contexts/AppContext";
import { observer } from "mobx-react-lite";
import RichTextEditor from "@/components/atoms/RichText";
import Input_Address from "@/components/atoms/Input_Address";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatDate } from "@/utils/fommat_date";
import { getCleanFileName } from "@/utils/getCleanFilename";
import DownloadIcon from "@/components/atoms/icons/DownloadIcon";
import { DEGREE, POSITION, DURATION } from "@/utils/constant";

const CandidateProfile = observer(() => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const candidateStore = useCandidate();
  const tagStore = useTag();
  const [tagKeyOptions, setTagKeyOptions] = useState<string[]>([]);
  const [tagValueOptions, setTagValueOptions] = useState<
    Record<string, string[]>
  >({});

  // Define form validation schema with translations
  const validationSchema = yup.object({
    fullName: yup
      .string()
      .required(t("profile.candidate.validation.full_name_required")),
    jobTitle: yup
      .string()
      .required(t("profile.candidate.validation.job_title_required")),
    email: yup
      .string()
      .email(t("profile.candidate.validation.email_invalid"))
      .required(t("profile.candidate.validation.email_required")),
    phone: yup
      .string()
      .matches(/^[0-9]{6,15}$/, t("profile.candidate.validation.phone_format"))
      .required(t("profile.candidate.validation.phone_required")),
    dateOfBirth: yup
      .date()
      .required(t("profile.candidate.validation.date_required"))
      .max(new Date(), t("profile.candidate.validation.date_future")),
    gender: yup
      .string()
      .required(t("profile.candidate.validation.gender_required")),
    address: yup
      .string()
      .required(t("profile.candidate.validation.address_required")),
    avatar: yup.mixed(),
    cvFile: yup.mixed().optional().nullable(),
    education: yup.array().of(
      yup.object().shape({
        school: yup
          .string()
          .required(t("profile.candidate.validation.school_required")),
        degree: yup
          .string()
          .required(t("profile.candidate.validation.degree_required")),
        year: yup
          .string()
          .required(t("profile.candidate.validation.year_required")),
      })
    ),
    experience: yup.array().of(
      yup.object().shape({
        company: yup
          .string()
          .required(t("profile.candidate.validation.company_required")),
        position: yup
          .string()
          .required(t("profile.candidate.validation.position_required")),
        duration: yup
          .string()
          .required(t("profile.candidate.validation.duration_required")),
      })
    ),
    other: yup.string(),
    skills: yup
      .array()
      .of(
        yup.object({
          key: yup
            .string()
            .required(t("profile.candidate.validation.category_required")),
          value: yup
            .string()
            .required(t("profile.candidate.validation.value_required")),
        })
      )
      .min(1, t("profile.candidate.validation.skills_required")),
    achievement: yup.string(),
  });

  // Define predefined options for select fields with translations
  const degreeOptions = DEGREE.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));

  const yearOptions = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const positionOptions = POSITION.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));

  const durationOptions = DURATION.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));

  const genderOptions = [
    { value: "Male", label: t("profile.candidate.gender_options.male") },
    { value: "Female", label: t("profile.candidate.gender_options.female") },
    { value: "Other", label: t("profile.candidate.gender_options.other") },
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
      skills: candidateStore?.candidate?.skills || [],
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

  // Initialize useFieldArray for skills
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  // Replace your existing functions with these simpler versions
  const addEducation = () => {
    appendEducation({ school: "", degree: "", year: "" });
  };

  const addExperience = () => {
    appendExperience({ company: "", position: "", duration: "" });
  };

  const addSkill = () => {
    appendSkill({ key: "", value: "" });
  };

  useEffect(() => {
    // Set loading state only once
    if (candidateStore?.candidate) {
      reset({
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
        skills: candidateStore.candidate.skills || [],
        achievement: candidateStore.candidate.achievement || "",
      });
      setIsLoading(false);
    }
  }, [candidateStore?.candidate, reset]);

  // Add this useEffect to fetch tag keys and values
  useEffect(() => {
    const loadTagData = async () => {
      await tagStore?.getTagKeys();
    };

    loadTagData();
  }, [tagStore]);

  // Process tag data to get options for dropdowns
  useEffect(() => {
    if (tagStore?.tagKeys) {
      // Extract tag key names
      const keys = tagStore.tagKeys.map((tagKey) => tagKey.name);
      setTagKeyOptions(keys);

      // Create mapping from key names to their values
      const valuesByKey: Record<string, string[]> = {};
      tagStore.tagKeys.forEach((tagKey) => {
        if (tagKey.children && tagKey.children.length > 0) {
          valuesByKey[tagKey.name] = tagKey.children.map((child) => child.name);
        } else {
          valuesByKey[tagKey.name] = [];
        }
      });
      setTagValueOptions(valuesByKey);
    }
  }, [tagStore?.tagKeys]);

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

    if (data.skills && data.skills.length > 0) {
      formData.append("skills", JSON.stringify(data.skills));
    }

    // Rich text content
    formData.append("other", data.other || "");
    formData.append("achievement", data.achievement || "");

    // Handle avatar upload with better error handling
    if (data.avatar instanceof FileList && data.avatar.length > 0) {
      const avatarFile = data.avatar[0];
      if (avatarFile.size > 5 * 1024 * 1024) {
        alert("Avatar image should be less than 5MB");
        return;
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
        <div>
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
                            {t("profile.candidate.change")}
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
                          placeholder={t(
                            "profile.candidate.placeholders.full_name"
                          )}
                        />
                      )}
                    />
                  ) : (
                    <h2 className="text-2xl font-bold">
                      {candidateStore?.candidate?.fullName ||
                        t("profile.candidate.placeholders.full_name")}
                    </h2>
                  )}
                  <Controller
                    name="jobTitle"
                    control={control}
                    render={({ field }) => (
                      <Input_Profile
                        {...field}
                        text={field.value}
                        placeholder={t(
                          "profile.candidate.placeholders.job_title"
                        )}
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
                      placeholder={t("profile.candidate.placeholders.email")}
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
                      placeholder={t("profile.candidate.placeholders.phone")}
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
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        placeholder={t(
                          "profile.candidate.fields.date_of_birth"
                        )}
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
                    return (
                      <Input_Profile
                        icon={<Gender />}
                        {...field}
                        text={
                          genderOptions.find(
                            (option) => option.value === field.value
                          )?.label || field.value
                        }
                        placeholder={t("profile.candidate.fields.gender")}
                        isEdit={isEditing}
                        typeInput="select"
                        options={genderOptions}
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
                      placeholder={t("profile.candidate.placeholders.address")}
                      isEdit={isEditing}
                      text={field.value}
                      children={
                        <Input_Address
                          onChange={(value) => {
                            field.onChange(value);
                            // Force validation after change
                            setValue("address", value, {
                              shouldValidate: true,
                            });
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
                          text={
                            displayFileName || t("profile.candidate.fields.cv")
                          }
                          isEdit={isEditing}
                          children={
                            isEditing && (
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <label className="bg-blue-100 text-blue-600 px-3 py-1 rounded cursor-pointer hover:bg-blue-200">
                                    {t("profile.candidate.upload")}
                                    <input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      className="hidden"
                                      onClick={(e) => {
                                        (e.target as HTMLInputElement).value =
                                          "";
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
                                        {t("profile.candidate.remove")}
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
                              <span className="mr-1">
                                {t("job_application.modal.cv.download")}
                              </span>
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
              title={t("profile.candidate.sections.about")}
              content={t("profile.candidate.sections.about_description")}
            >
              <Controller
                name="other"
                control={control}
                render={({ field }) =>
                  isEditing ? (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("profile.candidate.placeholders.about")}
                    />
                  ) : (
                    <div
                      className="rich-content-display prose max-w-full"
                      dangerouslySetInnerHTML={{
                        __html:
                          field.value ||
                          `<p><em>${t(
                            "profile.candidate.placeholders.no_about"
                          )}</em></p>`,
                      }}
                    />
                  )
                }
              />
            </Section_Profile>

            {/* Education Section */}
            <Section_Profile
              title={t("profile.candidate.sections.education")}
              content={t("profile.candidate.sections.education_description")}
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
                              {t("profile.candidate.fields.school")}
                            </label>
                            <input
                              {...field}
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder={t(
                                "profile.candidate.placeholders.select_school"
                              )}
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
                              {t("profile.candidate.fields.degree")}
                            </label>
                            <select
                              {...field}
                              className="w-full p-2 border rounded-md"
                              disabled={!isEditing}
                            >
                              <option value="">
                                {t(
                                  "profile.candidate.placeholders.select_degree"
                                )}
                              </option>
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
                              {t("profile.candidate.fields.year")}
                            </label>
                            <select
                              {...field}
                              className="w-full p-2 border rounded-md"
                              disabled={!isEditing}
                            >
                              <option value="">
                                {t(
                                  "profile.candidate.placeholders.select_year"
                                )}
                              </option>
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
                          {watch(`education.${index}.school`) ||
                            t("profile.candidate.fields.school")}
                        </h3>
                        <div className="text-gray-600 flex items-center space-x-2">
                          <span>
                            {degreeOptions.find(
                              (o) =>
                                o.value === watch(`education.${index}.degree`)
                            )?.label || t("profile.candidate.fields.degree")}
                          </span>
                          <span>•</span>
                          <span>
                            {watch(`education.${index}.year`) ||
                              t("profile.candidate.fields.year")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      {t("profile.candidate.placeholders.no_education")}
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
                  <span className="mr-2">+</span>{" "}
                  {t("profile.candidate.add_education")}
                </button>
              )}
            </Section_Profile>

            {/* Experience Section */}
            <Section_Profile
              title={t("profile.candidate.sections.experience")}
              content={t("profile.candidate.sections.experience_description")}
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
                              {t("profile.candidate.fields.company")}
                            </label>
                            <input
                              {...field}
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder={t(
                                "profile.candidate.placeholders.select_company"
                              )}
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
                              {t("profile.candidate.fields.position")}
                            </label>
                            <select
                              {...field}
                              className="w-full p-2 border rounded-md"
                              disabled={!isEditing}
                            >
                              <option value="">
                                {t(
                                  "profile.candidate.placeholders.select_position"
                                )}
                              </option>
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
                              {t("profile.candidate.fields.duration")}
                            </label>
                            <select
                              {...field}
                              className="w-full p-2 border rounded-md"
                              disabled={!isEditing}
                            >
                              <option value="">
                                {t(
                                  "profile.candidate.placeholders.select_duration"
                                )}
                              </option>
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
                          {watch(`experience.${index}.company`) ||
                            t("profile.candidate.fields.company")}
                        </h3>
                        <div className="text-gray-600 flex items-center space-x-2">
                          <span>
                            {positionOptions.find(
                              (o) =>
                                o.value ===
                                watch(`experience.${index}.position`)
                            )?.label || t("profile.candidate.fields.position")}
                          </span>
                          <span>•</span>
                          <span>
                            {durationOptions.find(
                              (o) =>
                                o.value ===
                                watch(`experience.${index}.duration`)
                            )?.label || t("profile.candidate.fields.duration")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      {t("profile.candidate.placeholders.no_experience")}
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
                  <span className="mr-2">+</span>{" "}
                  {t("profile.candidate.add_experience")}
                </button>
              )}
            </Section_Profile>

            {/* Skill Section */}
            <Section_Profile
              title={t("profile.candidate.sections.skills")}
              content={t("profile.candidate.sections.skills_description")}
            >
              {isEditing ? (
                <>
                  {skillFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="mb-4 p-4 bg-gray-50 rounded-lg relative"
                    >
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-red-500"
                        onClick={() => removeSkill(index)}
                      >
                        ✕
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("profile.candidate.fields.category")}
                          </label>
                          <Controller
                            name={`skills.${index}.key`}
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full p-2 border rounded-md"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  // Reset value when key changes
                                  setValue(`skills.${index}.value`, "");
                                }}
                              >
                                <option value="">
                                  {t(
                                    "profile.candidate.placeholders.select_category"
                                  )}
                                </option>
                                {tagKeyOptions.map((key) => (
                                  <option key={key} value={key}>
                                    {key}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                          {errors.skills?.[index]?.key && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.skills[index]?.key?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("profile.candidate.fields.skill")}
                          </label>
                          <Controller
                            name={`skills.${index}.value`}
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full p-2 border rounded-md"
                                disabled={!watch(`skills.${index}.key`)}
                              >
                                <option value="">
                                  {t(
                                    "profile.candidate.placeholders.select_skill"
                                  )}
                                </option>
                                {watch(`skills.${index}.key`) &&
                                  tagValueOptions[
                                    watch(`skills.${index}.key`)
                                  ]?.map((value) => (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  ))}
                              </select>
                            )}
                          />
                          {errors.skills?.[index]?.value && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.skills[index]?.value?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSkill}
                    className="mt-2 flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <span className="mr-2">+</span>{" "}
                    {t("profile.candidate.add_skill")}
                  </button>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skillFields.length > 0 ? (
                    skillFields.map((field, index) => (
                      <span
                        key={field.id}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {watch(`skills.${index}.value`)}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      {t("profile.candidate.placeholders.no_skills")}
                    </p>
                  )}
                </div>
              )}
            </Section_Profile>

            {/* Achievement Section */}
            <Section_Profile
              title={t("profile.candidate.sections.achievements")}
              content={t("profile.candidate.sections.achievements_description")}
            >
              <Controller
                name="achievement"
                control={control}
                render={({ field }) =>
                  isEditing ? (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t(
                        "profile.candidate.placeholders.achievements"
                      )}
                    />
                  ) : (
                    <div
                      className="rich-content-display prose max-w-full"
                      dangerouslySetInnerHTML={{
                        __html:
                          field.value ||
                          `<p><em>${t(
                            "profile.candidate.placeholders.no_achievements"
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
                  {t("profile.candidate.save")}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
});

export default CandidateProfile;
