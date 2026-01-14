// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all streets
async function getAllSubdivision() {
  const result = await pool.query("SELECT * FROM gis_subdivision");
  return result.rows;
}

module.exports = {
  getAllSubdivision,
};
