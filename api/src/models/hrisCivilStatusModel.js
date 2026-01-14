// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all civil status
async function getAllCivilStatus() {
  const result = await pool.query(`
    SELECT *
    FROM hris_civil_status
    ORDER BY 
      CASE 
        WHEN civil_status = 'Single' THEN 1
        WHEN civil_status = 'Married' THEN 2
        WHEN civil_status = 'Unknown' THEN 99
        ELSE 3
      END,
      civil_status ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllCivilStatus,
};
