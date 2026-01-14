// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all gender
async function getAllHrisIdTypes() {
  const result = await pool.query(`
    SELECT *
    FROM hris_id_types
    ORDER BY 
      CASE 
        WHEN id_type = 'PhilHealth ID' THEN 1
        WHEN id_type = 'Quezon City ID' THEN 2
        WHEN id_type = 'Voter’s ID' THEN 3
      END,
      id_type ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllHrisIdTypes,
};
