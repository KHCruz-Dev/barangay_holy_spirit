const pool = require("../config/db");
const { getAllNameSuffix } = require("../models/hrisNameSuffixModel");

async function getAllNameSuffixHandler(req, res) {
  try {
    const suffix = await getAllNameSuffix();
    res.json(suffix);
  } catch (error) {
    console.error("Error fetching name suffix:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllNameSuffixHandler,
};
