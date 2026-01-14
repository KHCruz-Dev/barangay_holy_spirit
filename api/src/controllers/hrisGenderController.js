const { getAllGender } = require("../models/hrisGenderModel");

async function getAllGenderHandler(req, res) {
  try {
    const gender = await getAllGender();
    res.json(gender);
  } catch (error) {
    console.error("Error fetching Gender:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllGenderHandler,
};
