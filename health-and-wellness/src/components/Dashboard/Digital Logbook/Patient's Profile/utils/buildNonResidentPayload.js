import {
  formatPHContact,
  formatDateOnly,
} from "../../../../../utils/patientFormatters";

export function buildNonResidentPayload({
  resident,
  identificationCards,
  regionData,
  provinceData,
  municipalityData,
  barangayData,
}) {
  const selectedRegion = regionData.find((r) => r.value === resident.region);
  const selectedProvince = provinceData.find(
    (p) => p.value === resident.province
  );
  const selectedMunicipality = municipalityData.find(
    (m) => m.value === resident.cityMunicipality
  );
  const selectedBarangay = barangayData.find(
    (b) => b.value === resident.barangay
  );

  const streetAddressLine = (resident.streetAddressLine || "").trim();

  return {
    first_name: resident.firstName,
    middle_name: resident.middleName,
    last_name: resident.lastName,
    prefix: resident.prefix || null,
    suffix: resident.suffix || null,

    nationality: resident.nationality,
    birthdate: formatDateOnly(resident.birthDate),
    gender: resident.gender,
    civil_status: resident.civilStatus,
    blood_type: resident.bloodType || null,

    is_voter: !!resident.isVoter,
    is_pwd: !!resident.isPWD,
    is_employed: !!resident.isEmployed,
    is_student: !!resident.isStudent,

    precint_number: resident.precintID || null,
    email_address: resident.emailAddress || null,
    contact_number: formatPHContact(resident.contactNumber) || null,
    emergency_contact_full_name: resident.emergencyContactFullName || null,
    emergency_contact_number:
      formatPHContact(resident.emergencyContactNumber) || null,

    alagang_valmocina_id: resident.alagangValmocinaID,

    gis_region_id: selectedRegion?.regionId,
    gis_province_id: selectedProvince?.provinceId,
    gis_municipality_id: selectedMunicipality?.municipalityId,
    gis_barangay_id: selectedBarangay?.barangayId, // ✅ REQUIRED

    // ✅ REQUIRED
    street_address_line: streetAddressLine,

    identificationCards: identificationCards
      .filter((c) => c.idTypeId && c.idNumber)
      .map((c) => ({
        idTypeId: c.idTypeId,
        idNumber: c.idNumber.trim(),
      })),
  };
}
