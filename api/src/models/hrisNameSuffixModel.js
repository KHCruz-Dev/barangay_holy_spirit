// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all name Suffix
async function getAllNameSuffix() {
  const result = await pool.query(`
    SELECT *
    FROM hris_name_suffix
    ORDER BY
      CASE 
        WHEN suffix_category = 'Mr.' THEN 1
        WHEN suffix_category = 'Mrs.' THEN 2
        WHEN suffix_category = 'Mx.' THEN 3
        ELSE 4
      END,
      suffix_category ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllNameSuffix,
};
