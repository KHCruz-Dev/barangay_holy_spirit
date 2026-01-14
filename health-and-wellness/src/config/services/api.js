// src/config/services/api.js

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* ================================
   GET
================================ */
export async function apiGet(url) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    method: "GET",
    credentials: "include", // 🔥 REQUIRED
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "API request failed");
  }

  return res.json();
}

/* ================================
   POST
================================ */
export async function apiPost(endpoint, payload) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔥 REQUIRED
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw data; // 👈 preserves backend error message
    }

    return data;
  } catch (error) {
    console.error("API POST Error:", error);
    throw error;
  }
}

export async function apiPatch(endpoint, payload) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
