// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all barangay
async function getAllBarangay() {
  const result = await pool.query(`
    SELECT *
    FROM gis_barangay
    ORDER BY 
      CASE 
        WHEN barangay_name = 'Holy Spirit' THEN 1
        ELSE 2
      END,
      barangay_name ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllBarangay,
};
