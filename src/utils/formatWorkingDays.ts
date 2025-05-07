export const formatWorkingDays = (days: string[]): string => {
  if (!days || days.length === 0) return "";

  // Map days to their numerical order in the week
  const dayOrder: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  // Map numbers back to day display names
  const dayNames: Record<number, string> = {
    1: "Thứ Hai",
    2: "Thứ Ba",
    3: "Thứ Tư",
    4: "Thứ Năm",
    5: "Thứ Sáu",
    6: "Thứ Bảy",
    7: "Chủ Nhật",
  };

  // Sort days by their order in the week
  const sortedDays = [...days].sort((a, b) => dayOrder[a] - dayOrder[b]);

  // Group consecutive days
  const ranges: { start: number; end: number }[] = [];
  let rangeStart = dayOrder[sortedDays[0]];
  let rangeEnd = rangeStart;

  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = dayOrder[sortedDays[i]];
    const previousDay = dayOrder[sortedDays[i - 1]];

    if (currentDay === previousDay + 1) {
      // Consecutive day, extend the range
      rangeEnd = currentDay;
    } else {
      // Non-consecutive day, finish the current range and start a new one
      ranges.push({ start: rangeStart, end: rangeEnd });
      rangeStart = currentDay;
      rangeEnd = currentDay;
    }
  }

  // Add the last range
  ranges.push({ start: rangeStart, end: rangeEnd });

  // Format ranges as strings
  return ranges
    .map((range) => {
      if (range.start === range.end) {
        // Single day
        return dayNames[range.start];
      } else {
        // Range of days
        return `${dayNames[range.start]} - ${dayNames[range.end]}`;
      }
    })
    .join(", ");
};

export const parseWorkingDays = (workingDaysString: string): string[] => {
  if (!workingDaysString || workingDaysString.trim() === "") return [];

  const possibleDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // If the string contains commas, split and process each part
  if (workingDaysString.includes(",")) {
    const parts = workingDaysString.split(",").map((part) => part.trim());

    let allDays: string[] = [];

    // Process each part (could be a single day or a range)
    for (const part of parts) {
      // Check if it's a range
      if (part.includes("-")) {
        const rangeDays = processDayRange(part, possibleDays);
        allDays = [...allDays, ...rangeDays];
      } else {
        // It's a single day
        const dayMatch = possibleDays.find(
          (day) => part.includes(day) || part.includes(getDayTranslation(day))
        );
        if (dayMatch) allDays.push(dayMatch);
      }
    }

    return [...new Set(allDays)]; // Remove duplicates
  }

  // Check if it's a single range like "Monday - Friday"
  if (workingDaysString.includes("-")) {
    return processDayRange(workingDaysString, possibleDays);
  }

  // Otherwise, just check for day names in the string
  return possibleDays.filter(
    (day) =>
      workingDaysString.includes(day) ||
      workingDaysString.includes(getDayTranslation(day))
  );
};

// Helper function to process a day range like "Monday - Friday"
function processDayRange(rangeString: string, allDays: string[]): string[] {
  const parts = rangeString.split("-").map((p) => p.trim());

  if (parts.length !== 2) return [];

  // Find the start and end days
  let startDay = findDayInString(parts[0], allDays);
  let endDay = findDayInString(parts[1], allDays);

  if (!startDay || !endDay) return [];

  // Get indices to determine the range
  const startIndex = allDays.indexOf(startDay);
  const endIndex = allDays.indexOf(endDay);

  if (startIndex === -1 || endIndex === -1) return [];

  // Return all days in the range (inclusive)
  return allDays.slice(
    Math.min(startIndex, endIndex),
    Math.max(startIndex, endIndex) + 1
  );
}

// Helper function to find a day name in a string (handles translations too)
function findDayInString(str: string, allDays: string[]): string | undefined {
  // Try to match an exact day name
  const exactMatch = allDays.find(
    (day) => str === day || str === getDayTranslation(day)
  );
  if (exactMatch) return exactMatch;

  // Try to match a day name within the string
  return allDays.find(
    (day) => str.includes(day) || str.includes(getDayTranslation(day))
  );
}

// Helper to get Vietnamese translation of a day
function getDayTranslation(day: string): string {
  const translations: Record<string, string> = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
  };
  return translations[day] || day;
}
