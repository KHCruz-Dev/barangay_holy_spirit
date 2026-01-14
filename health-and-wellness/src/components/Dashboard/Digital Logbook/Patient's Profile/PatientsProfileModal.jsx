import React, { useState, useEffect, useMemo, useReducer, useRef } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaCamera,
  FaUserEdit,
  FaUser,
  FaMapMarkerAlt,
  FaPuzzlePiece,
  FaIdCard,
  FaPhoneAlt,
  FaAddressCard,
} from "react-icons/fa";

import NonResidentAddressSection from "./sections/NonResidentAddressSection.jsx";
import { buildNonResidentPayload } from "./utils/buildNonResidentPayload";
import {
  makeEmptyNonResident,
  mapExistingNonResidentToForm,
} from "./utils/nonResidentFormMapper";

import ComboBoxFloatingLabel from "../../../Common/ComboFloatingLabel.jsx";

// Import GIS Data
import {
  getAllRegions,
  getAllProvince,
  getAllMunicipality,
  getAllBarangay,
  getAllSubdivision,
  getAllStreets,
} from "../../../../config/services/gis/gisService.js";

// Import HRIS Data
import {
  getAllCivilStatus,
  getAllGenders,
  getAllNamePrefix,
  getAllNameSuffx,
  getAllNationalities,
  getAllHrisIdTypes,
} from "../../../../config/services/hris/hrisService.js";

// Import HAW Data
import {
  getAllBloodTypes,
  getAllServices,
} from "../../../../config/services/haw/hawService.js";

// Import ID Generator Helper
import { generateBarangayResidentId } from "../../../../utils/idHelpers";

// Import Image Capture and Upload functions
import { useAvatarCaptureUpload } from "../../../../hooks/useAvatarCaptureUpload.js";

// Import QR Code
import QRCode from "react-qr-code";
import DefaultAvatar from "../../../../assets/images/default-avatar.png";

import PatientsProfileReviewModal from "./PatientsProfileReviewModal.jsx";

// Contact Number Formatters
import { formatPHContact } from "../../../../utils/patientFormatters.js";

// Patient Form Validation
import { usePatientValidation } from "./hooks/usePatientValidation.js";

// Calculate date from age
import { calculateAgeFromDate } from "../../../../utils/calculateAgeFromDate";

// Dynamic Export to ID
import DynamicIdentificationCards from "../../../Common/DynamicIdentificationCards";

// Sections
// Personal Information Section
import PersonalInfoSection from "./sections/PersonalInfoSection";

// Contact Section
import ContactSection from "./sections/ContactSection";

// Identification Cards Section
import IdentificationCardsSection from "./sections/IdentificationCardsSection";

// Address Section
import AddressSection from "./sections/AddressSection";

// Other Information Section
import OtherInformationSection from "./sections/OtherInformationSection";

// Payload for API
import { buildResidentPayload } from "./utils/buildResidentPayload";

// Import Reducers
import { residentReducer, RESIDENT_ACTIONS } from "./reducers/residentReducer";

// Make Empty Resident Form and Map Existing Resident after Click
import {
  makeEmptyResident,
  mapExistingResidentToForm,
} from "./utils/residentFormMapper";

// ID Card Reducer
import {
  identificationCardsReducer,
  ID_CARDS_ACTIONS,
  idCardsInitialState,
} from "./reducers/identificationCardsReducer";

// Proper Casing Formmater
import { toProperCase } from "../../../../utils/stringFormatters.js";

// Alagang Valmocina ID Section
import { ROLES } from "../../../../config/navigation/roles.js";
import { useAuth } from "../../../../context/authContext.jsx";
import AlagangValmocinaIdSection from "./sections/AlagangValmocinaIdSection";
import IDFront from "../../../IDCard/IDFront";
import IDBack from "../../../IDCard/IDBack";
import { exportToJpg } from "../../../../utils/exportIdToJpg";
import { exportA4ToJpg } from "../../../../utils/exportA4ToJpg";
import GenerateIDPreview from "../../../IDCard/GenerateIDPreview.jsx";
import { waitForImages } from "../../../../utils/waitForImages";
import GenerateIDBackPreview from "../../../IDCard/GenerateIDBackPreview.jsx";

// ID Status Update
import { updateResidentIdStatus } from "../../../../config/services/residentsIdStatusService";

// Component Start
const PatientsProfileModal = ({
  isOpen,
  onClose,
  existingResident,
  onSaved,
  recordType = "RESIDENT",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Review Modal Visibility
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Avatar image preview (default is your placeholder)
  const {
    avatarPreview,
    avatarFile,
    isCameraOpen,

    // ✅ ADD THESE
    videoDevices,
    selectedDeviceId,
    switchCamera,

    // refs
    videoRef,
    canvasRef,
    fileInputRef,

    // actions
    handleUploadClick,
    handleFileChange,
    openCamera,
    closeCamera,
    handleCapture,
    resetAvatar,
  } = useAvatarCaptureUpload(
    typeof existingResident?.img_url === "string" &&
      existingResident.img_url.trim() !== ""
      ? existingResident.img_url
      : DefaultAvatar
  );

  // variables for dropdown
  //// HRIS Data
  const [gendersData, setGendersData] = useState([]);
  const [nationalityData, setNationalityData] = useState([]);
  const [suffixData, setSuffixData] = useState([]);
  const [prefixData, setPrefixData] = useState([]);
  const [civilStatusData, setCivilStatusData] = useState([]);
  const [idTypeOptions, setIdTypeOptions] = useState([]);

  //// GIS Data
  const [regionData, setRegionData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [municipalityData, setMunicipalityData] = useState([]);
  const [barangayData, setBarangayData] = useState([]);
  const [subdivisionData, setsubdivisionData] = useState([]);
  const [streetData, setStreetData] = useState([]);

  //// HAW Data
  const [bloodTypeData, setBloodTypeData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  // Review State
  const [residentForReview, setResidentForReview] = useState(null);

  const isEditMode = Boolean(existingResident?.id);

  const API_URL = import.meta.env.VITE_API_URL;

  const isNonResident = recordType === "NON_RESIDENT";
  const baseUrl = isNonResident
    ? `${API_URL}/api/nonResidentsProfile`
    : `${API_URL}/api/residentsProfile`;

  const [safeAvatarSrc, setSafeAvatarSrc] = useState(
    avatarPreview || DefaultAvatar
  );

  // User Roles for ID Details Section
  // 🔐 Role-based access for Alagang Valmocina ID section
  // 🔐 Role-based access for Alagang Valmocina ID section
  const { user } = useAuth();

  // Normalize role(s) from backend (supports role or roles)
  const normalizeRoles = (user) => {
    if (!user) return [];

    // Backend sends single role string
    if (typeof user.role === "string") {
      return [user.role];
    }

    // Future-proof: backend sends array
    if (Array.isArray(user.roles)) {
      return user.roles;
    }

    return [];
  };

  const userRoles = normalizeRoles(user);

  const canManageID =
    userRoles.includes(ROLES.ADMINISTRATOR) ||
    userRoles.includes(ROLES.ID_PRINTER);

  const a4FrontRef = useRef(null);
  const a4BackRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const a4Ref = useRef(null);

  const handleGenerateID = async () => {
    try {
      // FRONT
      if (!a4FrontRef.current || !a4BackRef.current) {
        alert("ID preview not ready.");
        return;
      }

      await waitForImages(a4FrontRef.current);
      await new Promise((r) => requestAnimationFrame(r));
      await exportA4ToJpg(
        a4FrontRef,
        `${newResident.alagangValmocinaID}-FRONT-A4.jpg`
      );

      // BACK
      await waitForImages(a4BackRef.current);
      await new Promise((r) => requestAnimationFrame(r));
      await exportA4ToJpg(
        a4BackRef,
        `${newResident.alagangValmocinaID}-BACK-A4.jpg`
      );

      alert("Front and Back IDs generated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate ID files.");
    }
  };

  // load Dropdowns
  useEffect(() => {
    const mapToOptions = (rows, key) =>
      rows.map((row) => ({
        label: row[key],
        value: row[key]?.trim(),
      }));

    async function loadDropdowns() {
      try {
        const [
          genders,
          civilStatus,
          prefixes,
          suffixes,
          nationalities,
          bloodTypes,
          services,
          regions,
          province,
          municipality,
          barangay,
          subdivision,
          street,
          idTypes,
        ] = await Promise.all([
          getAllGenders(),
          getAllCivilStatus(),
          getAllNamePrefix(),
          getAllNameSuffx(),
          getAllNationalities(),
          getAllBloodTypes(),
          getAllServices(),
          getAllRegions(),
          getAllProvince(),
          getAllMunicipality(),
          getAllBarangay(),
          getAllSubdivision(),
          getAllStreets(),
          getAllHrisIdTypes(),
        ]);

        // HRIS
        setGendersData(mapToOptions(genders, "gender"));
        setCivilStatusData(mapToOptions(civilStatus, "civil_status"));
        setPrefixData(mapToOptions(prefixes, "prefix_category"));
        setSuffixData(mapToOptions(suffixes, "suffix_category")); // this will follow your Mr/Mrs/Mx ORDER BY
        setNationalityData(mapToOptions(nationalities, "nationality"));

        // HAW
        setBloodTypeData(mapToOptions(bloodTypes, "blood_type"));
        setServiceData(mapToOptions(services, "service_name"));

        // GIS
        setRegionData(
          regions.map((row) => ({
            label: row.region, // shown in dropdown
            value: row.region, // stored in newResident.region
            regionId: row.id, // used for filtering
          }))
        );

        setProvinceData(
          province.map((row) => ({
            label: row.province_name,
            value: row.province_name,
            provinceId: row.id,
            regionId: row.region_id, // FK → gis_regions.id
          }))
        );

        setMunicipalityData(
          municipality.map((row) => ({
            label: row.municipality_name,
            value: row.municipality_name,
            municipalityId: row.id,
            provinceId: row.province_id, // FK → gis_province.id
            regionId: row.region_id, // (if you have this)
          }))
        );

        setBarangayData(
          barangay.map((row) => ({
            label: row.barangay_name,
            value: row.barangay_name,
            barangayId: row.id,
            municipalityId: row.municipality_id,
            provinceId: row.province_id,
            regionId: row.region_id,
          }))
        );

        setsubdivisionData(
          subdivision.map((row) => ({
            label: row.subdivision_name,
            value: row.subdivision_name,
            subdivisionId: row.id,
            barangayId: row.barangay_id,
            municipalityId: row.municipality_id,
            provinceId: row.province_id,
            regionId: row.region_id,
          }))
        );

        setStreetData(
          street.map((row) => ({
            label: row.street_name,
            value: row.street_name,
            streetId: row.id,
            barangayId: row.barangay_id,
            subdivisionId: row.subdivision_id,
            municipalityId: row.municipality_id,
            provinceId: row.province_id,
            regionId: row.region_id,
          }))
        );

        // ID Types Option
        setIdTypeOptions(
          idTypes.map((row) => ({
            label: row.id_type, // what user sees
            value: row.id, // FK that will be saved later
          }))
        );
      } catch (error) {
        console.error("Error loading dropdown master data:", error);
      }
    }

    loadDropdowns();
  }, []);

  //Resident Reducer
  const [newResident, dispatchResident] = useReducer(
    residentReducer,
    existingResident
      ? isNonResident
        ? mapExistingNonResidentToForm(existingResident)
        : mapExistingResidentToForm(existingResident)
      : isNonResident
      ? makeEmptyNonResident(generateBarangayResidentId())
      : makeEmptyResident(generateBarangayResidentId())
  );

  const [identificationCards, dispatchIdCards] = useReducer(
    identificationCardsReducer,
    idCardsInitialState
  );

  // Toggles
  const toggleField = (field) => {
    dispatchResident({
      type: RESIDENT_ACTIONS.SET_FIELD,
      field,
      value: !newResident[field],
    });
  };

  // Validation state
  // const {
  //   errors,
  //   validateAll,
  //   setFieldError,
  //   clearFieldError, // ✅
  //   handleBlur,
  //   validationCount,
  //   showValidationSummary,
  //   resetValidation,
  // } = usePatientValidation(newResident);

  const {
    errors,
    validateAll,
    handleBlur,
    validationCount,
    showValidationSummary,
    resetValidation,
    clearFieldError,
  } = usePatientValidation();

  // 🧠 Cascading filtered options based on selection
  const filteredProvinces = useMemo(() => {
    if (!newResident.region) return [];
    const selectedRegion = regionData.find(
      (r) => r.value === newResident.region
    );
    if (!selectedRegion) return [];
    return provinceData.filter((p) => p.regionId === selectedRegion.regionId);
  }, [newResident.region, regionData, provinceData]);

  const filteredMunicipalities = useMemo(() => {
    if (!newResident.province) return [];
    const selectedProvince = provinceData.find(
      (p) => p.value === newResident.province
    );
    if (!selectedProvince) return [];
    return municipalityData.filter(
      (m) => m.provinceId === selectedProvince.provinceId
    );
  }, [newResident.province, provinceData, municipalityData]);

  const filteredBarangays = useMemo(() => {
    if (!newResident.cityMunicipality) return [];
    const selectedMunicipality = municipalityData.find(
      (m) => m.value === newResident.cityMunicipality
    );
    if (!selectedMunicipality) return [];
    return barangayData.filter(
      (b) => b.municipalityId === selectedMunicipality.municipalityId
    );
  }, [newResident.cityMunicipality, municipalityData, barangayData]);

  const filteredSubdivisions = useMemo(() => {
    if (!newResident.barangay) return [];
    const selectedBarangay = barangayData.find(
      (b) => b.value === newResident.barangay
    );
    if (!selectedBarangay) return [];
    return subdivisionData.filter(
      (s) => s.barangayId === selectedBarangay.barangayId
    );
  }, [newResident.barangay, barangayData, subdivisionData]);

  const filteredStreets = useMemo(() => {
    if (!newResident.subdivisionVillage) return [];
    const selectedSubdivision = subdivisionData.find(
      (s) => s.value === newResident.subdivisionVillage
    );
    if (!selectedSubdivision) return [];
    return streetData.filter(
      (st) => st.subdivisionId === selectedSubdivision.subdivisionId
    );
  }, [newResident.subdivisionVillage, subdivisionData, streetData]);

  const handleClose = () => {
    closeCamera();
    setIsSaving(false); // 🔓 ensure unlock
    setIsVisible(false);
    setTimeout(() => onClose(), 200);
    resetAvatar();
    dispatchIdCards({ type: ID_CARDS_ACTIONS.RESET });
  };

  useEffect(() => {
    if (isOpen) {
      // Delay setting visible to trigger animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setIsSaving(false);

    // 🧠 RESET FORM
    if (existingResident) {
      dispatchResident({
        type: RESIDENT_ACTIONS.RESET,
        payload: isNonResident
          ? mapExistingNonResidentToForm(existingResident)
          : mapExistingResidentToForm(existingResident),
      });
    } else {
      dispatchResident({
        type: RESIDENT_ACTIONS.RESET,
        payload: isNonResident
          ? makeEmptyNonResident(generateBarangayResidentId())
          : makeEmptyResident(generateBarangayResidentId()),
      });
    }

    // 🪪 RESET ID CARDS
    dispatchIdCards({ type: ID_CARDS_ACTIONS.RESET });

    // ✅ FIX: correct key from backend
    if (existingResident?.identificationCards?.length) {
      dispatchIdCards({
        type: ID_CARDS_ACTIONS.SET_ALL,
        payload: existingResident.identificationCards.map((c) => ({
          idTypeId: c.idTypeId,
          idNumber: c.idNumber,
        })),
      });
    }

    setResidentForReview(null);
    resetValidation();
  }, [isOpen, existingResident]);

  const handleContactBlur = (field) => {
    const raw = newResident[field];
    const formatted = formatPHContact(raw);

    if (formatted !== raw) {
      dispatchResident({
        type: RESIDENT_ACTIONS.SET_FIELD,
        field,
        value: formatted,
      });
    }

    handleBlur(field); // keep validation
  };

  const updateResident = (field) => (e) => {
    let value = e?.target ? e.target.value : e;

    if (field === "contactNumber" || field === "emergencyContactNumber") {
      value = (value || "").replace(/\D/g, "");
      if (value.length > 9) value = value.slice(0, 9);
    }

    if (value === "" || value === null) value = undefined;

    dispatchResident({
      type: RESIDENT_ACTIONS.SET_FIELD,
      field,
      value,
    });

    // ✅ ONLY clear error, NEVER validate on change
    clearFieldError(field);
  };

  const cascadeAddressChange = (payload) => {
    dispatchResident({
      type: RESIDENT_ACTIONS.SET_MANY,
      payload,
    });
  };

  const handleRegionChange = (value) => {
    cascadeAddressChange({
      region: value || undefined,
      province: undefined,
      cityMunicipality: undefined,
      barangay: undefined,
      subdivisionVillage: undefined,
      streetRoad: undefined,
    });

    if (value) clearFieldError("region");
  };

  useEffect(() => {
    setSafeAvatarSrc(avatarPreview || DefaultAvatar);
  }, [avatarPreview]);

  // Province change: reset city/municipality ↓
  const handleProvinceChange = (value) => {
    cascadeAddressChange({
      province: value || undefined,
      cityMunicipality: undefined,
      barangay: undefined,
      subdivisionVillage: undefined,
      streetRoad: undefined,
    });

    if (value) clearFieldError("province");
  };

  // City/Municipality change: reset barangay ↓
  const handleMunicipalityChange = (value) => {
    cascadeAddressChange({
      cityMunicipality: value || undefined,
      barangay: undefined,
      subdivisionVillage: undefined,
      streetRoad: undefined,
    });

    if (value) clearFieldError("cityMunicipality");
  };

  // Barangay change: reset subdivision/street ↓
  const handleBarangayChange = (value) => {
    cascadeAddressChange({
      barangay: value || undefined,
      subdivisionVillage: undefined,
      streetRoad: undefined,
    });
    if (value) clearFieldError("barangay");
  };

  // Subdivision change: reset street ↓
  const handleSubdivisionChange = (value) => {
    cascadeAddressChange({
      subdivisionVillage: value || undefined,
      streetRoad: undefined,
    });

    if (value) clearFieldError("subdivisionVillage");
  };

  // Street change: just update + validate
  const handleStreetChange = (value) => {
    cascadeAddressChange({
      streetRoad: value || undefined,
    });

    if (value) clearFieldError("streetRoad");
  };

  // ID Handlers
  const addIdentificationCard = () => {
    dispatchIdCards({ type: ID_CARDS_ACTIONS.ADD });
  };

  const removeIdentificationCard = (index) => {
    dispatchIdCards({
      type: ID_CARDS_ACTIONS.REMOVE,
      index,
    });
  };

  const updateIdentificationCard = (index, field, value) => {
    dispatchIdCards({
      type: ID_CARDS_ACTIONS.UPDATE,
      index,
      field,
      value,
    });
  };

  const handleNameBlur = (field) => {
    const raw = newResident[field];
    if (!raw) return;

    const formatted = toProperCase(raw);

    if (formatted !== raw) {
      dispatchResident({
        type: RESIDENT_ACTIONS.SET_FIELD,
        field,
        value: formatted,
      });
    }

    handleBlur(field); // keep validation behavior
  };

  // Helper: format PH contact for backend (+63)

  // Format PH contact number: add +63 *without* replacing the digits
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { count } = validateAll();

    // If there are validation errors, do NOT open review modal
    if (count > 0) {
      return;
    }

    const reviewIdentificationCards = identificationCards
      .filter((c) => c.idTypeId && c.idNumber)
      .map((c) => {
        const match = idTypeOptions.find((o) => o.value === c.idTypeId);

        return {
          idTypeId: c.idTypeId,
          idTypeLabel: match?.label || "Unknown ID",
          idNumber: c.idNumber.trim(),
        };
      });

    const formattedContact = formatPHContact(newResident.contactNumber);

    const reviewResident = {
      ...newResident,
      contactNumber: formattedContact,
      identificationCards: reviewIdentificationCards, // ✅ THIS WAS MISSING

      // 🔑 CRITICAL: preserve non-resident street line
      streetAddressLine: isNonResident
        ? newResident.streetAddressLine
        : undefined,

      // 🔑 Flag for review modal formatting
      is_non_resident: isNonResident,
    };

    // Do NOT update newResident here (keep it as raw 10 digits)
    setResidentForReview(reviewResident);

    // Now open the review modal
    setIsReviewOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const payload = isNonResident
        ? buildNonResidentPayload({
            resident: newResident,
            identificationCards,
            regionData,
            provinceData,
            municipalityData,
            barangayData,
          })
        : buildResidentPayload({
            resident: newResident,
            identificationCards,
            regionData,
            provinceData,
            municipalityData,
            barangayData,
            subdivisionData,
            streetData,
          });

      // 🔥 STEP 4 FIX — ADD VS EDIT LOGIC
      const url = isEditMode ? `${baseUrl}/${existingResident.id}` : baseUrl;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Save failed");
      }

      const saved = await response.json();
      const residentId = isEditMode ? existingResident.id : saved.id;

      // 📸 Upload avatar ONLY if changed
      if (avatarFile && residentId) {
        const photoForm = new FormData();
        photoForm.append("photo", avatarFile);

        await fetch(`${baseUrl}/${residentId}/photo`, {
          method: "POST",
          credentials: "include",
          body: photoForm,
        });
      }

      alert(
        isEditMode
          ? "Resident record has been updated."
          : "Resident record has been created."
      );

      setIsReviewOpen(false);
      await onSaved?.();
      handleClose(); // ❌ close modal
    } catch (err) {
      console.error("Failed to save resident:", err);
      alert("Unexpected error while saving resident.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelReview = () => {
    setIsReviewOpen(false);
    setResidentForReview(null); // optional, just to clean up
  };

  const cameraOptions = useMemo(() => {
    return videoDevices.map((cam) => ({
      label: cam.label || "Camera",
      value: cam.deviceId,
    }));
  }, [videoDevices]);

  // Update Alagang Valmocina ID Status
  const handleUpdateIdStatus = async () => {
    try {
      // 🛑 Safety checks
      if (!existingResident?.id) {
        alert("Please save the resident first.");
        return;
      }

      if (!newResident.idStatus) {
        alert("Please select an ID status.");
        return;
      }

      // 🔥 API call
      await updateResidentIdStatus(existingResident.id, newResident.idStatus);

      alert("ID status updated successfully.");

      // 🔄 refresh parent list
      await onSaved?.();
    } catch (err) {
      console.error("Update ID status error:", err);
      alert(err.message || "Failed to update ID status.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed 
        inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 
        transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-100"
        }`}
    >
      <div
        className={`relative bg-white rounded-lg shadow-lg max-w-6xl w-full transform transition-all duration-200 p-6 pt-14 pr-16
          ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <button
          className={`absolute top-4 right-4 z-20 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 transition-all duration-200 ${
            isSaving
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-500 hover:bg-red-500 hover:text-white"
          }`}
          onClick={handleClose}
          disabled={isSaving}
          aria-label="Close"
        >
          <IoClose className="w-5 h-5 transform transition-transform duration-200 hover:scale-110" />
        </button>

        {/* LAYOUT SHELL — DO NOT TOUCH FORM INSIDE */}
        <div className="flex flex-row gap-6 max-h-[80vh] overflow-hidden lg:items-start items-stretch max-lg:flex-col">
          {/* Left column */}
          <div className="w-full lg:w-[200px] shrink-0 max-lg:static">
            {/* Desktop-only vertical centering shell */}
            <div className="lg:flex lg:min-h-[80vh] lg:items-center">
              {/* CONTENT (visible on ALL sizes) */}
              <div className="flex flex-col gap-4 w-full">
                {/* Top divider */}
                <div className="border-t-2 border-green-900" />

                {/* AVATAR + QR — UNCHANGED */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start lg:flex-col">
                  {/* Avatar */}
                  <div className="flex flex-col items-center justify-center md:w-1/2 lg:w-full">
                    {!isCameraOpen ? (
                      <img
                        src={safeAvatarSrc}
                        crossOrigin="anonymous"
                        alt="Patient"
                        className="w-32 h-32 rounded-sm object-cover border-4 border-green-900"
                        onError={() => {
                          setSafeAvatarSrc(DefaultAvatar);
                        }}
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-32 h-32 rounded-sm object-cover border-4 border-green-900 bg-black"
                      />
                    )}

                    <canvas ref={canvasRef} className="hidden" />

                    {/* Buttons */}
                    <div className="w-full flex flex-col gap-2 mt-2">
                      {/* Upload button */}
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="w-full text-sm font-semibold text-green-900 py-2 rounded-lg border border-green-900 bg-white hover:bg-green-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <FaCamera />
                        Upload Picture
                      </button>

                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {/*Camera Selection */}
                      {isCameraOpen && cameraOptions.length > 1 && (
                        <div className="mt-2 w-full">
                          <ComboBoxFloatingLabel
                            id="camera-device"
                            label="Camera Device"
                            options={cameraOptions}
                            value={selectedDeviceId}
                            onChange={(deviceId) => {
                              if (deviceId) switchCamera(deviceId);
                            }}
                            requireMatch
                          />
                        </div>
                      )}

                      {/* If camera is NOT open → show Take New Picture button */}
                      {!isCameraOpen && (
                        <button
                          type="button"
                          onClick={openCamera}
                          className="w-full text-sm font-semibold text-green-900 py-2 rounded-lg border border-green-900 bg-white hover:bg-green-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <FaCamera />
                          Take New Picture
                        </button>
                      )}

                      {/* If camera IS open → show Capture / Cancel */}
                      {isCameraOpen && (
                        <div className="flex gap-3 mt-2 w-full">
                          <button
                            type="button"
                            onClick={closeCamera}
                            className="flex-1 text-sm font-semibold text-red-700 py-2 rounded-lg border border-red-700 bg-white
        hover:bg-red-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={handleCapture}
                            className="flex-1 text-sm font-semibold text-green-800 py-2 rounded-lg border border-green-900 bg-white
        hover:bg-green-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          >
                            Capture
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QR */}
                  <div className="md:w-1/2 lg:w-full">
                    <div className="bg-green-900 border border-green-900 rounded-xl w-full flex flex-col items-center justify-center p-3">
                      <div className="bg-white p-2 rounded border">
                        <QRCode
                          value={newResident.alagangValmocinaID || ""}
                          size={128}
                        />
                      </div>

                      <span className="text-sm text-white text-center mt-3">
                        Alagang Valmocina ID:
                      </span>
                      <span className="text-sm font-semibold text-white text-center tracking-widest mt-1">
                        {newResident.alagangValmocinaID}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom divider */}
                <div className="border-t-2 border-green-900" />
              </div>
            </div>
          </div>

          {/* Right column – form */}
          <div className="flex-1 overflow-y-auto pr-2 lg:max-h-[80vh] max-lg:max-h-none">
            <form
              onSubmit={handleFormSubmit}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 w-full"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center">
                    <FaUserEdit className="text-white w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 leading-tight">
                      {isEditMode
                        ? isNonResident
                          ? "Update Non-Resident Record"
                          : "Update Resident Record"
                        : isNonResident
                        ? "Add Non-Resident Record"
                        : "Add Resident Record"}
                    </h2>

                    <p className="text-xs text-gray-500">
                      {isEditMode
                        ? isNonResident
                          ? "Modify existing non-resident information"
                          : "Modify existing resident information"
                        : isNonResident
                        ? "Create a new non-resident profile"
                        : "Create a new health & wellness resident profile"}
                    </p>
                  </div>
                </div>

                {/* Mode badge */}
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    isEditMode
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isEditMode ? "EDIT MODE" : "NEW RECORD"}
                </span>
              </div>

              {/* 🧍 Personal Information */}

              <PersonalInfoSection
                resident={newResident}
                errors={errors}
                handleBlur={handleBlur}
                updateResident={updateResident}
                calculateAgeFromDate={calculateAgeFromDate}
                prefixData={prefixData}
                suffixData={suffixData}
                gendersData={gendersData}
                civilStatusData={civilStatusData}
                nationalityData={nationalityData}
                bloodTypeData={bloodTypeData}
                showValidationSummary={showValidationSummary}
                handleNameBlur={handleNameBlur}
              />

              {/* 🌐 Contact */}
              <ContactSection
                resident={newResident}
                errors={errors}
                handleContactBlur={handleContactBlur}
                updateResident={updateResident}
              />

              {/* 🌐 Identification Cards */}
              <IdentificationCardsSection
                identificationCards={identificationCards}
                idTypeOptions={idTypeOptions}
                onAdd={addIdentificationCard}
                onRemove={removeIdentificationCard}
                onChange={updateIdentificationCard}
              />

              {/* 🌐 Address */}
              {isNonResident ? (
                <NonResidentAddressSection
                  resident={newResident}
                  errors={errors}
                  handleBlur={handleBlur}
                  regionData={regionData}
                  provinceOptions={filteredProvinces}
                  municipalityOptions={filteredMunicipalities}
                  barangayOptions={filteredBarangays} // ✅ ADD
                  handleRegionChange={handleRegionChange}
                  handleProvinceChange={handleProvinceChange}
                  handleMunicipalityChange={handleMunicipalityChange}
                  handleBarangayChange={handleBarangayChange} // ✅ ADD
                  updateResident={updateResident}
                />
              ) : (
                <AddressSection
                  resident={newResident}
                  errors={errors}
                  handleBlur={handleBlur}
                  regionData={regionData}
                  provinceOptions={filteredProvinces}
                  municipalityOptions={filteredMunicipalities}
                  barangayOptions={filteredBarangays}
                  subdivisionOptions={filteredSubdivisions}
                  streetOptions={filteredStreets}
                  handleRegionChange={handleRegionChange}
                  handleProvinceChange={handleProvinceChange}
                  handleMunicipalityChange={handleMunicipalityChange}
                  handleBarangayChange={handleBarangayChange}
                  handleSubdivisionChange={handleSubdivisionChange}
                  handleStreetChange={handleStreetChange}
                  updateResident={updateResident}
                />
              )}

              {/* 🧩 Other Information */}
              <OtherInformationSection
                isVoter={newResident.isVoter}
                isPWD={newResident.isPWD}
                isEmployed={newResident.isEmployed}
                isStudent={newResident.isStudent}
                onToggleVoter={() => toggleField("isVoter")}
                onTogglePWD={() => toggleField("isPWD")}
                onToggleEmployed={() => toggleField("isEmployed")}
                onToggleStudent={() => toggleField("isStudent")}
              />

              <AlagangValmocinaIdSection
                canManageID={canManageID}
                idStatus={newResident.idStatus}
                dispatchResident={dispatchResident}
                onGenerateID={handleGenerateID}
                onUpdateStatus={handleUpdateIdStatus}
              />

              {/* ✅ Submit */}
              <div className="col-span-full mt-4">
                {/* Validation summary */}
                {showValidationSummary && validationCount > 0 && (
                  <div className="w-full mb-1 text-right text-sm text-red-600">
                    There {validationCount === 1 ? "is" : "are"}{" "}
                    <span className="font-semibold">{validationCount}</span>{" "}
                    validation {validationCount === 1 ? "issue" : "issues"} that
                    must be fixed before review.
                  </div>
                )}

                {/* Buttons row */}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="text-sm font-semibold text-green-800 py-2 px-6 rounded-lg border border-green-900 bg-white hover:bg-green-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2"
                  >
                    <FaUserEdit className="transition-transform duration-300 group-hover:scale-110" />
                    {isSaving
                      ? "Saving..."
                      : isEditMode
                      ? "Update Resident Record"
                      : "Add Resident Record"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <hr className="my-4 border-gray-400" />
      </div>

      <PatientsProfileReviewModal
        isOpen={isReviewOpen}
        onClose={handleCancelReview}
        onConfirm={handleConfirmSubmit}
        isSaving={isSaving}
        isEditMode={isEditMode} // ✅ ADD THIS
        resident={residentForReview || newResident}
        avatarPreview={avatarPreview}
      />

      <div className="fixed -left-[99999px] top-0 pointer-events-none">
        <GenerateIDPreview
          ref={a4FrontRef}
          resident={newResident}
          avatar={avatarPreview}
        />
        <GenerateIDBackPreview ref={a4BackRef} resident={newResident} />
      </div>
    </div>
  );
};

export default PatientsProfileModal;
