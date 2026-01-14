const express = require("express");
const router = express.Router();

const { getAllGenderHandler } = require("../controllers/hrisGenderController");

router.get("/", getAllGenderHandler);

module.exports = router;
