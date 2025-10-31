const express = require("express");
const router = express.Router();
const { register , login , me } = require("../controllers/authController");
const requireAuth = require("../middleware/auth")

router.post("/auth/register", register);

router.post("/auth/login", login);

router.get("/auth/me" , requireAuth , me)

module.exports = router;
