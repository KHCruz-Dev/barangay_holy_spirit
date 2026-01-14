const express = require("express");
const router = express.Router();

const {
  getAllProvinceHandler,
} = require("../controllers/gisProvinceController");

router.get("/", getAllProvinceHandler);

module.exports = router;
