import { apiGet } from "../api";

// Fetch all regions
export function getAllRegions() {
  return apiGet("/api/regions");
}

// Fetch all province
export function getAllProvince() {
  return apiGet("/api/province");
}

// Fetch all municipality
export function getAllMunicipality() {
  return apiGet("/api/municipality");
}

// Fetch all barangay
export function getAllBarangay() {
  return apiGet("/api/barangay");
}

// Fetch all subdivision
export function getAllSubdivision() {
  return apiGet("/api/subdivisions");
}

// Fetch all streets
export function getAllStreets() {
  return apiGet("/api/streets");
}
