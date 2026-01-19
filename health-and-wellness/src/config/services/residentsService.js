// src/config/services/residentsService.js
import { apiGet } from "./api";

export function getResidents({
  page,
  limit,
  search,
  idStatus,
  barangayId, // ✅ ADD THIS
}) {
  const params = new URLSearchParams({
    page,
    limit,
  });

  if (search) params.append("search", search);
  if (idStatus) params.append("idStatus", idStatus);

  // ✅ THIS WAS THE MISSING WIRE
  if (barangayId) params.append("barangayId", barangayId);

  return apiGet(`/api/residentsProfile?${params.toString()}`);
}
