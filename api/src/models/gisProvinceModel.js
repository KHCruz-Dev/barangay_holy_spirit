// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all province
async function getAllProvince() {
  const result = await pool.query(`
    SELECT *
    FROM gis_province
    ORDER BY 
      CASE 
        WHEN province_name = 'Metro Manila' THEN 1
        ELSE 2
      END,
      province_name ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllProvince,
};
