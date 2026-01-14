const { getAllHrisIdTypes } = require("../models/hrisIdTypesModel");

async function getAllHrisIdTypesHandler(req, res) {
  try {
    const idTypes = await getAllHrisIdTypes();
    res.json(idTypes);
  } catch (error) {
    console.error("Error fetching ID types:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllHrisIdTypesHandler,
};
