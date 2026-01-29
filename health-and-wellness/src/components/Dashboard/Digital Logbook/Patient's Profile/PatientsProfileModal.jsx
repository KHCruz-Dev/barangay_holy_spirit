import React, { useState, useEffect, useMemo, useReducer, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaCamera, FaUserEdit } from "react-icons/fa";

import NonResidentAddressSection from "./sections/NonResidentAddressSection.jsx";
import { buildNonResidentPayload } from "./utils/buildNonResidentPayload";
import {
  makeEmptyNonResident,
  mapExistingNonResidentToForm,
} from "./utils/nonResidentFormMapper";

import ComboBoxFloatingLabel from "../../../Common/ComboFloatingLabel.jsx";

// Import ID Generator Helper
import { generateBarangayResidentId } from "../../../../utils/idHelpers";

// Import QR Code
import QRCode from "react-qr-code";

import PatientsProfileReviewModal from "./PatientsProfileReviewModal.jsx";

// Contact Number Formatters
import { formatPHContact } from "../../../../utils/patientFormatters.js";

// Patient Form Validation
import { usePatientValidation } from "./hooks/usePatientValidation.js";

// Calculate date from age
import { calculateAgeFromDate } from "../../../../utils/calculateAgeFromDate";

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
import { useAuth } from "../../../../context/authContext.jsx";
import AlagangValmocinaIdSection from "./sections/AlagangValmocinaIdSection";
import { exportA4ToJpg } from "../../../../utils/exportA4ToJpg";
import GenerateIDPreview from "../../../IDCard/GenerateIDPreview.jsx";
import { waitForImages } from "../../../../utils/waitForImages";
import GenerateIDBackPreview from "../../../IDCard/GenerateIDBackPreview.jsx";

// ID Status Update
import { updateResidentIdStatus } from "../../../../config/services/residentsIdStatusService";

import { useMasterData } from "./hooks/useMasterData.js";
import { useRoleAccess } from "./hooks/useRoleAccess";
import { useCascadingAddress } from "./hooks/useCascadingAddress";

import { useResidentSubmit } from "./hooks/useResidentSubmit";

import { useResidentAvatar } from "./hooks/useResidentAvatar";

// Component Start
const PatientsProfileModal = ({
  isOpen,
  onClose,
  existingResident,
  onSaved,
  recordType = "RESIDENT",
  recordSubType = "DEFAULT",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Review Modal Visibility
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // variables for dropdown
  const { hris, haw, gis } = useMasterData();

  const gendersData = useMemo(
    () =>
      hris.genders?.map((g) => ({ label: g.gender, value: g.gender })) ?? [],
    [hris.genders],
  );

  const civilStatusData = useMemo(
    () =>
      hris.civilStatus?.map((c) => ({
        label: c.civil_status,
        value: c.civil_status,
      })) ?? [],
    [hris.civilStatus],
  );

  const prefixData = useMemo(
    () =>
      hris.prefixes?.map((p) => ({
        label: p.prefix_category,
        value: p.prefix_category,
      })) ?? [],
    [hris.prefixes],
  );

  const suffixData = useMemo(
    () =>
      hris.suffixes?.map((s) => ({
        label: s.suffix_category,
        value: s.suffix_category,
      })) ?? [],
    [hris.suffixes],
  );

  const nationalityData = useMemo(
    () =>
      hris.nationalities?.map((n) => ({
        label: n.nationality,
        value: n.nationality,
      })) ?? [],
    [hris.nationalities],
  );

  const bloodTypeData = useMemo(
    () =>
      haw.bloodTypes?.map((b) => ({
        label: b.blood_type,
        value: b.blood_type,
      })) ?? [],
    [haw.bloodTypes],
  );

  const idTypeOptions = useMemo(
    () =>
      hris.idTypes?.map((id) => ({
        label: id.id_type,
        value: id.id,
      })) ?? [],
    [hris.idTypes],
  );

  const regionData = useMemo(
    () =>
      gis.regions?.map((r) => ({
        label: r.region,
        value: r.id, // ✅ ID
      })) ?? [],
    [gis.regions],
  );

  const provinceData = useMemo(
    () =>
      gis.province?.map((p) => ({
        label: p.province_name,
        value: p.id, // ✅ ID
        regionId: p.region_id,
      })) ?? [],
    [gis.province],
  );

  const municipalityData = useMemo(
    () =>
      gis.municipality?.map((m) => ({
        label: m.municipality_name,
        value: m.id, // ✅ ID
        provinceId: m.province_id,
        regionId: m.region_id,
      })) ?? [],
    [gis.municipality],
  );

  const barangayData = useMemo(
    () =>
      gis.barangay?.map((b) => ({
        label: b.barangay_name,
        value: b.id, // ✅ ID
        municipalityId: b.municipality_id,
        provinceId: b.province_id,
        regionId: b.region_id,
      })) ?? [],
    [gis.barangay],
  );

  const subdivisionData = useMemo(
    () =>
      gis.subdivision?.map((s) => ({
        label: s.subdivision_name,
        value: s.id, // ✅ ID
        barangayId: s.barangay_id,
      })) ?? [],
    [gis.subdivision],
  );

  const streetData = useMemo(
    () =>
      gis.street?.map((st) => ({
        label: st.street_name,
        value: st.id, // ✅ ID
        subdivisionId: st.subdivision_id,
      })) ?? [],
    [gis.street],
  );

  // same pattern for municipality, barangay, subdivision, street

  // Review State
  const [residentForReview, setResidentForReview] = useState(null);

  const isEditMode = Boolean(existingResident?.id);

  const API_URL = import.meta.env.VITE_API_URL;

  const isNonResident = recordType === "NON_RESIDENT";
  const isDistrict2 =
    recordType === "RESIDENT" && recordSubType === "DISTRICT_2";

  const baseUrl = isNonResident
    ? `${API_URL}/api/nonResidentsProfile`
    : `${API_URL}/api/residentsProfile`;

  // User Roles for ID Details Section
  // 🔐 Role-based access for Alagang Valmocina ID section
  // 🔐 Role-based access for Alagang Valmocina ID section
  const { user } = useAuth();

  // Normalize role(s) from backend (supports role or roles)
  const { canManageID } = useRoleAccess(user);

  const a4FrontRef = useRef(null);
  const a4BackRef = useRef(null);
  const [isGeneratingID, setIsGeneratingID] = useState(false);

  const handleGenerateID = async () => {
    try {
      setIsGeneratingID(true);

      // wait for mount
      await new Promise(requestAnimationFrame);
      await new Promise((r) => setTimeout(r, 50));

      if (!a4FrontRef.current || !a4BackRef.current) {
        throw new Error("ID preview not ready");
      }

      // FRONT
      await waitForImages(a4FrontRef.current);
      await exportA4ToJpg(
        a4FrontRef,
        `${newResident.alagangValmocinaID}-FRONT-A4.jpg`,
      );

      // BACK
      await waitForImages(a4BackRef.current);
      await exportA4ToJpg(
        a4BackRef,
        `${newResident.alagangValmocinaID}-BACK-A4.jpg`,
      );

      alert("Front and Back IDs generated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate ID files.");
    } finally {
      setIsGeneratingID(false); // 🔥 UNMOUNT
    }
  };

  //Resident Reducer
  const [newResident, dispatchResident] = useReducer(
    residentReducer,
    existingResident
      ? isNonResident
        ? mapExistingNonResidentToForm(existingResident)
        : mapExistingResidentToForm(existingResident)
      : isNonResident
        ? makeEmptyNonResident(generateBarangayResidentId())
        : makeEmptyResident(generateBarangayResidentId()),
  );

  const [identificationCards, dispatchIdCards] = useReducer(
    identificationCardsReducer,
    idCardsInitialState,
  );

  const displayIdentificationCards = useMemo(() => {
    // CREATE MODE → show 1 blank card
    if (!isEditMode && identificationCards.length === 0) {
      return [{ idTypeId: null, idNumber: "" }];
    }

    // EDIT MODE with existing IDs → show ONLY existing IDs
    return identificationCards;
  }, [isEditMode, identificationCards]);

  const resetReviewState = () => {
    setIsReviewOpen(false);
    setResidentForReview(null);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 200);
  };

  const {
    avatarPreview,
    avatarFile,
    safeAvatarSrc,
    isCameraOpen,
    videoDevices,
    selectedDeviceId,

    videoRef,
    canvasRef,
    fileInputRef,

    handleUploadClick,
    handleFileChange,
    openCamera,
    closeCamera,
    handleCapture,
    resetAvatar,
    switchCamera,
  } = useResidentAvatar(existingResident?.img_url);

  const { isSaving, handleConfirmSubmit } = useResidentSubmit({
    isEditMode,
    isNonResident,
    baseUrl,
    existingResident,
    newResident,
    identificationCards,
    avatarFile,

    buildResidentPayload,
    buildNonResidentPayload,

    regionData,
    provinceData,
    municipalityData,
    barangayData,
    subdivisionData,
    streetData,

    onSaved,
    onClose: handleClose,
    resetAvatar,
    closeCamera,
    resetIdCards: () => dispatchIdCards({ type: ID_CARDS_ACTIONS.RESET }),
    onAfterSave: resetReviewState,
  });

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
  const {
    filteredRegions, // ✅ ADD THIS
    filteredProvinces,
    filteredMunicipalities,
    filteredBarangays,
    filteredSubdivisions,
    filteredStreets,
    handleRegionChange,
    handleProvinceChange,
    handleMunicipalityChange,
    handleBarangayChange,
    handleSubdivisionChange,
    handleStreetChange,
  } = useCascadingAddress({
    resident: newResident,
    recordType, // 🔥 PASS IT HERE
    regionData,
    provinceData,
    municipalityData,
    barangayData,
    subdivisionData,
    streetData,
    dispatchResident,
  });

  const getLabelById = (list, id) =>
    list.find((x) => x.value === id)?.label || "N/A";

  useEffect(() => {
    dispatchResident({
      type: RESIDENT_ACTIONS.SET_MANY,
      payload: {
        recordType,
        recordSubType,
      },
    });
  }, [recordType, recordSubType]);

  useEffect(() => {
    if (isOpen) {
      // Delay setting visible to trigger animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const basePayload = existingResident
      ? isNonResident
        ? mapExistingNonResidentToForm(existingResident)
        : mapExistingResidentToForm(existingResident)
      : isNonResident
        ? makeEmptyNonResident(generateBarangayResidentId())
        : makeEmptyResident(generateBarangayResidentId());

    dispatchResident({
      type: RESIDENT_ACTIONS.RESET,
      payload: {
        ...basePayload,
        recordType,
        recordSubType,
      },
    });

    dispatchIdCards({ type: ID_CARDS_ACTIONS.RESET });

    if (existingResident?.identificationCards?.length) {
      existingResident.identificationCards.forEach((card) => {
        dispatchIdCards({
          type: ID_CARDS_ACTIONS.ADD,
          payload: {
            idTypeId: card.idTypeId,
            idNumber: card.idNumber,
          },
        });
      });
    }

    setResidentForReview(null);
    resetValidation();
  }, [isOpen, existingResident, recordType, recordSubType]);

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

      // 🔑 CONTACT
      contactNumber: formattedContact,

      // 🔑 ADDRESS LABELS (FOR REVIEW ONLY)
      region: getLabelById(regionData, newResident.regionId),
      province: getLabelById(provinceData, newResident.provinceId),
      cityMunicipality: getLabelById(
        municipalityData,
        newResident.municipalityId,
      ),
      barangay: getLabelById(barangayData, newResident.barangayId),

      subdivisionVillage: getLabelById(
        subdivisionData,
        newResident.subdivisionId,
      ),
      streetRoad: getLabelById(streetData, newResident.streetId),

      // 🔑 NON-RESIDENT SUPPORT
      streetAddressLine: isNonResident
        ? newResident.streetAddressLine
        : undefined,

      // 🔑 FLAGS
      identificationCards: reviewIdentificationCards,
      is_non_resident: isNonResident,
    };

    // Do NOT update newResident here (keep it as raw 10 digits)
    setResidentForReview(reviewResident);

    // Now open the review modal
    setIsReviewOpen(true);
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
                        alt="Patient"
                        className="w-32 h-32 rounded-sm object-cover border-4 border-green-900"
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
                          : isDistrict2
                            ? "Update District 2 Resident Record"
                            : "Update Resident Record"
                        : isNonResident
                          ? "Add Non-Resident Record"
                          : isDistrict2
                            ? "Add District 2 Resident Record"
                            : "Add Resident Record"}
                    </h2>

                    <p className="text-xs text-gray-500">
                      {isNonResident
                        ? "Create a new non-resident profile"
                        : isDistrict2
                          ? "Create a new District 2 health & wellness resident profile"
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
                  regionData={filteredRegions}
                  provinceOptions={filteredProvinces}
                  municipalityOptions={filteredMunicipalities}
                  barangayOptions={filteredBarangays}
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
                  regionData={filteredRegions}
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
                        ? isDistrict2
                          ? "Update District 2 Resident Record"
                          : "Update Resident Record"
                        : isDistrict2
                          ? "Add District 2 Resident Record"
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
        recordSubType={recordSubType}
      />

      {isGeneratingID && (
        <div className="fixed -left-[99999px] top-0 pointer-events-none">
          <GenerateIDPreview
            ref={a4FrontRef}
            resident={newResident}
            avatar={avatarPreview}
          />
          <GenerateIDBackPreview ref={a4BackRef} resident={newResident} />
        </div>
      )}
    </div>
  );
};

export default PatientsProfileModal;
