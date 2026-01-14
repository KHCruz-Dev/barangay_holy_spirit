const express = require("express");
const router = express.Router();

const { getAllStreetsHandler } = require("../controllers/gisStreetsController");

router.get("/", getAllStreetsHandler);

module.exports = router;
