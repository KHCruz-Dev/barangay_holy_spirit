// src/utils/dateFormatters.js

export const formatLongDate = (isoDateStr) => {
  if (!isoDateStr) return "";
  const date = new Date(isoDateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
