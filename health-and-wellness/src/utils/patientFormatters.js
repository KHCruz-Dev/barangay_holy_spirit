// utils/patientFormatters.js
export const formatPHContact = (raw) => {
  if (!raw) return "";

  const digits = String(raw).replace(/\D/g, "");

  // Expect 9-digit subscriber number
  if (digits.length === 9) {
    return `+639${digits}`;
  }

  // Already formatted
  if (digits.length === 12 && digits.startsWith("639")) {
    return `+${digits}`;
  }

  return raw; // fallback
};

// utils/patientFormatters.js
export function formatDateOnly(date) {
  if (!date) return null;

  // ✅ Accept ONLY YYYY-MM-DD
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // ❌ Reject everything else
  console.warn("Invalid birthdate format:", date);
  return null;
}
