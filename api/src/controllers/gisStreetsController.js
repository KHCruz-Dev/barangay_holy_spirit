const { getAllStreets } = require("../models/gisStreetsModel");

async function getAllStreetsHandler(req, res) {
  try {
    const streets = await getAllStreets();
    res.json(streets);
  } catch (error) {
    console.error("Error fetching Streets:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllStreetsHandler,
};
