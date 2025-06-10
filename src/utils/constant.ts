export const EXPERIENCE: Record<string, string> = {
  intern: "all.experience.intern",
  fresher: "all.experience.fresher",
  junior: "all.experience.junior",
  mid: "all.experience.mid",
  senior: "all.experience.senior",
  lead: "all.experience.lead",
  manager: "all.experience.manager",
  not_specified: "all.experience.not_specified",
};

export const JOBTYPE = [
  { value: "Full-time", label: "all.job_type.full_time" },
  { value: "Part-time", label: "all.job_type.part_time" },
  { value: "Contract", label: "all.job_type.contract" },
  { value: "Freelance", label: "all.job_type.freelance" },
];

export const SALARY_RANGE = [
  { value: "0-5000000", label: "< 5,000,000 VND" },
  { value: "5000000-10000000", label: "5-10 million VND" },
  { value: "10000000-20000000", label: "10-20 million VND" },
  { value: "20000000-30000000", label: "20-30 million VND" },
  { value: "30000000-50000000", label: "30-50 million VND" },
  { value: "50000000-1000000000", label: "> 50 million VND" },
];

export const APPLICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const PAYMENT_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  FAILED: "failed",
};

export const COMPANYSIZE = [
  { value: "1-10", label: "application.company.size.1-10" },
  { value: "11-50", label: "application.company.size.11-50" },
  { value: "51-200", label: "application.company.size.51-200" },
  { value: "201-500", label: "application.company.size.201-500" },
  { value: "500+", label: "application.company.size.500+" },
];

export const COMPANYTYPE = [
  { value: "Product", label: "application.company.type.product" },
  { value: "Outsourcing", label: "application.company.type.outsourcing" },
  { value: "Startup", label: "application.company.type.startup" },
  { value: "Other", label: "application.company.type.other" },
];

export const WORKINGDAYS = [
  { value: "Monday", label: "application.company.workingDays.monday" },
  { value: "Tuesday", label: "application.company.workingDays.tuesday" },
  { value: "Wednesday", label: "application.company.workingDays.wednesday" },
  { value: "Thursday", label: "application.company.workingDays.thursday" },
  { value: "Friday", label: "application.company.workingDays.friday" },
  { value: "Saturday", label: "application.company.workingDays.saturday" },
  { value: "Sunday", label: "application.company.workingDays.sunday" },
];
