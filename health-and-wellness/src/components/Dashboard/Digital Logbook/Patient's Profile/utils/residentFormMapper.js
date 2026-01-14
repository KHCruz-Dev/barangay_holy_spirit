import { generateBarangayResidentId } from "../../../../../utils/idHelpers";
import { calculateAgeFromDate } from "../../../../../utils/calculateAgeFromDate";
export const makeEmptyResident = (alagangId) => ({
  alagangValmocinaID: alagangId,
  idStatus: "Pending",

  firstName: "",
  middleName: "",
  lastName: "",
  prefix: "",
  suffix: "",
  birthDate: "",
  age: "",
  gender: "",
  civilStatus: "",
  nationality: "",
  bloodType: "",

  contactNumber: "",
  emailAddress: "",
  emergencyContactFullName: "",
  emergencyContactNumber: "",

  votersID: "",
  precintID: "",
  philHealthID: "",
  sssGsisID: "",
  tinID: "",
  pagIbigID: "",
  prcID: "",
  driversLicense: "",

  region: "",
  province: "",
  cityMunicipality: "",
  barangay: "",
  subdivisionVillage: "",
  streetRoad: "",
  streetNumber: "",

  isVoter: false,
  isPWD: false,
  isEmployed: false,
  isStudent: false,
});

export const mapExistingResidentToForm = (apiResident) => {
  if (!apiResident) {
    return makeEmptyResident(generateBarangayResidentId());
  }

  const age = apiResident.birthdate
    ? calculateAgeFromDate(apiResident.birthdate)
    : "";

  return {
    ...makeEmptyResident(apiResident.alagang_valmocina_id),

    // 🧍 Personal Info
    firstName: apiResident.first_name || "",
    middleName: apiResident.middle_name || "",
    lastName: apiResident.last_name || "",
    prefix: apiResident.prefix?.trim() || "",
    suffix: apiResident.suffix?.trim() || "",
    birthDate: apiResident.birthdate
      ? String(apiResident.birthdate).slice(0, 10)
      : "",

    age: age.toString(),
    gender: apiResident.gender || "",
    civilStatus: apiResident.civil_status || "",
    nationality: apiResident.nationality || "",
    bloodType: apiResident.blood_type || "",

    // ☎ Contact (FIXED)
    contactNumber: apiResident.contact_number || "",
    emailAddress: apiResident.email_address ?? apiResident.emailAddress ?? "",

    emergencyContactFullName:
      apiResident.emergency_contact_full_name ??
      apiResident.emergencyContactFullName ??
      "",

    emergencyContactNumber:
      apiResident.emergency_contact_number ??
      apiResident.emergencyContactNumber ??
      "",

    // 🆔 ID
    alagangValmocinaID:
      apiResident.alagang_valmocina_id || apiResident.alagangValmocinaID,
    idStatus: apiResident.alagang_valmocina_id_status || "Pending",

    // 📍 Address (FIXED street number)
    region: apiResident.gis_region_name || "",
    province: apiResident.gis_province_name || "",
    cityMunicipality: apiResident.gis_municipality_name || "",
    barangay: apiResident.gis_barangay_name || "",
    subdivisionVillage: apiResident.gis_subdivision_name || "",
    streetRoad: apiResident.gis_street_name || "",
    streetNumber:
      apiResident.gis_street_number ??
      apiResident.street_number ??
      apiResident.streetNumber ??
      "",

    // 🧩 Toggles (FIXED)
    isVoter: Boolean(apiResident.is_voter ?? apiResident.isVoter),
    isPWD: Boolean(apiResident.is_pwd ?? apiResident.isPWD),
    isEmployed: Boolean(apiResident.is_employed ?? apiResident.isEmployed),
    isStudent: Boolean(apiResident.is_student ?? apiResident.isStudent),
  };
};
