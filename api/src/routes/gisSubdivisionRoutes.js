const express = require("express");
const router = express.Router();

const {
  getAllSubdivisionHandler,
} = require("../controllers/gisSubdivisionController");

router.get("/", getAllSubdivisionHandler);

module.exports = router;
