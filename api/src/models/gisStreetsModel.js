// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all streets
async function getAllStreets() {
  const result = await pool.query("SELECT * FROM gis_streets");
  return result.rows;
}

module.exports = {
  getAllStreets,
};
