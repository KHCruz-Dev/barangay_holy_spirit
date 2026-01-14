// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all name prefix
async function getAllNamePrefix() {
  const result = await pool.query(`
    SELECT *
    FROM hris_name_prefix
    ORDER By prefix_category ASC;
  `);
  return result.rows;
}

module.exports = {
  getAllNamePrefix,
};
