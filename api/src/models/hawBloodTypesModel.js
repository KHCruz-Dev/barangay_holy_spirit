// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all blood types
async function getAllBloodTypes() {
  const result = await pool.query(`
    SELECT *
    FROM haw_blood_types
    ORDER BY 
      CASE 
        WHEN blood_type = 'A+' THEN 1
        WHEN blood_type = 'A–' THEN 2
        ELSE 3
      END,
      blood_type ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllBloodTypes,
};
