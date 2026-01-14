const express = require("express");
const router = express.Router();

const { getAllRegionsHandler } = require("../controllers/gisRegionsController");

router.get("/", getAllRegionsHandler);

module.exports = router;
