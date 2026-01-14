const { getAllCivilStatus } = require("../models/hrisCivilStatusModel");

async function getAllCivilStatusHandler(req, res) {
  try {
    const civilStatus = await getAllCivilStatus();
    res.json(civilStatus);
  } catch (error) {
    console.error("Error fetching Civil Status:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllCivilStatusHandler,
};
