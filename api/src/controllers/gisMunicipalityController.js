const { getAllMunicipality } = require("../models/gisMunicipality");

async function getAllMunicipalityHandler(req, res) {
  try {
    const municipality = await getAllMunicipality();
    res.json(municipality);
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllMunicipalityHandler,
};
