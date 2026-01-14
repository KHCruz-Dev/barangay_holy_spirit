// src/config/services/residentsService.js
import { apiGet } from "./api";

export function getResidents({ page, limit, search, idStatus }) {
  const params = new URLSearchParams({ page, limit });

  if (search) params.append("search", search);
  if (idStatus) params.append("idStatus", idStatus);

  return apiGet(`/api/residentsProfile?${params.toString()}`);
}
