// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all nationalities
async function getAllNationalities() {
  const result = await pool.query(`
    SELECT *
    FROM hris_nationalities
    ORDER BY 
      CASE 
        WHEN nationality = 'Filipino' THEN 1
        ELSE 2
      END,
      nationality ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllNationalities,
};
