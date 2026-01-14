const express = require("express");
const router = express.Router();

const {
  getAllCivilStatusHandler,
} = require("../controllers/hrisCivilStatusController");

router.get("/", getAllCivilStatusHandler);

module.exports = router;
