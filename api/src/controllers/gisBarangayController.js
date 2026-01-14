const { getAllBarangay } = require("../models/gisBarangay");

async function getAllBarangayHandler(req, res) {
  try {
    const barangay = await getAllBarangay();
    res.json(barangay);
  } catch (error) {
    console.error("Error fetching barangays:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllBarangayHandler,
};
