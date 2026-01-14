// import { calculateAgeFromDate } from "@/utils/calculateAgeFromDate";

// export const mapExistingResidentToForm = (apiResident, makeEmptyResident) => {
//   if (!apiResident) return makeEmptyResident();

//   return {
//     ...makeEmptyResident(apiResident.alagang_valmocina_id),
//     firstName: apiResident.first_name ?? "",
//     middleName: apiResident.middle_name ?? "",
//     lastName: apiResident.last_name ?? "",
//     birthDate: apiResident.birthdate ?? "",
//     age: calculateAgeFromDate(apiResident.birthdate),
//     gender: apiResident.gender ?? "",
//     civilStatus: apiResident.civil_status ?? "",
//     nationality: apiResident.nationality ?? "",
//     region: apiResident.gis_region_name ?? "",
//     province: apiResident.gis_province_name ?? "",
//     cityMunicipality: apiResident.gis_municipality_name ?? "",
//     barangay: apiResident.gis_barangay_name ?? "",
//     subdivisionVillage: apiResident.gis_subdivision_name ?? "",
//     streetRoad: apiResident.gis_street_name ?? "",
//   };
// };
