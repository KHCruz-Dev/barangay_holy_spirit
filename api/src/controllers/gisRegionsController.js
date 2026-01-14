const { getAllRegions } = require("../models/gisRegionsModel");

async function getAllRegionsHandler(req, res) {
  try {
    const regions = await getAllRegions();
    res.json(regions);
  } catch (error) {
    console.error("Error fetching Regions:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllRegionsHandler,
};
