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
import { Experience } from "@/utils/constant";
import { IJob } from "@/stores/jobStore";
import flattenSpecializations from "@/utils/flattenSpecializations";
import XIcon from "../atoms/icons/XIcon";
import PlusIcon from "../atoms/icons/PlusIcon";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import PaymentMethod from "../molecules/PaymentMethod";

// Job Types options
const JOB_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Linh hoạt", label: "Linh hoạt" },
];

// Validation schema for the form
const schema = yup.object({
  title: yup.string().required("Job title is required"),
  description: yup.string().required("Job description is required"),
  location: yup.string().required("Location is required"),
  salary: yup.object({
    min: yup
      .number()
      .typeError("Minimum salary must be a number")
      .required("Minimum salary is required")
      .positive("Salary must be positive"),
    max: yup
      .number()
      .typeError("Maximum salary must be a number")
      .required("Maximum salary is required")
      .positive("Salary must be positive")
      .test(
        "is-greater",
        "Maximum salary must be greater than minimum salary",
        function (value) {
          const { min } = this.parent;
          return !min || !value || value >= min;
        }
      ),
  }),
  experience: yup
    .array()
    .of(yup.string())
    .min(1, "At least one experience level is required")
    .required("Experience level is required"),
  jobType: yup.string().required("Job type is required"),
  expiresAt: yup.string().nullable().default(null),
  tags: yup
    .array()
    .of(
      yup.object({
        key: yup.string().required("Tag category is required"),
        value: yup.string().required("Tag value is required"),
      })
    )
    .min(1, "At least one tag is required"),
  specializationId: yup.string().required("Specialization is required"),
});

interface JobFormProps {
  title: string;
  initialData?: IJob;
  onSuccess: () => void;
  isEditing?: boolean;
}

const JobForm = ({
  title,
  initialData,
  onSuccess,
  isEditing = false,
}: JobFormProps) => {
  const router = useRouter();
  const jobStore = useJob();
  const specializationStore = useSpecialization();
  const tagStore = useTag();
  const paymentStore = usePayment();
  const [tagKeyOptions, setTagKeyOptions] = useState<string[]>([]);
  const [tagValueOptions, setTagValueOptions] = useState<
    Record<string, string[]>
  >({});
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

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
      let valuesByKey: Record<string, string[]> = {};
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
  const onSubmitDraft = async (data: any) => {
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
      // Fetch job details
      if (isEditing && initialData)
        await jobStore?.getPrivateJobById(initialData?._id || "");

      // Fetch specializations and tags for dropdowns
      await specializationStore?.getSpecialization();
      await tagStore?.getTagKeys();
    };

    fetchData();
  }, [initialData?._id, jobStore, specializationStore, tagStore]);

  // Add this to your JobForm component, before the return statement
  const flattenedSpecializations = specializationStore?.specialization
    ? flattenSpecializations(specializationStore.specialization)
    : [];

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

      toast.success("Payment successful! Your job has been published.", {
        duration: 5000,
      });
      setShowPaypalModal(false);
      onSuccess();
    } catch (error) {
      console.error("Error submitting job after payment:", error, {
        duration: 5000,
      });
      toast.error("There was an error publishing your job.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Add a handlePaymentError function
  const handlePaymentError = (err: any) => {
    console.error("Payment error:", err);
    toast.error("Payment failed. Your job was not published.", {
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
            Job Title
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Senior React Developer"
          />
          {errors.title && (
            <p className="mt-1 text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Location
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("location")}
            className="w-full p-2 border rounded-md"
            placeholder="e.g. District 1, Ho Chi Minh City"
          />
          {errors.location && (
            <p className="mt-1  text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Salary Range */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Salary Range (VND)
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <input
                type="number"
                {...register("salary.min")}
                className="w-full p-2 border rounded-md"
                placeholder="Minimum salary"
              />
              {errors.salary?.min && (
                <p className="mt-1  text-red-500">
                  {errors.salary.min.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                {...register("salary.max")}
                className="w-full p-2 border rounded-md"
                placeholder="Maximum salary"
              />
              {errors.salary?.max && (
                <p className="mt-1  text-red-500">
                  {errors.salary.max.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Experience Level - Now 5 per row */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Experience Level
            <span className="text-red-500">*</span>
          </label>
          <div className="w-full grid grid-cols-3 gap-2">
            {Object.entries(Experience).map(([key, label]) => (
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
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
          {errors.experience && (
            <p className="mt-1  text-red-500">{errors.experience.message}</p>
          )}
        </div>

        {/* Job Type */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Job Type
            <span className="text-red-500">*</span>
          </label>
          <select
            {...register("jobType")}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select job type</option>
            {JOB_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.jobType && (
            <p className="mt-1  text-red-500">{errors.jobType.message}</p>
          )}
        </div>

        {/* Expiration Date */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Expiration Date
          </label>
          <input
            type="date"
            {...register("expiresAt")}
            className="w-full p-2 border rounded-md"
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.expiresAt && (
            <p className="mt-1  text-red-500">{errors.expiresAt.message}</p>
          )}
        </div>

        {/* Specialization - MOVED ABOVE TAGS */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Specialization
            <span className="text-red-500">*</span>
          </label>
          <select
            {...register("specializationId")}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select specialization</option>
            {flattenedSpecializations.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {"\u00A0\u00A0\u00A0\u00A0".repeat(spec.depth)}
                {spec.name}
              </option>
            ))}
          </select>
          {errors.specializationId && (
            <p className="mt-1  text-red-500">
              {errors.specializationId.message}
            </p>
          )}
        </div>

        {/* Tags with useFieldArray */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Skills & Technologies
            <span className="text-red-500">*</span>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
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
                      <option value="">Select category</option>
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
                        <option value="">Select value</option>
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
                        aria-label="Remove tag"
                      >
                        <XIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => append({ key: "", value: "" })}
            className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
          >
            <PlusIcon />
            Add Skill/Technology
          </button>

          {errors.tags && typeof errors.tags.message === "string" && (
            <p className="mt-1  text-red-500">{errors.tags.message}</p>
          )}
        </div>

        {/* Job Description - MOVED TO BOTTOM */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Job Description
            <span className="text-red-500">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Describe the job responsibilities, requirements, benefits, etc."
              />
            )}
          />
          {errors.description && (
            <p className="mt-1  text-red-500">{errors.description.message}</p>
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
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmitDraft}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          disabled={isProcessing}
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={onSubmitPublish}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={isProcessing}
        >
          {isEditing ? "Update & Publish" : "Save & Publish"}
        </button>
      </div>

      {/* PayPal Payment Modal */}
      {showPaypalModal && (
        <PaymentMethod
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
