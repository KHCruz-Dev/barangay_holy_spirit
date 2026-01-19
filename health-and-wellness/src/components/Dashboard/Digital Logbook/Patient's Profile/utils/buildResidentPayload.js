import {
  formatPHContact,
  formatDateOnly,
} from "../../../../../utils/patientFormatters";

export function buildResidentPayload({
  resident,
  identificationCards,
  regionData,
  provinceData,
  municipalityData,
  barangayData,
  subdivisionData,
  streetData,
}) {
  const formattedContact = formatPHContact(resident.contactNumber);
  const formattedEmergencyContact = formatPHContact(
    resident.emergencyContactNumber
  );

  return {
    // 🧍 Basic Info
    first_name: resident.firstName,
    middle_name: resident.middleName,
    last_name: resident.lastName,
    prefix: resident.prefix?.trim() || null,
    suffix: resident.suffix?.trim() || null,

    nationality: resident.nationality,
    birthdate: formatDateOnly(resident.birthDate),
    gender: resident.gender,
    civil_status: resident.civilStatus,
    blood_type: resident.bloodType || null,

    // 🧩 Flags
    is_voter: !!resident.isVoter,
    is_pwd: !!resident.isPWD,
    is_employed: !!resident.isEmployed,
    is_student: !!resident.isStudent,

    // ☎ Contact
    precint_number: resident.precintID || null,
    email_address: resident.emailAddress || null,
    contact_number: formattedContact || null,
    emergency_contact_full_name: resident.emergencyContactFullName || null,
    emergency_contact_number: formattedEmergencyContact || null,

    // 🪪 IDs
    alagang_valmocina_id: resident.alagangValmocinaID,
    voters_id_number: resident.votersID || null,
    sss_gsis_number: resident.sssGsisID || null,
    tin_id_number: resident.tinID || null,
    pagibig_id_number: resident.pagIbigID || null,
    prc_id_number: resident.prcID || null,
    drivers_license_id_number: resident.driversLicense || null,

    is_id_printed: false,

    // 📍 GIS (DIRECT IDS)
    gis_region_id: resident.regionId,
    gis_province_id: resident.provinceId,
    gis_municipality_id: resident.municipalityId,
    gis_barangay_id: resident.barangayId,
    gis_subdivision_id: resident.subdivisionId,
    gis_streets_id: resident.streetId,
    gis_street_number: resident.streetNumber?.trim() || null,

    // 🪪 Dynamic Identification Cards
    identificationCards: identificationCards
      .filter((c) => c.idTypeId && c.idNumber)
      .map((c) => ({
        idTypeId: c.idTypeId,
        idNumber: c.idNumber.trim(),
      })),
  };
}
