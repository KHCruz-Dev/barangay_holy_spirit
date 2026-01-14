const express = require("express");
const router = express.Router();

const {
  getAllNameSuffixHandler,
} = require("../controllers/hrisNameSuffixController");

router.get("/", getAllNameSuffixHandler);

module.exports = router;
