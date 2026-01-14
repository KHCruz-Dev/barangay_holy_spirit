import { apiGet } from "../api";

// Fetch all genders
export function getAllGenders() {
  return apiGet("/api/gender");
}

// Fetch all civil status
export function getAllCivilStatus() {
  return apiGet("/api/civil_status");
}

// Fetch all nationalities
export function getAllNationalities() {
  return apiGet("/api/nationalities");
}

// Fetch all name suffix
export function getAllNameSuffx() {
  return apiGet("/api/suffix");
}
// Fetch all name prefix
export function getAllNamePrefix() {
  return apiGet("/api/prefix");
}

// Fet all Id Types
export function getAllHrisIdTypes() {
  return apiGet("/api/idtypes");
}
