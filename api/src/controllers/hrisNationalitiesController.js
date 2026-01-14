const pool = require("../config/db");

const { getAllNationalities } = require("../models/hrisNationalitiesModel");

async function getAllNationalitiesHandler(req, res) {
  try {
    const nationalities = await getAllNationalities();
    res.json(nationalities);
  } catch (error) {
    console.error("Error fetching nationalities:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllNationalitiesHandler,
};
