// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all municipality
async function getAllMunicipality() {
  const result = await pool.query(`
    SELECT *
    FROM gis_municipality
    ORDER BY 
      CASE 
        WHEN municipality_name = 'Quezon City' THEN 1
        ELSE 2
      END,
      municipality_name ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllMunicipality,
};
