const { getAllNamePrefix } = require("../models/hrisNamePrefixModel");

async function getAllNameprefixHandler(req, res) {
  try {
    const prefix = await getAllNamePrefix();
    res.json(prefix);
  } catch (error) {
    console.error("Error fetching name prefix:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAllNameprefixHandler,
};
