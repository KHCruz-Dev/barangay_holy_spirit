import { apiPost } from "../api";

/* ================================
   REGISTER ACCOUNT
================================ */
export function registerAccount(payload) {
  return apiPost("/api/auth/register", payload);
}

/* ================================
   LOGIN
================================ */
export function loginAccount(payload) {
  return apiPost("/api/auth/login", payload);
}
