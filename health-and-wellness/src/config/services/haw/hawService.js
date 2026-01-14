import { apiGet } from "../api";

// Fetch all blood types
export function getAllBloodTypes() {
  return apiGet("/api/bloodtypes");
}

// Fetch all services
export function getAllServices() {
  return apiGet("/api/services");
}
