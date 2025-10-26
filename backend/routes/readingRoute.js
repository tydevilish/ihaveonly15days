const express = require("express");
const router = express.Router();
const { readingLastest , getReadings } = require("../controllers/readingController")

router.get("/reading/lastest", readingLastest);

router.get("/reading/:id" , getReadings)

module.exports = router;
