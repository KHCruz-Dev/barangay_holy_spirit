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

  regionId: undefined,
  provinceId: undefined,
  municipalityId: undefined,
  barangayId: undefined,
  subdivisionId: undefined,
  streetId: undefined,
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
    // 📍 GIS (IDS ONLY)
    regionId: apiResident.gis_region_id ?? undefined,
    provinceId: apiResident.gis_province_id ?? undefined,
    municipalityId: apiResident.gis_municipality_id ?? undefined,
    barangayId: apiResident.gis_barangay_id ?? undefined,
    subdivisionId: apiResident.gis_subdivision_id ?? undefined,
    streetId: apiResident.gis_streets_id ?? undefined,
    streetNumber:
      apiResident.gis_street_number ?? apiResident.street_number ?? "",

    // 🧩 Toggles (FIXED)
    isVoter: Boolean(apiResident.is_voter ?? apiResident.isVoter),
    isPWD: Boolean(apiResident.is_pwd ?? apiResident.isPWD),
    isEmployed: Boolean(apiResident.is_employed ?? apiResident.isEmployed),
    isStudent: Boolean(apiResident.is_student ?? apiResident.isStudent),
  };
};
