// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all gender
async function getAllGender() {
  const result = await pool.query(`
    SELECT *
    FROM hris_gender
    ORDER BY 
      CASE 
        WHEN gender = 'Male' THEN 1
        WHEN gender = 'Female' THEN 2
        WHEN gender = 'Prefer not to say' THEN 98
        WHEN gender = 'Other' THEN 99
        ELSE 3
      END,
      gender ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllGender,
};
