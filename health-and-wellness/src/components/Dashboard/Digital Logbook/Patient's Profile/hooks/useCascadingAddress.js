import { useMemo } from "react";
import { RESIDENT_ACTIONS } from "../reducers/residentReducer";

export function useCascadingAddress({
  resident,
  recordType, // 🔥 ADD THIS
  regionData,
  provinceData,
  municipalityData,
  barangayData,
  subdivisionData,
  streetData,
  dispatchResident,
}) {
  const recordSubType = resident?.recordSubType;

  /* ===============================
     ✅ SAFE FILTERED OPTIONS
     ❌ NO DEFAULT ASSIGNMENT
  =============================== */

  const filteredRegions = useMemo(() => {
    // NCR only (by NAME, not ID)
    return regionData.filter((r) => r.label?.toLowerCase().includes("ncr"));
  }, [regionData]);

  const filteredProvinces = useMemo(() => {
    if (!resident?.regionId) return [];
    return provinceData.filter((p) => p.regionId === resident.regionId);
  }, [provinceData, resident?.regionId]);

  const filteredMunicipalities = useMemo(() => {
    if (!resident?.provinceId) return [];
    return municipalityData.filter((m) => m.provinceId === resident.provinceId);
  }, [municipalityData, resident?.provinceId]);

  const filteredBarangays = useMemo(() => {
    if (!resident?.municipalityId) return [];

    const byMunicipality = barangayData.filter(
      (b) => b.municipalityId === resident.municipalityId,
    );

    // ✅ NON-RESIDENT → ALL barangays
    if (recordType === "NON_RESIDENT") {
      return byMunicipality;
    }

    // DEFAULT → Holy Spirit only
    if (recordSubType === "DEFAULT") {
      return byMunicipality.filter((b) =>
        b.label?.toLowerCase().includes("holy spirit"),
      );
    }

    // DISTRICT 2
    if (recordSubType === "DISTRICT_2") {
      return byMunicipality.filter((b) =>
        ["bagong silangan", "batasan hills", "commonwealth", "payatas"].some(
          (name) => b.label?.toLowerCase().includes(name),
        ),
      );
    }

    return [];
  }, [
    barangayData,
    resident?.municipalityId,
    recordSubType,
    recordType, // ✅ IMPORTANT
  ]);

  const filteredSubdivisions = useMemo(() => {
    if (!resident?.barangayId) return [];
    return subdivisionData.filter((s) => s.barangayId === resident.barangayId);
  }, [subdivisionData, resident?.barangayId]);

  const filteredStreets = useMemo(() => {
    if (resident?.subdivisionId) {
      const bySubdivision = streetData.filter(
        (st) => st.subdivisionId === resident.subdivisionId,
      );

      if (bySubdivision.length > 0) return bySubdivision;
    }

    // 🔁 FALLBACK: barangay-based streets
    if (resident?.barangayId) {
      return streetData.filter((st) => st.barangayId === resident.barangayId);
    }

    return [];
  }, [streetData, resident?.subdivisionId, resident?.barangayId]);

  /* ===============================
     🔁 CHANGE HANDLERS
     ❌ NEVER AUTO-ASSIGN
  =============================== */

  const set = (payload) =>
    dispatchResident({
      type: RESIDENT_ACTIONS.SET_MANY,
      payload,
    });

  return {
    filteredRegions,
    filteredProvinces,
    filteredMunicipalities,
    filteredBarangays,
    filteredSubdivisions,
    filteredStreets,

    handleRegionChange: (id) =>
      set({
        regionId: id,
        provinceId: undefined,
        municipalityId: undefined,
        barangayId: undefined,
        subdivisionId: undefined,
        streetId: undefined,
      }),

    handleProvinceChange: (id) =>
      set({
        provinceId: id,
        municipalityId: undefined,
        barangayId: undefined,
        subdivisionId: undefined,
        streetId: undefined,
      }),

    handleMunicipalityChange: (id) =>
      set({
        municipalityId: id,
        barangayId: undefined,
        subdivisionId: undefined,
        streetId: undefined,
      }),

    handleBarangayChange: (id) =>
      set({
        barangayId: id,
        subdivisionId: undefined,
        streetId: undefined,
      }),

    handleSubdivisionChange: (id) =>
      set({
        subdivisionId: id,
        streetId: undefined,
      }),

    handleStreetChange: (id) =>
      set({
        streetId: id,
      }),
  };
}
