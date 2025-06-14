"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useJob,
  usePayment,
  useSpecialization,
  useTag,
} from "@/contexts/AppContext";
import RichTextEditor from "@/components/atoms/RichText";
import { EXPERIENCE, JOBTYPE } from "@/utils/constant";
import { IJob } from "@/stores/jobStore";
import flattenSpecializations from "@/utils/flattenSpecializations";
import XIcon from "../atoms/icons/XIcon";
import PlusIcon from "../atoms/icons/PlusIcon";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import PaymentMethod from "../molecules/PaymentMethod";
import { useTranslations } from "next-intl";

interface JobFormProps {
  title: string;
  initialData?: IJob;
  onSuccess: () => void;
  isEditing?: boolean;
  t?: any;
}

const JobForm = ({
  title,
  initialData,
  onSuccess,
  isEditing = false,
  t: propT,
}: JobFormProps) => {
  const router = useRouter();
  const jobStore = useJob();
  const specializationStore = useSpecialization();
  const tagStore = useTag();
  const paymentStore = usePayment();
  const defaultT = useTranslations();
  const t = propT || defaultT;
  const [tagKeyOptions, setTagKeyOptions] = useState<string[]>([]);
  const [tagValueOptions, setTagValueOptions] = useState<
    Record<string, string[]>
  >({});
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isSpecializationsLoading, setIsSpecializationsLoading] =
    useState(true);
  const [isTagsLoading, setIsTagsLoading] = useState(true);

  const schema = React.useMemo(() => {
    return yup.object({
      title: yup
        .string()
        .required(t("employer.myjobs.form.validation.title_required")),
      description: yup
        .string()
        .required(t("employer.myjobs.form.validation.description_required")),
      location: yup
        .string()
        .required(t("employer.myjobs.form.validation.location_required")),
      salary: yup.object({
        min: yup
          .number()
          .typeError(t("employer.myjobs.form.validation.salary_min_number"))
          .required(t("employer.myjobs.form.validation.salary_min_required"))
          .positive(t("employer.myjobs.form.validation.salary_positive")),
        max: yup
          .number()
          .typeError(t("employer.myjobs.form.validation.salary_max_number"))
          .required(t("employer.myjobs.form.validation.salary_max_required"))
          .positive(t("employer.myjobs.form.validation.salary_positive"))
          .test(
            "is-greater",
            t("employer.myjobs.form.validation.salary_max_greater"),
            function (value) {
              const { min } = this.parent;
              return !min || !value || value >= min;
            }
          ),
      }),
      experience: yup
        .array()
        .of(yup.string())
        .min(1, t("employer.myjobs.form.validation.experience_required"))
        .required(t("employer.myjobs.form.validation.experience_required")),
      jobType: yup
        .string()
        .required(t("employer.myjobs.form.validation.job_type_required")),
      expiresAt: yup.string().nullable().default(null),
      tags: yup
        .array()
        .of(
          yup.object({
            key: yup
              .string()
              .required(t("employer.myjobs.form.validation.tag_key_required")),
            value: yup
              .string()
              .required(
                t("employer.myjobs.form.validation.tag_value_required")
              ),
          })
        )
        .min(1, t("employer.myjobs.form.validation.tags_required")),
      specializationId: yup
        .string()
        .required(t("employer.myjobs.form.validation.specialization_required")),
    });
  }, [t]); // Recreate when t changes (language changes)

  // Form default values based on whether we're editing or creating
  const defaultValues =
    isEditing && initialData
      ? {
          title: initialData.title || "",
          description: initialData.description || "",
          location: initialData.location || "",
          salary: {
            min: initialData.salary?.min || 0,
            max: initialData.salary?.max || 0,
          },
          experience: initialData.experience || [],
          jobType: initialData.jobType || "Full-time",
          expiresAt: initialData.expiresAt
            ? new Date(initialData.expiresAt).toISOString().split("T")[0]
            : null,
          tags: initialData.tags?.map((tag) => ({
            key: tag.key,
            value: tag.value,
          })) || [{ key: "", value: "" }],
          specializationId:
            typeof initialData.specializationId === "object"
              ? initialData.specializationId._id
              : initialData.specializationId || "",
        }
      : {
          title: "",
          description: "",
          location: "",
          salary: { min: 0, max: 0 },
          experience: [],
          jobType: "Full-time",
          expiresAt: null,
          tags: [{ key: "", value: "" }],
          specializationId: "",
        };

  // Initialize form with React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  // Initialize useFieldArray for tags
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

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

  // Watch tag keys to update value options
  const tagsArray = watch("tags");

  // Form submission handlers
  const onSubmitDraft = async () => {
    await handleSubmit((formData) => submit(formData, false))();
  };

  const onSubmitPublish = async () => {
    await handleSubmit((data) => {
      setFormData(data);
      setShowPaypalModal(true);
      return true;
    })();
  };

  const submit = async (data: any, isShow: boolean) => {
    try {
      const jobData = {
        ...data,
        isShow,
      };

      if (isEditing && initialData) {
        // Update existing job
        await jobStore?.updateJob(initialData._id, jobData);
      } else {
        // Create new job
        await jobStore?.createJob(jobData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting job:", error);
    }
  };

  // In your edit page component
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading states to true
        setIsSpecializationsLoading(true);
        setIsTagsLoading(true);

        // Fetch job details if in edit mode
        if (isEditing && initialData) {
          await jobStore?.getPrivateJobById(initialData?._id || "");
        }

        // Fetch specializations with proper error handling
        await specializationStore?.getSpecialization();
        setIsSpecializationsLoading(false);

        // Fetch tags with proper error handling
        await tagStore?.getTagKeys();

        // Process tag data
        if (tagStore?.tagKeys) {
          // Extract tag key names
          const keys = tagStore.tagKeys.map((tagKey) => tagKey.name);
          setTagKeyOptions(keys);

          // Create mapping from key names to their values
          const valuesByKey: Record<string, string[]> = {};
          tagStore.tagKeys.forEach((tagKey) => {
            if (tagKey.children && tagKey.children.length > 0) {
              valuesByKey[tagKey.name] = tagKey.children.map(
                (child) => child.name
              );
            } else {
              valuesByKey[tagKey.name] = [];
            }
          });
          setTagValueOptions(valuesByKey);
        }

        setIsTagsLoading(false);
      } catch (error) {
        console.error("Error loading form data:", error);
        setIsSpecializationsLoading(false);
        setIsTagsLoading(false);
        // Optionally show an error toast here
        toast.error(t("employer.myjobs.form.loading_error"), {
          duration: 5000,
        });
      }
    };

    fetchData();
  }, [initialData?._id, jobStore, specializationStore, tagStore]);

  // Move flattenedSpecializations inside useEffect or memoize it
  const flattenedSpecializations = React.useMemo(() => {
    return specializationStore?.specialization
      ? flattenSpecializations(specializationStore.specialization)
      : [];
  }, [specializationStore?.specialization]);

  // Create a handlePaymentSuccess function
  const handlePaymentSuccess = async (details: any) => {
    try {
      setIsProcessing(true);
      // Add payment details to the form data if needed
      const jobData = {
        ...formData,
        isShow: true,
      };

      const paymentDetails = {
        transactionId: details.id,
        payerId: details.payer.payer_id,
        amount: details.purchase_units[0].amount.value,
        package: "basic",
        status: "completed",
      };

      if (isEditing && initialData) {
        // Update existing job
        const result = await jobStore?.updateJob(initialData._id, jobData);
        if (result.job) {
          await paymentStore?.generationPayment(result.job._id, paymentDetails);
        }
      } else {
        // Create new job
        const result = await jobStore?.createJob(jobData);
        if (result.job) {
          await paymentStore?.generationPayment(result.job._id, paymentDetails);
        }
      }

      toast.success(t("employer.myjobs.form.payment_success"), {
        duration: 5000,
      });
      setShowPaypalModal(false);
      onSuccess();
    } catch (error) {
      console.error("Error submitting job after payment:", error, {
        duration: 5000,
      });
      toast.error(t("employer.myjobs.form.payment_error"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Add a handlePaymentError function
  const handlePaymentError = (err: any) => {
    console.error("Payment error:", err);
    toast.error(t("employer.myjobs.form.payment_failed"), {
      duration: 5000,
    });
    setShowPaypalModal(false);
  };

  // Add a handlePaymentCancel function
  const handlePaymentCancel = () => {
    setShowPaypalModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Form Header */}
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
      <form className="space-y-6 p-4">
        {/* Job Title */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.title")}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2 border rounded-md"
            placeholder={t("employer.myjobs.form.placeholders.title")}
          />
          {errors.title && (
            <p className="mt-1 text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.location")}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("location")}
            className="w-full p-2 border rounded-md"
            placeholder={t("employer.myjobs.form.placeholders.location")}
          />
          {errors.location && (
            <p className="mt-1 text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Salary Range */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.salary_range")}{" "}
            {`(${t("all.VND")})`}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <input
                type="number"
                {...register("salary.min")}
                className="w-full p-2 border rounded-md"
                placeholder={t("employer.myjobs.form.placeholders.salary_min")}
              />
              {errors.salary?.min && (
                <p className="mt-1 text-red-500">{errors.salary.min.message}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                {...register("salary.max")}
                className="w-full p-2 border rounded-md"
                placeholder={t("employer.myjobs.form.placeholders.salary_max")}
              />
              {errors.salary?.max && (
                <p className="mt-1 text-red-500">{errors.salary.max.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.experience")}
            <span className="text-red-500">*</span>
          </label>
          <div className="w-full grid grid-cols-3 gap-2">
            {Object.entries(EXPERIENCE).map(([key, labelKey]) => (
              <label
                key={key}
                className="flex items-center space-x-2 p-1 border rounded-md"
              >
                <input
                  type="checkbox"
                  value={key}
                  {...register("experience")}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{t(labelKey)}</span>
              </label>
            ))}
          </div>
          {errors.experience && (
            <p className="mt-1 text-red-500">{errors.experience.message}</p>
          )}
        </div>

        {/* Job Type */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.job_type")}
            <span className="text-red-500">*</span>
          </label>
          <select
            {...register("jobType")}
            className="w-full p-2 border rounded-md"
          >
            <option value="">
              {t("employer.myjobs.form.placeholders.job_type")}
            </option>
            {JOBTYPE.map((option) => (
              <option key={option.value} value={option.value}>
                {t(
                  `all.job_type.${option.value.toLowerCase().replace("-", "_")}`
                )}
              </option>
            ))}
          </select>
          {errors.jobType && (
            <p className="mt-1 text-red-500">{errors.jobType.message}</p>
          )}
        </div>

        {/* Expiration Date */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.expires_at")}
          </label>
          <input
            type="date"
            {...register("expiresAt")}
            className="w-full p-2 border rounded-md"
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.expiresAt && (
            <p className="mt-1 text-red-500">{errors.expiresAt.message}</p>
          )}
        </div>

        {/* Specialization */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.specialization")}
            <span className="text-red-500">*</span>
          </label>
          {isSpecializationsLoading ? (
            <div className="w-full p-2 border rounded-md bg-gray-50 flex items-center">
              <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-500 text-sm">
                {t("employer.myjobs.form.loading_specializations")}
              </span>
            </div>
          ) : (
            <select
              {...register("specializationId")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">
                {t("employer.myjobs.form.placeholders.specialization")}
              </option>
              {flattenedSpecializations.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {"\u00A0\u00A0\u00A0\u00A0".repeat(spec.depth)}
                  {spec.name}
                </option>
              ))}
            </select>
          )}
          {errors.specializationId && (
            <p className="mt-1 text-red-500">
              {errors.specializationId.message}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.tags")}
            <span className="text-red-500">*</span>
          </label>

          {isTagsLoading ? (
            <div className="w-full p-2 border rounded-md bg-gray-50 flex items-center">
              <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-500 text-sm">
                {t("employer.myjobs.form.loading_tags")}
              </span>
            </div>
          ) : (
            <>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  {/* Tag fields... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                    <div>
                      <select
                        {...register(`tags.${index}.key`)}
                        className="w-full p-2 border rounded-md"
                        value={tagsArray?.[index]?.key || ""}
                        onChange={(e) => {
                          setValue(`tags.${index}.key`, e.target.value);
                          setValue(`tags.${index}.value`, "");
                        }}
                      >
                        <option value="">
                          {t("employer.myjobs.form.placeholders.tag_category")}
                        </option>
                        {tagKeyOptions.map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </select>
                      {errors.tags?.[index]?.key?.message && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.tags[index].key.message as string}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center relative">
                      <div className="flex-grow">
                        <select
                          {...register(`tags.${index}.value`)}
                          className="w-full p-2 border rounded-md"
                          value={tagsArray?.[index]?.value || ""}
                          disabled={!watch(`tags.${index}.key`)}
                        >
                          <option value="">
                            {t("employer.myjobs.form.placeholders.tag_value")}
                          </option>
                          {watch(`tags.${index}.key`) &&
                            tagValueOptions[watch(`tags.${index}.key`)]?.map(
                              (value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              )
                            )}
                        </select>
                        {errors.tags?.[index]?.value?.message && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.tags[index]?.value?.message as string}
                          </p>
                        )}
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute -right-8 text-red-500 hover:text-red-700 flex-shrink-0"
                          aria-label={t(
                            "employer.myjobs.form.buttons.remove_tag"
                          )}
                        >
                          <XIcon />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ key: "", value: "" })}
                className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
              >
                <PlusIcon />
                {t("employer.myjobs.form.buttons.add_tag")}
              </button>
            </>
          )}

          {errors.tags && typeof errors.tags.message === "string" && (
            <p className="mt-1 text-red-500">{errors.tags.message}</p>
          )}
        </div>

        {/* Job Description */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t("employer.myjobs.form.labels.description")}
            <span className="text-red-500">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder={t("employer.myjobs.form.placeholders.description")}
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-red-500">{errors.description.message}</p>
          )}
        </div>
      </form>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded hover:bg-gray-200 transition-colors"
        >
          {t("employer.myjobs.form.buttons.cancel")}
        </button>
        <button
          type="button"
          onClick={onSubmitDraft}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          disabled={isProcessing}
        >
          {t("employer.myjobs.form.buttons.save_draft")}
        </button>
        <button
          type="button"
          onClick={onSubmitPublish}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={isProcessing}
        >
          {isEditing
            ? t("employer.myjobs.form.buttons.update_publish")
            : t("employer.myjobs.form.buttons.save_publish")}
        </button>
      </div>

      {/* PayPal Payment Modal */}
      {showPaypalModal && (
        <PaymentMethod
          t={t}
          handlePaymentSuccess={handlePaymentSuccess}
          handlePaymentError={handlePaymentError}
          handlePaymentCancel={handlePaymentCancel}
          onCancel={() => setShowPaypalModal(false)}
        />
      )}
    </div>
  );
};

export default JobForm;
