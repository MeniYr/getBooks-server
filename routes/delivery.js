const deliveryControle = require("../controllers/delivery")
const express = require("express");
const { auth } = require("../middleWares/auth");
const router = express.Router();

router.get("/",auth,deliveryControle.getAll)
router.post("/create",auth,deliveryControle.create)
// router.post("/srch/",deliveryControle.srch)
router.patch("/addInterestedID/:bookID",auth,deliveryControle.addInerested)
router.patch("/changeOwner/:idBook",auth,deliveryControle.changeUserOnBookAndOwner)
router.patch("/changeUser",auth,deliveryControle.changeUserToDeliverID)
router.delete("/del/:delID",auth,deliveryControle.deleteDelevery)
module.exports = router;