const express = require("express");
const router = express.Router();

const {
  getAllNameprefixHandler,
} = require("../controllers/hrisNamePrefixController");

router.get("/", getAllNameprefixHandler);

module.exports = router;
