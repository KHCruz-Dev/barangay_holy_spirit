// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all regions
async function getAllRegions() {
  const result = await pool.query(`
    SELECT *
    FROM gis_regions
    ORDER BY 
      CASE 
        WHEN region = 'NCR/Metro Manila' THEN 1
        WHEN region = 'CAR' THEN 2
        WHEN region = 'Region I' THEN 3
        WHEN region = 'Region II' THEN 4
        WHEN region = 'Region III' THEN 5
        WHEN region = 'Region IV-A' THEN 6
        WHEN region = 'Region IV-B' THEN 7
        WHEN region = 'Region V' THEN 8
        WHEN region = 'Region VI' THEN 9
        WHEN region = 'Region VII' THEN 10
        WHEN region = 'Region VIII' THEN 11
        WHEN region = 'Region IX' THEN 12
        WHEN region = 'Region X' THEN 13
        WHEN region = 'Region XI' THEN 14
        WHEN region = 'Region XII' THEN 15
        WHEN region = 'Region XIII' THEN 16
        WHEN region = 'BARMM' THEN 99
        ELSE 50
      END,
      region_name ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllRegions,
};
