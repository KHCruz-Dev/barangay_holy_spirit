import { generateBarangayResidentId } from "../../../../../utils/idHelpers";
import { calculateAgeFromDate } from "../../../../../utils/calculateAgeFromDate";

export const makeEmptyNonResident = (alagangId) => ({
  alagangValmocinaID: alagangId,

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

  // GIS (same UI keys)
  region: "",
  province: "",
  cityMunicipality: "",

  // ✅ Non-resident single line text address
  streetAddressLine: "",

  isVoter: false,
  isPWD: false,
  isEmployed: false,
  isStudent: false,
});

export const mapExistingNonResidentToForm = (apiResident) => {
  if (!apiResident) return makeEmptyNonResident(generateBarangayResidentId());

  const age = apiResident.birthdate
    ? calculateAgeFromDate(apiResident.birthdate)
    : "";

  // 🔧 Extract barangay if present in address string
  let barangay = "";
  if (apiResident.complete_address) {
    const parts = apiResident.complete_address.split(",");
    if (parts.length >= 4) {
      barangay = parts[1].trim(); // street, BARANGAY, city, province, region
    }
  }

  return {
    ...makeEmptyNonResident(apiResident.alagang_valmocina_id),

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

    contactNumber: apiResident.contact_number || "",
    emailAddress: apiResident.email_address ?? "",

    emergencyContactFullName: apiResident.emergency_contact_full_name ?? "",
    emergencyContactNumber: apiResident.emergency_contact_number ?? "",

    alagangValmocinaID: apiResident.alagang_valmocina_id,

    // 🌍 GIS
    region: apiResident.gis_region_name || "",
    province: apiResident.gis_province_name || "",
    cityMunicipality: apiResident.gis_municipality_name || "",
    barangay: apiResident.gis_barangay_name || "",

    streetAddressLine: apiResident.street_address_line || "",

    isVoter: Boolean(apiResident.is_voter),
    isPWD: Boolean(apiResident.is_pwd),
    isEmployed: Boolean(apiResident.is_employed),
    isStudent: Boolean(apiResident.is_student),
  };
};
