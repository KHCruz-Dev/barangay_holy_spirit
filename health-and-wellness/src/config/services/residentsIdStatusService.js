const API_URL = import.meta.env.VITE_API_URL;

/**
 * Update a SINGLE resident ID status
 */
export async function updateResidentIdStatus(id, status) {
  const res = await fetch(`${API_URL}/api/residentsProfile/${id}/id-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update ID status");
  }

  return res.json();
}

/**
 * Bulk update resident ID status
 */
export async function bulkUpdateResidentIdStatus(residentIds, status) {
  const res = await fetch(`${API_URL}/api/residentsProfile/bulk/id-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ residentIds, status }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Bulk update failed");
  }

  return res.json();
}
