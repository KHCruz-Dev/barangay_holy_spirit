// import { useState, useEffect } from "react";
// import { REQUIRED_FIELDS } from "../utils/patientConstants";

// export function usePatientValidation(newResident) {
//   const [errors, setErrors] = useState({});
//   const [validationCount, setValidationCount] = useState(0);
//   const [showValidationSummary, setShowValidationSummary] = useState(false);

//   const [touched, setTouched] = useState({});

//   const COMBOBOX_FIELDS = [
//     "region",
//     "province",
//     "cityMunicipality",
//     "barangay",
//     "subdivisionVillage",
//     "streetRoad",
//   ];

//   const validateField = (field, value) => {
//     if (REQUIRED_FIELDS.includes(field)) {
//       if (
//         value === undefined ||
//         value === null ||
//         String(value).trim() === ""
//       ) {
//         return "This field is required.";
//       }
//     }

//     if (field === "contactNumber") {
//       if (!value || !/^\d{10}$/.test(String(value))) {
//         return "Contact number must be exactly 10 digits.";
//       }
//     }

//     if (field === "emergencyContactNumber") {
//       if (value && !/^\d{10}$/.test(String(value))) {
//         return "Emergency contact number must be exactly 10 digits.";
//       }
//     }

//     return "";
//   };

//   const setFieldError = (field, value) => {
//     const err = validateField(field, value);
//     setErrors((prev) => ({ ...prev, [field]: err }));
//     return err;
//   };

//   const clearFieldError = (field) => {
//     setErrors((prev) => {
//       if (!prev[field]) return prev;
//       const next = { ...prev };
//       delete next[field];
//       return next;
//     });
//   };

//   const handleBlur = (field) => {
//     if (COMBOBOX_FIELDS.includes(field)) return;

//     setTouched((prev) => ({ ...prev, [field]: true }));
//     setFieldError(field, newResident[field]);
//   };

//   const validateAll = () => {
//     const newErrors = {};

//     REQUIRED_FIELDS.forEach((field) => {
//       const err = validateField(field, newResident[field]);
//       if (err) newErrors[field] = err;
//     });

//     const contactErr = validateField(
//       "contactNumber",
//       newResident.contactNumber
//     );
//     if (contactErr) newErrors.contactNumber = contactErr;

//     const emergencyErr = validateField(
//       "emergencyContactNumber",
//       newResident.emergencyContactNumber
//     );
//     if (emergencyErr) newErrors.emergencyContactNumber = emergencyErr;

//     const count = Object.keys(newErrors).length;

//     setErrors(newErrors);
//     setValidationCount(count);
//     setShowValidationSummary(count > 0);

//     return { newErrors, count };
//   };

//   const resetValidation = () => {
//     setErrors({});
//     setTouched({});
//     setValidationCount(0);
//     setShowValidationSummary(false);
//   };

//   return {
//     errors,
//     touched,
//     validateAll,
//     handleBlur,
//     validationCount,
//     showValidationSummary,
//     resetValidation,
//     clearFieldError,
//   };
// }

// hooks/usePatientValidation.js
export function usePatientValidation() {
  // 🔥 TEMPORARY: DISABLE ALL VALIDATION FOR DEMO

  return {
    errors: {},

    validateAll: () => {
      return { newErrors: {}, count: 0 }; // ✅ ALWAYS VALID
    },

    handleBlur: () => {},

    validationCount: 0,
    showValidationSummary: false,

    resetValidation: () => {},

    clearFieldError: () => {},
  };
}
