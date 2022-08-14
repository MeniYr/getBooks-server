const deliveryControle = require("../controllers/delivery")
const express = require("express");
const { auth } = require("../middleWares/auth");
const router = express.Router();

router.get("/",auth,deliveryControle.getAll)
router.post("/create",auth,deliveryControle.create)
router.post("/srch/",deliveryControle.srch)
router.patch("/addInterestedID/:userID",auth,deliveryControle.addInerested)
router.patch("/addInterestedID/:delID",auth,deliveryControle.removeInerested)
router.delete("/del/:delID",auth,deliveryControle.deleteDelevery)
module.exports = router;