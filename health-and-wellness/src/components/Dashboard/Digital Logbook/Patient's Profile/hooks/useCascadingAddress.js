import { useMemo } from "react";
import { RESIDENT_ACTIONS } from "../reducers/residentReducer";

export function useCascadingAddress({
  resident,
  regionData = [],
  provinceData = [],
  municipalityData = [],
  barangayData = [],
  subdivisionData = [],
  streetData = [],
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

    // Barangay Resident → Holy Spirit only
    if (recordSubType === "DEFAULT") {
      return barangayData.filter((b) =>
        b.label?.toLowerCase().includes("holy spirit")
      );
    }

    // District 2 → Allowed barangays by NAME
    if (recordSubType === "DISTRICT_2") {
      return barangayData.filter((b) =>
        ["bagong silangan", "batasan hills", "commonwealth", "payatas"].some(
          (name) => b.label?.toLowerCase().includes(name)
        )
      );
    }

    return [];
  }, [barangayData, resident?.municipalityId, recordSubType]);

  const filteredSubdivisions = useMemo(() => {
    if (!resident?.barangayId) return [];
    return subdivisionData.filter((s) => s.barangayId === resident.barangayId);
  }, [subdivisionData, resident?.barangayId]);

  const filteredStreets = useMemo(() => {
    if (!resident?.subdivisionId) return [];
    return streetData.filter(
      (st) => st.subdivisionId === resident.subdivisionId
    );
  }, [streetData, resident?.subdivisionId]);

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
