const { getAllProvince } = require("../models/gisProvinceModel");

async function getAllProvinceHandler(req, res) {
  try {
    const province = await getAllProvince();
    res.json(province);
  } catch (error) {
    console.error("Error fetching Provinces:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllProvinceHandler,
};
