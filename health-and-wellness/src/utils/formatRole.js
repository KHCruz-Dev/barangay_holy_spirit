// utils/formatRole.js
export function formatRole(role) {
  if (!role) return "";

  const ROLE_LABELS = {
    ADMINISTRATOR: "Administrator",
    ID_PRINTER: "ID Printer",
    ENCODER: "Encoder",
    REGISTRATION_STAFF: "Registration Staff",
    COORDINATOR: "Coordinator",
  };

  return ROLE_LABELS[role] || role;
}
