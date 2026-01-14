const express = require("express");
const router = express.Router();

const {
  getAllNationalitiesHandler,
} = require("../controllers/hrisNationalitiesController");

router.get("/", getAllNationalitiesHandler);

module.exports = router;
