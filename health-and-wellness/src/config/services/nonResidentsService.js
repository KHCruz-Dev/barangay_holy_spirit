import { apiGet } from "./api";

export function getNonResidents({ page, limit, search }) {
  const params = new URLSearchParams({ page, limit });

  if (search) params.append("search", search);

  return apiGet(`/api/nonResidentsProfile?${params.toString()}`);
}
