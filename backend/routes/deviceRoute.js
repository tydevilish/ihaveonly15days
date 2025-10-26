const express = require("express");
const router = express.Router();
const { claim , getAllDevices , getDeviceById , putDeviceById , unClaimDeviceById , deleteDeviceById } = require("../controllers/deviceController");
const requireAuth = require("../middleware/auth");

router.post("/devices/claim", requireAuth, claim);

router.get("/devices", requireAuth , getAllDevices);

router.get("/devices/:id" , requireAuth , getDeviceById);

router.put("/devices/:id", requireAuth ,putDeviceById);

router.put("/devices/:id/unclaim" , requireAuth ,unClaimDeviceById);

router.delete("/devices/:id", requireAuth , deleteDeviceById);

module.exports = router;
