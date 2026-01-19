import { useEffect, useState } from "react";

import {
  getAllGenders,
  getAllCivilStatus,
  getAllNamePrefix,
  getAllNameSuffx,
  getAllNationalities,
  getAllHrisIdTypes,
} from "../../../../../config/services/hris/hrisService";

import {
  getAllBloodTypes,
  getAllServices,
} from "../../../../../config/services/haw/hawService";

import {
  getAllRegions,
  getAllProvince,
  getAllMunicipality,
  getAllBarangay,
  getAllSubdivision,
  getAllStreets,
} from "../../../../../config/services/gis/gisService";

export function useMasterData() {
  const [hris, setHris] = useState({});
  const [haw, setHaw] = useState({});
  const [gis, setGis] = useState({});

  useEffect(() => {
    async function load() {
      const [
        genders,
        civilStatus,
        prefixes,
        suffixes,
        nationalities,
        idTypes,
        bloodTypes,
        services,
        regions,
        province,
        municipality,
        barangay,
        subdivision,
        street,
      ] = await Promise.all([
        getAllGenders(),
        getAllCivilStatus(),
        getAllNamePrefix(),
        getAllNameSuffx(),
        getAllNationalities(),
        getAllHrisIdTypes(),
        getAllBloodTypes(),
        getAllServices(),
        getAllRegions(),
        getAllProvince(),
        getAllMunicipality(),
        getAllBarangay(),
        getAllSubdivision(),
        getAllStreets(),
      ]);

      setHris({
        genders,
        civilStatus,
        prefixes,
        suffixes,
        nationalities,
        idTypes,
      });

      setHaw({ bloodTypes, services });

      setGis({
        regions,
        province,
        municipality,
        barangay,
        subdivision,
        street,
      });
    }

    load();
  }, []);

  return { hris, haw, gis };
}
