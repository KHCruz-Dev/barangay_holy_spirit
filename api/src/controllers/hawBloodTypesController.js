const { getAllBloodTypes } = require("../models/hawBloodTypesModel");

async function getAllBloodTypesHandler(req, res) {
  try {
    const bloodType = await getAllBloodTypes();
    res.json(bloodType);
  } catch (error) {
    console.error("Error fetching blood type:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllBloodTypesHandler,
};
