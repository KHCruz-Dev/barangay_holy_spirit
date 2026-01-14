// src/models/residentModel.js
const pool = require("../config/db");

function normalizeBoolean(value) {
  return value === true || value === "true";
}

// Get all services
async function getAllServices() {
  const result = await pool.query(
    "SELECT * FROM haw_services ORDER BY service_name ASC"
  );
  return result.rows;
}

module.exports = {
  getAllServices,
};
