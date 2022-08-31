const deliveryControle = require("../controllers/delivery")
const express = require("express");
const { auth } = require("../middleWares/auth");
const timeout = require('connect-timeout')
const router = express.Router();


router.get("/",auth,deliveryControle.getAll)
router.post("/create",auth,deliveryControle.create)
// router.post("/srch/",deliveryControle.srch)
router.patch("/addInterestedID/:bookID",auth,deliveryControle.addInerested)
router.patch("/changeOwner/:idBook",auth,deliveryControle.complateDelivery)
router.put("/changeUser",auth,deliveryControle.changeUserToDeliverID)
router.delete("/del/:delID",auth,deliveryControle.deleteDelevery)
router.put("/ifNotDeliverd",timeout("60s"),deliveryControle.reduceToOpen)
module.exports = router;