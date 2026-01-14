const express = require("express");
const router = express.Router();

const {
  getAllBarangayHandler,
} = require("../controllers/gisBarangayController");

router.get("/", getAllBarangayHandler);

module.exports = router;
