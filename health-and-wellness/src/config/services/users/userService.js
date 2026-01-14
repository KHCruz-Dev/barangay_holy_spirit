import { apiGet, apiPatch, apiDelete } from "../api";

/* =========================
   GET USERS
========================= */
export function getUsers() {
  return apiGet("/api/users");
}

/* =========================
   UPDATE STATUS
========================= */
export function updateUserStatus(userId, status) {
  return apiPatch(`/api/users/${userId}/status`, { status });
}

/* =========================
   UPDATE ROLE
========================= */
export function updateUserRole(userId, role) {
  return apiPatch(`/api/users/${userId}/role`, { role });
}

/* =========================
   CHANGE PASSWORD
========================= */
export function changeUserPassword(userId, password, confirmPassword) {
  return apiPatch(`/api/users/${userId}/password`, {
    password,
    confirmPassword,
  });
}

/* =========================
   DELETE ACCOUNT
========================= */
export function deleteUser(userId) {
  return apiDelete(`/api/users/${userId}`);
}
