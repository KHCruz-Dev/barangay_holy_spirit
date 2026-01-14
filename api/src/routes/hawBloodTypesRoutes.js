const express = require("express");
const router = express.Router();

const {
  getAllBloodTypesHandler,
} = require("../controllers/hawBloodTypesController");

router.get("/", getAllBloodTypesHandler);

module.exports = router;
