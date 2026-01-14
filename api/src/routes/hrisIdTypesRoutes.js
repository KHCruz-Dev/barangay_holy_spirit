const express = require("express");
const router = express.Router();

const {
  getAllHrisIdTypesHandler,
} = require("../controllers/hrisIdTypesController");

router.get("/", getAllHrisIdTypesHandler);

module.exports = router;
