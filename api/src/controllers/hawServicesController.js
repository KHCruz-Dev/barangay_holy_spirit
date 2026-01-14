const { getAllServices } = require("../models/hawServicesModel");

async function getAllServicesHandler(req, res) {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllServicesHandler,
};
