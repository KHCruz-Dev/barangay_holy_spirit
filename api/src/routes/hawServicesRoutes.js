const express = require("express");
const router = express.Router();

const {
  getAllServicesHandler,
} = require("../controllers/hawServicesController");

router.get("/", getAllServicesHandler);

module.exports = router;
