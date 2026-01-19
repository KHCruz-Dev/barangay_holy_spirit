import { useState } from "react";

export function useResidentSubmit({
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
  onClose,

  // 🔥 IMPORTANT: reset review modal state
  onAfterSave,

  resetAvatar,
  closeCamera,
  resetIdCards,
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirmSubmit = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      /* ===============================
         BUILD PAYLOAD
      =============================== */
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

      const url = isEditMode ? `${baseUrl}/${existingResident.id}` : baseUrl;

      const method = isEditMode ? "PUT" : "POST";

      /* ===============================
         SAVE RESIDENT
      =============================== */
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

      /* ===============================
         UPLOAD AVATAR (OPTIONAL)
      =============================== */
      if (avatarFile && residentId) {
        const photoForm = new FormData();
        photoForm.append("photo", avatarFile);

        await fetch(`${baseUrl}/${residentId}/photo`, {
          method: "POST",
          credentials: "include",
          body: photoForm,
        });
      }

      /* ===============================
         SUCCESS FEEDBACK
      =============================== */
      alert(
        isEditMode
          ? "Resident record has been updated."
          : "Resident record has been created."
      );

      /* ===============================
         🔥 POST-SAVE CLEANUP (CRITICAL)
      =============================== */
      await onSaved?.(); // refresh list
      onAfterSave?.(); // ✅ CLOSE REVIEW MODAL
      resetIdCards?.(); // reset ID cards
      resetAvatar?.();
      closeCamera?.();
      onClose?.(); // close main modal
    } catch (err) {
      console.error("Resident submit failed:", err);
      alert(err.message || "Unexpected error while saving resident.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    handleConfirmSubmit,
  };
}
