// Helper function to get clean file name from URL
export const getCleanFileName = (filePath: string | undefined) => {
  if (!filePath) return "";

  // Extract just the filename after the last slash
  const fullNameWithParams = filePath.split("/").pop() || "";

  // Remove any query parameters (everything after the ?)
  const fileName = fullNameWithParams.split("?")[0];
  const fileNameParts = fileName.split("%2F")[2];

  return decodeURIComponent(fileNameParts);
};
