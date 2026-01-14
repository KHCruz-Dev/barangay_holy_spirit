const express = require("express");
const router = express.Router();

const {
  getAllMunicipalityHandler,
} = require("../controllers/gisMunicipalityController");

router.get("/", getAllMunicipalityHandler);

module.exports = router;
