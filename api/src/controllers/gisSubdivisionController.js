const { getAllSubdivision } = require("../models/gisSubdivisionModel");

async function getAllSubdivisionHandler(req, res) {
  try {
    const streets = await getAllSubdivision();
    res.json(streets);
  } catch (error) {
    console.error("Error fetching Streets:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllSubdivisionHandler,
};
