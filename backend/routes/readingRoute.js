const express = require("express");
const router = express.Router();
const {
  readingLastest,
  getReadings,
} = require("../controllers/readingController");
const requireAuth = require("../middleware/auth");

router.get("/reading/lastest", requireAuth, readingLastest);

router.get("/reading/:id", requireAuth, getReadings);

module.exports = router;
